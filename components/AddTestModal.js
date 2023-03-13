import {useMutation} from '@apollo/client';
import {tw} from '@lib';
import {ADD_TEST} from 'apollo/mutations/ADD_TEST';
import {Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCModal, CCTextInput} from './Common';
import * as yup from 'yup';
import {TimePicker} from 'react-native-simple-time-picker';

const AddTestValidationSchema = yup.object({
  title: yup.string().required('Please enter test title.'),
  instructions: yup.string().required('Please enter test instructions.'),
  duration: yup.string().required('Please enter duration time.'),
});

const AddTestModal = ({visible, onClose}) => {
  const [addTest, {loading}] = useMutation(ADD_TEST, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your Test successfully Added',
        type: 'success',
      });
    },
    onError: err => {
      console.log(err);
      showMessage({
        message: 'we have got some error. please try again!',
        type: 'danger',
      });
    },
    refetchQueries: ['tests'],
  });

  return (
    <CCModal title="Add Test " visible={visible} onClose={onClose}>
      <Formik
        initialValues={{
          testInput: {
            title: '',
            instructions: '',
            duration: {
              hours: 1,
              minutes: 0,
              seconds: 0,
            },
          },
        }}
        validationSchema={AddTestValidationSchema}
        onSubmit={values => {
          addTest({
            variables: {
              testInput: {
                title: values.title,
                instructions: values.instructions,
                duration: `PT${values.duration.hours}H${values.duration.minutes}M${values.duration.seconds}S`,
              },
            },
          });
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
                errors={errors}
                touched={touched}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                editable={!loading}
              />
              <CCTextInput
                required
                label="Instructions"
                errors={errors}
                touched={touched}
                onChangeText={handleChange('instructions')}
                onBlur={handleBlur('instructions')}
                value={values.instructions}
                editable={!loading}
                multiline={true}
                numberOfLines={4}
              />

              <TimePicker
                value={values.duration}
                maxHours={5}
                minutesInterval={5}
                hoursUnit="Hours"
                minutesUnit="Minutes"
                onChange={newValue => {
                  setFieldValue('duration', newValue);
                }}
              />
              {errors.duration && touched.duration ? (
                <Text style={tw`text-sm text-red-600 font-avReg p-1`}>
                  {errors.duration}
                </Text>
              ) : null}
              <CCTextInput
                required
                label="Duration"
                errors={errors}
                touched={touched}
                onChangeText={handleChange('duration')}
                onBlur={handleBlur('duration')}
                value={values.duration}
                editable={!loading}
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

export default AddTestModal;
