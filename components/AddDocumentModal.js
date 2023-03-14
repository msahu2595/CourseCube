import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';
import {ADD_DOCUMENT} from 'apollo/mutations/ADD_DOCUMENT';

const AddDocumentsValidationSchema = yup.object({
  title: yup.string().required('Please enter article title.'),
  url: yup
    .string()
    .url('invalid video url')
    .required('Please enter article title.'),
  pages: yup.number().required('Please enter pages name.'),
});

const AddDocumentModal = ({visible, onClose}) => {
  const [AddDocument, {loading}] = useMutation(ADD_DOCUMENT, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your documents Successfully added.',
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
    refetchQueries: ['documents'],
  });

  return (
    <CCModal title="Create Documents" visible={visible} onClose={onClose}>
      <Formik
        initialValues={{
          title: '',
          url: '',
          pages: '',
        }}
        validationSchema={AddDocumentsValidationSchema}
        onSubmit={values => {
          AddDocument({
            variables: {
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
                error={errors.title}
                touched={touched.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                editable={!loading}
                style={tw`text-black`}
              />
              <CCTextInput
                required
                label="url"
                error={errors.url}
                touched={touched.url}
                onChangeText={handleChange('url')}
                onBlur={handleBlur('url')}
                value={values.url}
                editable={!loading}
                style={tw`text-black`}
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
                style={tw`text-black`}
              />
            </View>
            <CCButton
              label="Submit"
              disabled={loading}
              onPress={() => {
                console.log('onPress', values);
                handleSubmit();
              }}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default AddDocumentModal;
