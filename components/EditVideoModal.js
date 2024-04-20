import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_VIDEO} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput, CCImageUploader} from './Common';

const EditVideoValidationSchema = yup.object({
  title: yup.string().trim().required('Please enter video title.'),
  thumbnail: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
});

const EditVideoModal = ({video, onClose}) => {
  const [editVideo, {loading: submitting}] = useMutation(EDIT_VIDEO, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Video is successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['videos'],
  });

  return (
    <CCModal
      title="Edit Video"
      visible={!!video}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          title: video?.title,
          thumbnail: '',
        }}
        validationSchema={EditVideoValidationSchema}
        onSubmit={values => {
          const videoInput = {title: values.title};
          if (values.thumbnail) {
            videoInput.thumbnail = values.thumbnail;
          }
          editVideo({variables: {videoId: video?._id, videoInput}});
        }}>
        {({
          handleChange,
          setFieldValue,
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
                prevImage={video?.thumbnail}
                imageProps={{width: 800, height: 450, cropping: true}}
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

export default EditVideoModal;
