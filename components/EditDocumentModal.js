import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_DOCUMENT} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';

const EditDocumentValidationSchema = yup.object({
  title: yup.string().required('Please enter document title.'),
  url: yup
    .string()
    .url('Invalid video url')
    .required('Please enter document url.'),
  pages: yup.number().required('Please enter pages.'),
});

const EditDocumentModal = ({document, onClose}) => {
  const [editDocument, {loading}] = useMutation(EDIT_DOCUMENT, {
    onCompleted: data => {
      onClose();
      showMessage({
        message: 'Document is successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred',
        type: 'danger',
      });
    },
    refetchQueries: ['documents'],
  });

  console.log(document);

  return (
    <CCModal title="Edit Document" visible={!!document} onClose={onClose}>
      <Formik
        initialValues={{
          title: document?.title,
          url: document?.url,
          pages: document?.pages.toString(),
        }}
        validationSchema={EditDocumentValidationSchema}
        onSubmit={values => {
          editDocument({
            variables: {
              documentId: document._id,
              documentInput: {
                title: values.title,
                url: values.url,
                pages: parseInt(values.pages, 10),
              },
            },
          });
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={tw`py-2`}>
              <CCTextInput
                required
                label="Title"
                error={errors.title}
                touched={touched.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                editable={!loading}
              />
              <CCTextInput
                required
                label="URL"
                error={errors.url}
                touched={touched.url}
                onChangeText={handleChange('url')}
                onBlur={handleBlur('url')}
                value={values.url}
                editable={!loading}
              />
              <CCTextInput
                required
                label="Pages"
                error={errors.pages}
                touched={touched.pages}
                onChangeText={handleChange('pages')}
                onBlur={handleBlur('pages')}
                value={values.pages}
                editable={!loading}
              />
            </View>
            <CCButton
              label="Submit"
              loading={loading}
              disabled={loading}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default EditDocumentModal;
