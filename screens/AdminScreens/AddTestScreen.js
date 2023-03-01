import {useMutation} from '@apollo/client';
import {SafeAreaContainer} from '@components';
import tw from '@lib/tailwind';
import {ADD_TEST} from '@mutations';
import React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {Formik} from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TimePicker} from 'react-native-simple-time-picker';

const ValidationSchema = () =>
  Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required title'),
    duration: Yup.object().shape({
      hours: Yup.number()
        .min(0, 'Too Short!')
        .max(4, 'Too Long!')
        .required('Hours Required'),
      minutes: Yup.number()
        .min(0, 'Too Short!')
        .max(60, 'Too Long!')
        .required('Minutes Required'),
      seconds: Yup.number()
        .min(0, 'Too Short!')
        .max(60, 'Too Long!')
        .required('Seconds Required'),
    }),
    instructions: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Instructions Required'),
    totalMarks: Yup.number()
      .required('Total Marks Required')
      .positive()
      .integer(),
    negativeMark: Yup.number()
      .required('Negative Marks Required')
      .negative()
      .integer(),
  });

const AddTestScreen = () => {
  const [addTest, {loading, error}] = useMutation(ADD_TEST, {
    onCompleted: data => {
      console.log('addTest ==> ', data);
      showMessage({
        message: 'Test Added Successfully.',
        type: 'success',
      });
    },
  });

  if (loading) return <Text>'Submitting...'</Text>;

  if (error) return <Text>`Submission error! ${error.message}`</Text>;

  return (
    <SafeAreaContainer>
      <View style={tw`shadow p-2 m-1`}>
        <Formik
          initialValues={{
            title: '',
            duration: {
              hours: 1,
              minutes: 0,
              seconds: 0,
            },
            instructions: '',
            totalMarks: '',
            negativeMark: '',
          }}
          validationSchema={ValidationSchema}
          onSubmit={values => {
            console.log('onSubmit', values);
            addTest({
              variables: {
                testInput: {
                  duration: `PT${values.duration.hours}H${values.duration.minutes}M${values.duration.seconds}S`,
                  instructions: values.instructions,
                  negativeMark: parseInt(values.negativeMark, 10),
                  title: values.title,
                  totalMarks: parseInt(values.totalMarks, 10),
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
              <View>
                <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
                  Title :
                </Text>
                <View
                  style={tw`flex mt-2 flex-row border border-black rounded-lg`}>
                  <MaterialCommunityIcons
                    name="format-title"
                    size={25}
                    style={tw`border-r p-1 border-b-black`}
                  />
                  <TextInput
                    placeholder="Enter Title"
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    value={values.title}
                    style={tw`h-10 w-80 font-popLight`}
                  />
                </View>
                {errors.title && touched.title && <Text>{errors.title}</Text>}
                <Text style={tw`mx-2`}>Duration :</Text>
                <TimePicker
                  value={values.duration}
                  maxHours={5}
                  minutesInterval={5}
                  hoursUnit="Hour"
                  minutesUnit="Minute"
                  onChange={newValue => {
                    setFieldValue('duration', newValue);
                  }}
                />
                {errors.duration && touched.title && (
                  <Text>{errors.title}</Text>
                )}
                <Text style={tw`mx-2`}>Instruction :</Text>
                <View
                  style={tw`flex mt-2 flex-row border border-black rounded-lg`}>
                  <MaterialCommunityIcons
                    name="details"
                    size={25}
                    style={tw`border-r p-1 border-b-black`}
                  />
                  <TextInput
                    placeholder="Enter Instruction"
                    onChangeText={handleChange('instructions')}
                    onBlur={handleBlur('instructions')}
                    value={values.instructions}
                    style={tw`h-10 w-80 font-popLight`}
                  />
                </View>
                {errors.instructions && touched.instructions && (
                  <Text>{errors.instructions}</Text>
                )}
                <Text style={tw`mx-2`}>Total Marks :</Text>
                <TextInput
                  placeholder="Enter Total Marks"
                  onChangeText={handleChange('totalMarks')}
                  onBlur={handleBlur('totalMarks')}
                  value={values.totalMarks}
                  keyboardType="numeric"
                  style={tw`h-10 w-80 font-popLight`}
                />
                {errors.totalMarks && touched.totalMarks && (
                  <Text>{errors.totalMarks}</Text>
                )}
                <Text style={tw`mx-2`}>Negative Mark :</Text>
                <TextInput
                  placeholder="Enter negativeMark"
                  onChangeText={handleChange('negativeMark')}
                  onBlur={handleBlur('negativeMark')}
                  value={values.negativeMark}
                  keyboardType="numeric"
                  style={tw`h-10 w-80 font-popLight border`}
                />
                {errors.negativeMark && touched.negativeMark && (
                  <Text>{errors.negativeMark}</Text>
                )}
              </View>
              <View style={tw`m-3 shadow-sm`}>
                <TouchableOpacity
                  title="Submit"
                  onPress={() => {
                    console.log('submit', values);
                    handleSubmit();
                  }}
                  style={tw`bg-blue-800 rounded-lg p-2`}>
                  <Text
                    style={tw`text-white text-center text-base font-popSemi`}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaContainer>
  );
};

export default AddTestScreen;
