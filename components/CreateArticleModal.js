import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {CREATE_ARTICLE} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';

const AddArticleValidationSchema = yup.object({
  title: yup.string().required('Please enter article title.'),
  description: yup.string().required('Please enter article description.'),
  author: yup.string().required('Please enter author name.'),
});

const CreateArticleModal = ({visible, onClose}) => {
  const [createArticle, {loading}] = useMutation(CREATE_ARTICLE, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your Article Successfully added.',
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
    refetchQueries: ['articles'],
  });

  return (
    <CCModal title="Create Article" visible={visible} onClose={onClose}>
      <Formik
        initialValues={{
          title: '',
          description: '',
          author: '',
        }}
        validationSchema={AddArticleValidationSchema}
        onSubmit={values => {
          createArticle({
            variables: {
              articleInput: {
                title: values.title,
                description: values.description,
                author: values.author,
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
              />
              <CCTextInput
                required
                label="Description"
                errors={errors}
                touched={touched}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                editable={!loading}
                multiline={true}
                numberOfLines={4}
              />
              <CCTextInput
                required
                label="Author"
                errors={errors}
                touched={touched}
                onChangeText={handleChange('author')}
                onBlur={handleBlur('author')}
                value={values.author}
                editable={!loading}
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

export default CreateArticleModal;
