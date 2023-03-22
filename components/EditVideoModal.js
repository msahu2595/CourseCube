import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_VIDEO} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';

const EditVideoValidationSchema = yup.object({
  title: yup.string().trim().required('Please enter video title.'),
  thumbnail: yup.string().url('Thumbnail should be a link.').nullable(),
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
          thumbnail: video?.thumbnail,
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
              <CCTextInput
                label="Thumbnail"
                error={errors.thumbnail}
                touched={touched.thumbnail}
                info="Example: https://picsum.photos/195/110"
                onChangeText={handleChange('thumbnail')}
                onBlur={handleBlur('thumbnail')}
                value={values.thumbnail}
                editable={!submitting}
                autoCapitalize="none"
                inputMode="url"
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
