import {ADD_HEADLINE} from '@mutations';
import {useMutation} from '@apollo/client';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaContainer} from '@components';
import React from 'react';
import tw from 'twrnc';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {Formik} from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ValidationSchema = Yup.object().shape({
  url: Yup.string().url('Invalid URL').required('URL is required'),
});
const AddHeadlineScreen = () => {
  const [CreateHeadline, {loading, error}] = useMutation(ADD_HEADLINE, {
    onCompleted: data => {
      console.log('onCompleted', data);
      showMessage({
        message: 'Haedline Added Successfully.',
        type: 'success',
      });
    },
    onError: error => {
      console.log('onError', error.message);
      showMessage({
        message: 'Error.',
        type: 'error',
      });
    },
  });

  console.log(loading, error);

  if (loading) return <Text>'Submitting...'</Text>;
  if (error) return <Text>`Submission error! ${error.message}`</Text>;
  return (
    <SafeAreaContainer>
      <View style={tw`m-1 shadow p-1`}>
        <Formik
          initialValues={{
            description: '',
          }}
          validationSchema={ValidationSchema}
          onSubmit={values => {
            console.log(values);
            CreateHeadline({
              variables: {
                videoLink: values.description,
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
              <Text style={tw`mx-2`}>Url :</Text>
              <View
                style={tw`mt-2 flex flex-row border border-black rounded-lg`}>
                <MaterialCommunityIcons
                  style={tw`border-r p-1 border-b-black`}
                  name="link"
                  color="#4F8EF7"
                  size={25}
                />
                <TextInput
                  placeholder="Enter description"
                  onChangeText={handleChange('description')}
                  value={values.description}
                  onBlur={handleBlur('description')}
                  style={tw`h-10 w-80 p-2 font-popLight`}
                />
              </View>
              {errors.url && touched.url && <Text>{errors.url}</Text>}
              <View style={tw`m-3 shadow-sm`}>
                <TouchableOpacity
                  title="Submit"
                  onPress={() => {
                    console.log('submit');
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

export default AddHeadlineScreen;
