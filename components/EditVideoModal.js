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
  title: yup.string().required('Please enter title.'),
  thumbnail: yup.string().required('Please enter thumbnail .'),
});

const EditVideoModal = ({video, onClose}) => {
  const [editVideo, {loading}] = useMutation(EDIT_VIDEO, {
    onCompleted: data => {
      onClose();
      showMessage({
        message: 'Video is successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred',
        type: 'danger',
      });
    },
    refetchQueries: ['videos'],
  });

  return (
    <CCModal title="Edit video" visible={!!video} onClose={onClose}>
      <Formik
        initialValues={{
          title: video?.title,
          thumbnail: video?.thumbnail,
        }}
        validationSchema={EditVideoValidationSchema}
        onSubmit={values => {
          editVideo({
            variables: {
              videoId: video?._id,
              videoInput: {
                title: values.title,
                thumbnail: values.thumbnail,
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
                label="Thumbnail"
                error={errors.thumbnail}
                touched={touched.thumbnail}
                onChangeText={handleChange('thumbnail')}
                onBlur={handleBlur('thumbnail')}
                value={values.thumbnail}
                editable={!loading}
              />
            </View>
            <CCButton
              label="Submit"
              loading={loading}
              disabled={loading}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default EditVideoModal;
