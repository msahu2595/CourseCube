import {useMutation} from '@apollo/client';
import {SafeAreaContainer} from '@components';
import React from 'react';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {EDIT_BUNDLE_CONTENT} from 'apollo/mutations/EDIT_BUNDLE_CONTENT';
import {CCButton, CCModal, CCRadio, CCTextInput} from './Common';

const ValidationSchema = Yup.object().shape({
  description: Yup.string(),
  image: Yup.string(),
  language: Yup.string(),
  subject: Yup.string(),
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required title'),
});

const EditBundleContentModal = ({bundleContent, onClose}) => {
  const [editBundleContent, {loading}] = useMutation(EDIT_BUNDLE_CONTENT, {
    onCompleted: data => {
      console.log(' ==> editBundleContent', data);
      onClose();
      showMessage({
        message: 'BundleContent Edited Successfully.',
        type: 'success',
      });
    },
    onError: error => {
      showMessage({
        message: 'Error on edit',
      });
    },
  });

  console.log('bundleContents', bundleContent);
  // console.log(data, loading, error);

  return (
    <SafeAreaContainer>
      <CCModal title="Edit Content" visible={!!bundleContent} onClose={onClose}>
        <Formik
          initialValues={{
            description: bundleContent?.description,
            image: bundleContent?.image,
            language: bundleContent?.language,
            subject: bundleContent?.subject,
            title: bundleContent?.title,
          }}
          validationSchema={ValidationSchema}
          onSubmit={values => {
            console.log('onsubmit', values);
            editBundleContent({
              variables: {
                bundleContentId: bundleContent._id,
                bundleContentInput: {
                  description: values.description,
                  image: values.image,
                  language: values.language,
                  subject: values.subject,
                  media: bundleContent.media._id,
                  type: bundleContent.type,
                  title: values.title,
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
              <CCTextInput
                label="Description"
                errors={errors}
                touched={touched}
                placeholder="Enter description"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
              />

              <CCTextInput
                label="Image"
                errors={errors}
                touched={touched}
                placeholder="Enter Image Url"
                onChangeText={handleChange('image')}
                onBlur={handleBlur('image')}
                value={values.image}
              />

              <CCRadio
                label="Language"
                errors={errors}
                touched={touched}
                radio_props={[
                  {label: 'Hindi   ', value: 'HI'},
                  {label: 'English', value: 'EN'},
                ]}
                placeholder="Enter language"
                onPress={handleChange('language')}
                value={values.language}
              />

              <CCTextInput
                label="Subject"
                errors={errors}
                touched={touched}
                placeholder="Enter subject"
                onChangeText={handleChange('subject')}
                value={values.subject}
                onBlur={handleBlur('subject')}
              />
              <CCTextInput
                label=" Title"
                errors={errors}
                touched={touched}
                placeholder="Enter  title"
                onChangeText={handleChange(' title')}
                value={values.title}
                onBlur={handleBlur(' title')}
              />
              <CCButton
                disabled={loading}
                label="Submit"
                onPress={() => {
                  console.log('onPressSSSSSSSSSSSSSSSS', values);
                  handleSubmit();
                }}
              />
            </>
          )}
        </Formik>
      </CCModal>
    </SafeAreaContainer>
  );
};

export default EditBundleContentModal;
