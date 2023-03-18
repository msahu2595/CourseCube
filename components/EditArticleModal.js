import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_ARTICLE} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';

const EditArticleValidationSchema = yup.object({
  title: yup.string().required('Please enter title.'),
  description: yup.string().required('Please enter description.'),
  author: yup.string().required('Please enter author name.'),
});

const EditArticleModal = ({article, onClose}) => {
  const [editArticle, {loading}] = useMutation(EDIT_ARTICLE, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Article is successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred',
        type: 'danger',
      });
    },
    refetchQueries: ['articles'],
  });

  return (
    <CCModal title="Edit Article" visible={!!article} onClose={onClose}>
      <Formik
        initialValues={{
          title: article?.title,
          author: article?.author,
          description: article?.description,
        }}
        validationSchema={EditArticleValidationSchema}
        onSubmit={values => {
          editArticle({
            variables: {
              articleId: article?._id,
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
                error={errors.title}
                touched={touched.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                editable={!loading}
              />
              <CCTextInput
                required
                label="Description"
                error={errors.description}
                touched={touched.description}
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
                error={errors.author}
                touched={touched.author}
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

export default EditArticleModal;
