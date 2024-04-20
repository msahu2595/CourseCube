import {
  CCRadio,
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
import {BUNDLE_CONTENTS} from '@queries';
import {useMutation} from '@apollo/client';
import {ADD_BUNDLE_CONTENT} from '@mutations';
import {showMessage} from 'react-native-flash-message';

const sizes = {
  Video: {width: 800, height: 450, cropping: true},
  Test: {width: 800, height: 800, cropping: true},
  Document: {width: 600, height: 800, cropping: true},
};

const AddBundleContentValidationSchema = yup.object({
  subject: yup.string().required('Please enter subject.'),
  image: yup
    .string()
    .required('Please upload image.')
    .matches(/^assets\/tmp\/.*$/gm, 'Image path is not correct.'),
  title: yup.string().required('Please enter title.'),
  media: yup.string().required('Please enter media id.'),
  type: yup
    .string()
    .oneOf(['Video', 'Test', 'Document'])
    .required('Please enter media type.'),
  highlight: yup.string().nullable(),
  language: yup
    .string()
    .oneOf(['HI', 'EN'])
    .required('Please select language.'),
  index: yup.string().nullable(),
  description: yup.string().required('Please enter description.'),
  visible: yup.boolean().required(),
});

const AddBundleContentModal = ({bundleId, subjectId, media, onClose}) => {
  const [addBundleContent, {loading: submitting}] = useMutation(
    ADD_BUNDLE_CONTENT,
    {
      onCompleted: () => {
        onClose();
        showMessage({
          message: 'Course content is successfully added.',
          type: 'success',
        });
      },
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
        });
      },
      refetchQueries: [
        {
          query: BUNDLE_CONTENTS,
          variables: {
            bundleId,
            filter: {
              subjectId,
              type: media?.__typename,
            },
          },
        },
      ],
    },
  );

  return (
    <CCModal
      title="Add Course Content"
      visible={!!media}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          subject: '',
          image: '',
          title: media?.title,
          media: media?._id,
          type: media?.__typename,
          highlight: '',
          language: 'HI',
          index: '',
          description: '',
          visible: true,
        }}
        validationSchema={AddBundleContentValidationSchema}
        onSubmit={values => {
          const bundleContentInput = {
            subjectId,
            subject: values.subject,
            image: values.image,
            title: values.title,
            media: values.media,
            type: values.type,
            language: values.language,
            description: values.description,
            visible: values.visible,
          };
          if (values.highlight) {
            bundleContentInput.highlight = values.highlight;
          }
          if (values.index) {
            bundleContentInput.index = values.index;
          }
          addBundleContent({variables: {bundleId, bundleContentInput}});
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
                copyImage={media?.thumbnail}
                imageProps={sizes[values.type]}
              />
              <CCRadio
                required
                label="Language"
                radio_props={[
                  {label: 'Hindi   ', value: 'HI'},
                  {label: 'English   ', value: 'EN'},
                ]}
                value={values.language}
                onPress={value => {
                  setFieldValue('language', value);
                }}
              />
              <CCTextInput
                label="Highlight"
                error={errors.highlight}
                touched={touched.highlight}
                onChangeText={handleChange('highlight')}
                onBlur={handleBlur('highlight')}
                value={values.highlight}
                editable={!submitting}
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
                label="Index"
                error={errors.index}
                touched={touched.index}
                onChangeText={handleChange('index')}
                onBlur={handleBlur('index')}
                value={values.index}
                editable={!submitting}
                multiline={true}
                numberOfLines={4}
              />
              <CCCheckBox
                label="If ticked, this course content will be immediately visible to users."
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

export default AddBundleContentModal;
