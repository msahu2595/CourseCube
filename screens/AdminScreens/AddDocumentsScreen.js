import {ADD_DOCUMENT} from '@mutations';
import {useMutation} from '@apollo/client';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaContainer} from '@components';
import React, {useState} from 'react';
import tw from '@lib/tailwind';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {Formik} from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required title'),
  pages: Yup.number()
    .required('Required total pages count')
    .positive()
    .integer(),
  url: Yup.string().url('Invalid URL').required('URL is required'),
});

const AddDocumentsScreen = () => {
  const [addDocument, {data, loading, error}] = useMutation(ADD_DOCUMENT, {
    onCompleted: data => {
      console.log(' ==> addDocument', data);
      showMessage({
        message: 'Document Added Successfully.',
        type: 'success',
      });
    },
  });

  console.log(data, loading, error);

  if (loading) return <Text>'Submitting...'</Text>;
  if (error) return <Text>`Submission error! ${error.message}`</Text>;
  return (
    <SafeAreaContainer>
      <View style={tw`m-1 p-2 shadow-sm border-none`}>
        <Formik
          initialValues={{
            title: '',
            pages: '',
            url: '',
          }}
          validationSchema={ValidationSchema}
          onSubmit={values => {
            console.log(values);
            addDocument({
              variables: {
                documentInput: {
                  title: values.title,
                  pages: parseInt(values.pages, 10),
                  url: values.url,
                },
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
              <View style={tw`pb-2`}>
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
              </View>
              {errors.title && touched.title && <Text>{errors.title}</Text>}
              <View style={tw`pb-2`}>
                <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
                  Pages :
                </Text>
                <View
                  style={tw`mt-2 flex flex-row border border-black rounded-lg`}>
                  <MaterialCommunityIcons
                    style={tw`border-r p-1 border-b-black`}
                    name="book-open-page-variant-outline"
                    color="#4F8EF7"
                    size={25}
                  />
                  <TextInput
                    placeholder="Enter Pages"
                    onChangeText={handleChange('pages')}
                    onBlur={handleBlur('pages')}
                    value={values.pages}
                    style={tw`h-10 w-80 font-popLight`}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              {errors.pages && touched.pages && <Text>{errors.pages}</Text>}
              <View style={tw`pb-2`}>
                <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
                  Url :
                </Text>
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
                    style={tw`h-10 w-80 font-popLight`}
                  />
                </View>
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

export default AddDocumentsScreen;
