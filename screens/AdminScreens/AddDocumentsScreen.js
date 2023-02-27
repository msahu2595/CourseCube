import {ADD_DOCUMENT} from '@mutations';
import {useMutation} from '@apollo/client';
import {Button, Text, TextInput, View} from 'react-native';
import {SafeAreaContainer} from '@components';
import React from 'react';
import tw from 'twrnc';
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
      <View style={tw`m-1 border p-1`}>
        <Text style={tw`font-bold text-gray-900 text-lg`}>DOCUMENT SCREEN</Text>
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
              <Text style={tw`mx-2`}>Title :</Text>
              <View style={tw`flex flex-row border`}>
                <MaterialCommunityIcons
                  name="format-title"
                  size={30}
                  style={tw`border-r-2`}
                />
                <TextInput
                  placeholder="Enter Title"
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                  style={tw`border-b-black`}
                />
              </View>
              {errors.title && touched.title && <Text>{errors.title}</Text>}
              <Text style={tw`mx-2`}>Pages :</Text>
              <TextInput
                placeholder="Enter Pages"
                onChangeText={handleChange('pages')}
                onBlur={handleBlur('pages')}
                value={values.pages}
                style={tw`border m-2 border-b-black`}
                keyboardType="numeric"
              />
              {errors.pages && touched.pages && <Text>{errors.pages}</Text>}
              <Text style={tw`mx-2`}>Url :</Text>
              <View style={tw`flex flex-row border`}>
                <MaterialCommunityIcons
                  style={tw`border border-b-black`}
                  name="link"
                  color="#4F8EF7"
                  size={20}
                />
                <TextInput
                  placeholder="Enter Url"
                  onChangeText={handleChange('url')}
                  value={values.url}
                  onBlur={handleBlur('url')}
                  style={tw`m-2`}
                />
              </View>
              {errors.url && touched.url && <Text>{errors.url}</Text>}
              <Button
                title="Submit"
                onPress={() => {
                  console.log('submit');
                  handleSubmit();
                }}
              />
            </>
          )}
        </Formik>
      </View>
    </SafeAreaContainer>
  );
};

export default AddDocumentsScreen;
