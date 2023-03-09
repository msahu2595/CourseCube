import {SafeAreaContainer} from '@components';
import {useMutation} from '@apollo/client';
import {ADD_HEADLINE} from '@mutations';
import * as Yup from 'yup';
import React from 'react';
import tw from 'twrnc';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ValidationSchema = Yup.object().shape({
  url: Yup.string().url('Invalid URL').required('URL is required'),
});
const AddHeadlineScreen = () => {
  console.log(loading);
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
            createHeadline({
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
              <Text style={tw`mx-2`}>Description :</Text>
              <View
                style={tw`mt-2 flex flex-row border border-black rounded-lg`}>
                <MaterialCommunityIcons
                  style={tw`border-r p-1 border-b-black`}
                  name="link"
                  color="#4F8EF7"
                  size={25}
                />
                <TextInput
                  editable={!loading}
                  placeholder="Enter description"
                  onChangeText={handleChange('description')}
                  value={values.description}
                  onBlur={handleBlur('description')}
                  style={tw`h-10 w-80 p-2 font-popLight`}
                />
              </View>
              {errors.description && touched.description && (
                <Text>{errors.description}</Text>
              )}
              <View style={tw`m-3 shadow-sm`}>
                <TouchableOpacity
                  disabled={loading}
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
                  {loading && (
                    <ActivityIndicator animating={true} size="small" />
                  )}
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
