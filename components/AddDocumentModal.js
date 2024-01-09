import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {ADD_DOCUMENT} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput, CCImageUploader} from './Common';

const AddDocumentsValidationSchema = yup.object({
  title: yup.string().required('Please enter document title.'),
  thumbnail: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
  url: yup
    .string()
    .url('URL is not in the correct format.')
    .required('Please enter document URL.'),
  pages: yup
    .number()
    .min(1, 'Document pages is too short.')
    .max(999, 'Document pages is too long.')
    .required('Please enter document pages.'),
});

const AddDocumentModal = ({visible, onClose}) => {
  const [addDocument, {loading: submitting}] = useMutation(ADD_DOCUMENT, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Document is successfully added.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['documents'],
  });

  return (
    <CCModal
      title="Add Document"
      visible={visible}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          title: '',
          thumbnail: '',
          url: '',
          pages: '',
        }}
        validationSchema={AddDocumentsValidationSchema}
        onSubmit={values => {
          const documentInput = {
            title: values.title,
            url: values.url,
            pages: parseInt(values.pages, 10),
          };
          if (values.thumbnail) {
            documentInput.thumbnail = values.thumbnail;
          }
          addDocument({variables: {documentInput}});
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
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
                editable={!submitting}
              />
              <CCImageUploader
                label="Thumbnail"
                error={errors.thumbnail}
                touched={touched.thumbnail}
                onChangeImage={value => {
                  setFieldValue('thumbnail', value);
                }}
                value={values.thumbnail}
                disabled={submitting}
                imageProps={{width: 300, height: 400, cropping: true}}
              />
              <CCTextInput
                required
                label="URL"
                error={errors.url}
                touched={touched.url}
                info="Example: https://www.africau.edu/images/default/sample.pdf"
                onChangeText={handleChange('url')}
                onBlur={handleBlur('url')}
                value={values.url}
                editable={!submitting}
                autoCapitalize="none"
                inputMode="url"
              />
              <CCTextInput
                required
                label="Pages"
                error={errors.pages}
                touched={touched.pages}
                info="Min: 1 Page, Max: 999 Pages."
                onChangeText={handleChange('pages')}
                onBlur={handleBlur('pages')}
                value={values.pages}
                editable={!submitting}
                keyboardType="number-pad"
              />
            </View>
            <CCButton
              label="Submit"
              loading={submitting}
              disabled={submitting}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default AddDocumentModal;
