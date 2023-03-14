import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';
import {EDIT_DOCUMENT} from 'apollo/mutations/EDIT_DOCUMENT';

const EditDocumentValidationSchema = yup.object({
  title: yup.string().required('Please enter Document title.'),
  url: yup
    .string()
    .url('invalid video url')
    .required('Please enter Document title.'),
  pages: yup.number().required('Please enter pages name.'),
});

const EditDocumentModal = ({document, onClose}) => {
  const [editDocument, {loading}] = useMutation(EDIT_DOCUMENT, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your Document Successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      console.log(err);
      showMessage({
        message: 'We have got some error. Please try again!',
        type: 'danger',
      });
    },
    refetchQueries: ['Documents'],
  });

  console.log(document, !document, !!document);

  return (
    <CCModal title="Edit Document" visible={!!document} onClose={onClose}>
      <Formik
        initialValues={{
          title: document?.title,
          url: document?.url,
          pages: document?.pages,
        }}
        validationSchema={EditDocumentValidationSchema}
        onSubmit={values => {
          editDocument({
            variables: {
              documentId: document._id,
              documentInput: {
                title: values.title,
                url: values.url,
                pages: values.pages,
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
                errors={errors}
                touched={touched}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                editable={!loading}
                style={tw`text-black`}
              />

              <CCTextInput
                required
                label="url"
                errors={errors}
                touched={touched}
                onChangeText={handleChange('url')}
                onBlur={handleBlur('url')}
                value={values.url}
                editable={!loading}
                style={tw`text-black`}
              />
              <CCTextInput
                required
                label="Pages"
                errors={errors}
                touched={touched}
                onChangeText={handleChange('pages')}
                onBlur={handleBlur('pages')}
                value={values.pages}
                editable={!loading}
                style={tw`text-black`}
              />
            </View>
            <CCButton
              label="Submit"
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
