import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';
import {EDIT_TEST} from 'apollo/mutations/EDIT_TEST';
import {CCDuration} from './Common/CCDuration';

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
  thumbnail: yup.string().url().nullable(),
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
          thumbnail: test?.thumbnail,
          duration: {
            hours: 1,
            minutes: 0,
            seconds: 0,
          },
        }}
        validationSchema={EditTestValidationSchema}
        onSubmit={values => {
          console.log('values', values);
          const testInput = {
            title: values.title,
            instructions: values.instructions,
            duration: `PT${values.duration.hours}H${values.duration.minutes}M${values.duration.seconds}S`,
          };
          if (values.thumbnail) {
            testInput.thumbnail = values.thumbnail;
          }
          editTest({variables: {testId: test._id, testInput}});
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
                editable={!loading}
                style={tw`text-black`}
              />
              <CCTextInput
                label="Thumbnail"
                error={errors.thumbnail}
                touched={touched.thumbnail}
                onChangeText={handleChange('thumbnail')}
                onBlur={handleBlur('thumbnail')}
                value={values.thumbnail}
                editable={!loading}
                style={tw`text-black`}
              />
              <CCTextInput
                required
                label="Instruction"
                error={errors.instructions}
                touched={touched.instructions}
                onChangeText={handleChange('instructions')}
                onBlur={handleBlur('instructions')}
                value={values.instructions}
                editable={!loading}
                multiline={true}
                numberOfLines={4}
                style={tw`text-black`}
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
