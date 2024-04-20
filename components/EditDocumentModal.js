import {
  CCModal,
  CCButton,
  CCTextInput,
  CCFileUploader,
  CCImageUploader,
} from './Common';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_DOCUMENT} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';

const EditDocumentValidationSchema = yup.object({
  title: yup.string().required('Please enter document title.'),
  thumbnail: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
  url: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
  pages: yup
    .number()
    .min(1, 'Document pages is too short.')
    .max(999, 'Document pages is too long.')
    .required('Please enter document pages.'),
});

const EditDocumentModal = ({document, onClose}) => {
  const [editDocument, {loading: submitting}] = useMutation(EDIT_DOCUMENT, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Document is successfully edited.',
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
      title="Edit Document"
      visible={!!document}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          title: document?.title,
          thumbnail: '',
          url: '',
          pages: document?.pages.toString(),
        }}
        validationSchema={EditDocumentValidationSchema}
        onSubmit={values => {
          const documentInput = {};
          if (values.title && values.title !== document?.title) {
            documentInput.title = values.title;
          }
          if (values.thumbnail && values.thumbnail !== document?.thumbnail) {
            documentInput.thumbnail = values.thumbnail;
          }
          if (values.url && values.url !== document?.url) {
            documentInput.url = values.url;
          }
          if (values.pages && values.pages !== document?.pages) {
            documentInput.pages = parseInt(values.pages, 10);
          }
          editDocument({variables: {documentId: document._id, documentInput}});
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
                prevImage={document?.thumbnail}
                imageProps={{width: 600, height: 800, cropping: true}}
              />
              <CCFileUploader
                required
                label="File"
                error={errors.url}
                touched={touched.url}
                onChangeFile={value => {
                  setFieldValue('url', value);
                }}
                value={values.url}
                disabled={submitting}
                prevFile={document?.url}
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

export default EditDocumentModal;
