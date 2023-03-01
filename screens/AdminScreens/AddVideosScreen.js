import {ADD_VIDEOS} from '@mutations';
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
const AddVideosScreen = () => {
  const [addVideo, {data, loading, error}] = useMutation(ADD_VIDEOS, {
    onCompleted: data => {
      console.log(' ==> addVideo', data);
      showMessage({
        message: 'Videos Added Successfully.',
        type: 'success',
      });
    },
  });

  console.log(data, loading, error);

  if (loading) return <Text>'Submitting...'</Text>;
  if (error) return <Text>`Submission error! ${error.message}`</Text>;
  return (
    <SafeAreaContainer>
      <View style={tw`m-1 shadow p-1`}>
        <Formik
          initialValues={{
            url: '',
          }}
          validationSchema={ValidationSchema}
          onSubmit={values => {
            console.log(values);
            addVideo({
              variables: {
                videoLink: values.url,
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
                  placeholder="Enter Url"
                  onChangeText={handleChange('url')}
                  value={values.url}
                  onBlur={handleBlur('url')}
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

export default AddVideosScreen;
