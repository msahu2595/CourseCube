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
import {EDIT_BUNDLE_CONTENT} from '@mutations';
import {showMessage} from 'react-native-flash-message';

const sizes = {
  Video: {width: 400, height: 225, cropping: true},
  Test: {width: 400, height: 400, cropping: true},
  Document: {width: 300, height: 400, cropping: true},
};

const EditBundleContentValidationSchema = yup.object({
  subject: yup.string().required('Please enter subject.'),
  image: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
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

const EditBundleContentModal = ({
  bundleId,
  subjectId,
  bundleContent,
  onClose,
}) => {
  const [editBundleContent, {loading: submitting}] = useMutation(
    EDIT_BUNDLE_CONTENT,
    {
      onCompleted: () => {
        onClose();
        showMessage({
          message: 'Course content is successfully edited.',
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
              type: bundleContent?.type,
            },
          },
        },
      ],
    },
  );

  return (
    <CCModal
      title="Edit Course Content"
      visible={!!bundleContent}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          subject: bundleContent?.subject,
          image: '',
          title: bundleContent?.title,
          media: bundleContent?.media?._id,
          type: bundleContent?.type,
          highlight: bundleContent?.highlight,
          language: bundleContent?.language,
          index: bundleContent?.index,
          description: bundleContent?.description,
          visible: bundleContent?.visible,
        }}
        validationSchema={EditBundleContentValidationSchema}
        onSubmit={values => {
          const bundleContentInput = {
            media: values.media,
            type: values.type,
          };
          if (values.subject && values.subject !== bundleContent?.subject) {
            bundleContentInput.subject = values.subject;
          }
          if (values.image) {
            bundleContentInput.image = values.image;
          }
          if (values.title && values.title !== bundleContent?.title) {
            bundleContentInput.title = values.title;
          }
          if (values.language && values.language !== bundleContent?.language) {
            bundleContentInput.language = values.language;
          }
          if (
            values.description &&
            values.description !== bundleContent?.description
          ) {
            bundleContentInput.description = values.description;
          }
          if (values.visible && values.visible !== bundleContent?.visible) {
            bundleContentInput.visible = values.visible;
          }
          if (
            values.highlight &&
            values.highlight !== bundleContent?.highlight
          ) {
            bundleContentInput.highlight = values.highlight;
          }
          if (values.index && values.index !== bundleContent?.index) {
            bundleContentInput.index = values.index;
          }
          editBundleContent({
            variables: {
              bundleId,
              bundleContentId: bundleContent?._id,
              bundleContentInput,
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
                prevImage={bundleContent?.image}
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

export default EditBundleContentModal;
