import {tw} from '@lib';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import {View} from 'react-native';
import {ADD_TEST} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCModal, CCTextInput, CCDuration} from './Common';

const AddTestValidationSchema = yup.object({
  title: yup.string().required('Required title'),
  duration: yup.object().shape({
    hours: yup
      .number()
      .min(0, 'Too Short!')
      .max(4, 'Too Long!')
      .required('Hours required'),
    minutes: yup
      .number()
      .min(0, 'Too Short!')
      .max(60, 'Too Long!')
      .required('Minutes required'),
    seconds: yup
      .number()
      .min(0, 'Too Short!')
      .max(60, 'Too Long!')
      .required('Seconds required'),
  }),
  instructions: yup.string().required('Instructions required'),
  thumbnail: yup.string().url(),
});

const AddTestModal = ({visible, onClose}) => {
  const [addTest, {loading}] = useMutation(ADD_TEST, {
    onCompleted: data => {
      onClose();
      showMessage({
        message: 'Test is successfully added.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred.',
        type: 'danger',
      });
    },
    refetchQueries: ['tests'],
  });

  return (
    <CCModal title="Add Test" visible={visible} onClose={onClose}>
      <Formik
        initialValues={{
          title: '',
          instructions: '',
          thumbnail: '',
          duration: {
            hours: 1,
            minutes: 0,
            seconds: 0,
          },
        }}
        validationSchema={AddTestValidationSchema}
        onSubmit={values => {
          const testInput = {
            title: values.title,
            instructions: values.instructions,
            duration: `PT${values.duration.hours}H${values.duration.minutes}M${values.duration.seconds}S`,
          };
          if (values.thumbnail) {
            testInput.thumbnail = values.thumbnail;
          }
          addTest({variables: {testInput}});
        }}>
        {({
          handleChange,
          handleBlur,
          setFieldValue,
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
                label="Thumbnail"
                error={errors.thumbnail}
                touched={touched.thumbnail}
                onChangeText={handleChange('thumbnail')}
                onBlur={handleBlur('thumbnail')}
                value={values.thumbnail}
                editable={!loading}
              />
              <CCTextInput
                required
                label="Instructions"
                error={errors.instructions}
                touched={touched.instructions}
                onChangeText={handleChange('instructions')}
                onBlur={handleBlur('instructions')}
                value={values.instructions}
                editable={!loading}
                multiline={true}
                numberOfLines={4}
              />
              <CCDuration
                required
                label="Duration"
                value={values.duration}
                error={errors.duration}
                touched={touched.duration}
                onChange={newValue => {
                  setFieldValue('duration', newValue);
                }}
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

export default AddTestModal;
