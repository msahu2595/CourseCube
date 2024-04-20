import {
  CCModal,
  CCButton,
  CCTextInput,
  CCCheckBox,
  CCImageUploader,
} from './Common';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {CREATE_ARTICLE} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';

const AddArticleValidationSchema = yup.object({
  subject: yup.string().required("Please enter article's subject."),
  image: yup
    .string()
    .required("Please upload article's image.")
    .matches(/^assets\/tmp\/.*$/gm, 'Image path is not correct.'),
  title: yup.string().required("Please enter article's title."),
  description: yup.string().required("Please enter article's description."),
  author: yup.string().required("Please enter article's author name."),
  visible: yup.boolean(),
});

const CreateArticleModal = ({visible, onClose}) => {
  const [createArticle, {loading: submitting}] = useMutation(CREATE_ARTICLE, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Article is successfully created.',
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
      title="Create Article"
      visible={visible}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          subject: '',
          image: '',
          title: '',
          description: '',
          author: '',
          visible: true,
        }}
        validationSchema={AddArticleValidationSchema}
        onSubmit={values => {
          const articleInput = {
            subject: values.subject,
            image: values.image,
            title: values.title,
            description: values.description,
            author: values.author,
            visible: values.visible,
          };
          createArticle({variables: {articleInput}});
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
                label="If ticked, article will be immediately visible to users."
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

export default CreateArticleModal;
