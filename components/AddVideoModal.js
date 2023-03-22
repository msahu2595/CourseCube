import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {ADD_VIDEO} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';

const AddVideoValidationSchema = yup.object({
  videoLink: yup
    .string()
    .trim()
    .matches('^(https?://youtu.be)/.+$', 'Link is not in the correct format.')
    .required('Please enter video link.'),
});

const AddVideoModal = ({visible, onClose}) => {
  const [addVideo, {loading: submitting}] = useMutation(ADD_VIDEO, {
    onCompleted: data => {
      onClose();
      showMessage({
        message: 'Video is successfully added.',
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
      title="Add Video"
      visible={visible}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          videoLink: '',
        }}
        validationSchema={AddVideoValidationSchema}
        onSubmit={values => {
          addVideo({
            variables: {
              videoLink: values.videoLink,
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
                label="Link"
                info="Example: https://youtu.be/-GsvRwiAl0Y"
                error={errors.videoLink}
                touched={touched.videoLink}
                onChangeText={handleChange('videoLink')}
                onBlur={handleBlur('videoLink')}
                value={values.videoLink}
                autoCapitalize="none"
                editable={!submitting}
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

export default AddVideoModal;
