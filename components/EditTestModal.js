import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {Text, View} from 'react-native';
import {EDIT_ARTICLE} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';
import {TimePicker} from 'react-native-simple-time-picker';
import {EDIT_TEST} from 'apollo/mutations/EDIT_TEST';

const EditTestValidationSchema = yup.object({
  title: yup.string().required('Required title'),
  duration: yup.object().shape({
    hours: yup
      .number()
      .min(0, 'Too Short!')
      .max(4, 'Too Long!')
      .required('Hours Required'),
    minutes: yup
      .number()
      .min(0, 'Too Short!')
      .max(60, 'Too Long!')
      .required('Minutes Required'),
    seconds: yup
      .number()
      .min(0, 'Too Short!')
      .max(60, 'Too Long!')
      .required('Seconds Required'),
  }),
  instructions: yup.string().required('Instructions Required'),
});

const EditTestModal = ({test, onClose}) => {
  const [editTest, {loading}] = useMutation(EDIT_TEST, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your Article Successfully edited.',
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
    refetchQueries: ['tests'],
  });

  console.log(test);

  return (
    <CCModal title="Edit Test" visible={!!test} onClose={onClose}>
      <Formik
        initialValues={{
          title: test?.title,
          instructions: test?.instructions,
          duration: {
            hours: '1',
            minutes: '0',
            seconds: '0',
          },
        }}
        validationSchema={EditTestValidationSchema}
        onSubmit={values => {
          editTest({
            variables: {
              testId: values._id,
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
                errors={errors}
                touched={touched}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                editable={!loading}
              />
              <CCTextInput
                required
                label="Instruction"
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

export default EditTestModal;
