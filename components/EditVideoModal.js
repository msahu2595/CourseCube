import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';
import {EDIT_VIDEO} from 'apollo/mutations/EDIT_VIDEO';

const EditVideoValidationSchema = yup.object({
  title: yup.string().required('Please enter Video title.'),
  thumbnail: yup.string().required('Please enter thumbnail .'),
});

const EditVideoModal = ({video, onClose}) => {
  const [editVideo, {loading}] = useMutation(EDIT_VIDEO, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your video Successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      console.log(err);
      showMessage({
        message: 'We have got some error. Please try again!',
        type: 'danger',
      });
    },
    refetchQueries: ['videos'],
  });

  return (
    <CCModal title="Edit video" visible={!!video} onClose={onClose}>
      <Formik
        initialValues={{
          id: video?._id,
          title: video?.title,
          thumbnail: video?.thumbnail,
        }}
        validationSchema={EditVideoValidationSchema}
        onSubmit={values => {
          editVideo({
            variables: {
              videoId: values.id,
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
                multiline={true}
                numberOfLines={4}
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
                multiline={true}
                numberOfLines={4}
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

export default EditVideoModal;
