import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';
import {ADD_VIDEO} from 'apollo/mutations/ADD_VIDEO';

const AddVideoValidationSchema = yup.object({
  videoLink: yup
    .string()
    .url('invalid video url')
    .required('Please enter article title.'),
});

const AddVideoModal = ({visible, onClose}) => {
  const [addVideo, {loading}] = useMutation(ADD_VIDEO, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your video Successfully added.',
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
    <CCModal title="Add Video" visible={visible} onClose={onClose}>
      <Formik
        initialValues={{
          videoLink: '',
        }}
        validationSchema={AddVideoValidationSchema}
        onSubmit={values => {
          console.log(values);
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
                label="Video"
                errors={errors}
                touched={touched}
                onChangeText={handleChange('videoLink')}
                onBlur={handleBlur('videoLink')}
                value={values.videoLink}
                editable={!loading}
              />
            </View>
            <CCButton
              label="Submit"
              disabled={loading}
              onPress={() => {
                console.log('onpress', values);
                handleSubmit();
              }}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default AddVideoModal;
