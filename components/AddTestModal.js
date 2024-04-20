import {
  CCModal,
  CCButton,
  CCDuration,
  CCTextInput,
  CCImageUploader,
} from './Common';
import {tw} from '@lib';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import {View} from 'react-native';
import {ADD_TEST} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';

const AddTestValidationSchema = yup.object({
  title: yup.string().trim().required('Please enter test title.'),
  thumbnail: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
  instructions: yup.string().required('Please enter test instructions.'),
  duration: yup.object().shape({
    hours: yup
      .number()
      .min(0, 'Too Short!')
      .max(5, 'Too Long!')
      .required('Test duration hours required.'),
    minutes: yup
      .number()
      .min(0, 'Too Short!')
      .max(60, 'Too Long!')
      .required('Test duration minutes required.'),
    seconds: yup
      .number()
      .min(0, 'Too Short!')
      .max(60, 'Too Long!')
      .required('Test duration seconds required.'),
  }),
});

const AddTestModal = ({visible, onClose}) => {
  const [addTest, {loading: submitting}] = useMutation(ADD_TEST, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Test is successfully added.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['tests'],
  });

  return (
    <CCModal
      title="Add Test"
      visible={visible}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          title: '',
          instructions: '',
          thumbnail: '',
          duration: {hours: 1, minutes: 0, seconds: 0},
        }}
        validationSchema={AddTestValidationSchema}
        onSubmit={(values, {setFieldError}) => {
          if (!values.duration.hours && !values.duration.minutes) {
            setFieldError('duration', 'Please enter test duration.');
            return;
          }
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
                imageProps={{width: 800, height: 800, cropping: true}}
              />
              <CCTextInput
                required
                label="Instructions"
                error={errors.instructions}
                touched={touched.instructions}
                onChangeText={handleChange('instructions')}
                onBlur={handleBlur('instructions')}
                value={values.instructions}
                editable={!submitting}
                multiline={true}
                numberOfLines={4}
              />
              <CCDuration
                required
                maxHours={5}
                label="Duration"
                error={errors.duration}
                touched={touched.duration}
                info="Min: 5 Mins, Max: 5 Hour 55 Mins & cannot be 0 Hour 0 Min."
                onChange={newValue => {
                  setFieldValue('duration', newValue);
                }}
                value={values.duration}
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

export default AddTestModal;
