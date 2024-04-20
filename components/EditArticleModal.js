import {
  CCModal,
  CCButton,
  CCCheckBox,
  CCTextInput,
  CCImageUploader,
} from './Common';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_ARTICLE} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';

const EditArticleValidationSchema = yup.object({
  title: yup.string().required('Please enter article title.'),
  image: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
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
          subject: article?.subject,
          image: '',
          title: article?.title,
          description: article?.description,
          author: article?.author,
          visible: article?.visible,
        }}
        validationSchema={EditArticleValidationSchema}
        onSubmit={values => {
          const articleInput = {};
          if (values.subject) {
            articleInput.subject = values.subject;
          }
          if (values.image) {
            articleInput.image = values.image;
          }
          if (values.title) {
            articleInput.title = values.title;
          }
          if (values.description) {
            articleInput.description = values.description;
          }
          if (values.author) {
            articleInput.author = values.author;
          }
          if (values.visible) {
            articleInput.visible = values.visible;
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
                required
                label="Subject"
                error={errors.subject}
                touched={touched.subject}
                onChangeText={handleChange('subject')}
                onBlur={handleBlur('subject')}
                value={values.subject}
                editable={!submitting}
              />
              <CCImageUploader
                required
                label="Image"
                error={errors.image}
                touched={touched.image}
                onChangeImage={value => {
                  setFieldValue('image', value);
                }}
                value={values.image}
                disabled={submitting}
                prevImage={article?.image}
                imageProps={{width: 800, height: 450, cropping: true}}
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
