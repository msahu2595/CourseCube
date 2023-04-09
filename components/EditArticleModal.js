import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_ARTICLE} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput, CCCheckBox} from './Common';

const EditArticleValidationSchema = yup.object({
  title: yup.string().required('Please enter article title.'),
  image: yup.string().url('Image should be a link.').nullable(),
  description: yup.string().required('Please enter article description.'),
  author: yup.string().required("Please enter article's author name."),
  visible: yup.boolean(),
});

const EditArticleModal = ({article, onClose}) => {
  const [editArticle, {loading: submitting}] = useMutation(EDIT_ARTICLE, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Article is successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['articles'],
  });

  return (
    <CCModal
      title="Edit Article"
      visible={!!article}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          title: article?.title,
          image: article?.image,
          description: article?.description,
          author: article?.author,
          visible: article?.visible,
        }}
        validationSchema={EditArticleValidationSchema}
        onSubmit={values => {
          const articleInput = {
            title: values.title,
            description: values.description,
            author: values.author,
            visible: values.visible,
          };
          if (values.image) {
            articleInput.image = values.image;
          }
          editArticle({
            variables: {
              articleId: article?._id,
              articleInput,
            },
          });
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
              <CCTextInput
                label="Image"
                error={errors.image}
                touched={touched.image}
                info="Example: https://picsum.photos/195/110"
                onChangeText={handleChange('image')}
                onBlur={handleBlur('image')}
                value={values.image}
                editable={!submitting}
                autoCapitalize="none"
                inputMode="url"
              />
              <CCTextInput
                required
                label="Description"
                error={errors.description}
                touched={touched.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                editable={!submitting}
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
                editable={!submitting}
              />
              <CCCheckBox
                label="If ticked, article immediately visible to users."
                checked={values.visible}
                onPress={value => {
                  setFieldValue('visible', value);
                }}
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

export default EditArticleModal;
