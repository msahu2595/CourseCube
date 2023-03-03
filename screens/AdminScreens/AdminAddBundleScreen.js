import {useMutation} from '@apollo/client';
import tw from '@lib/tailwind';
import {Formik} from 'formik';
import React from 'react';
import * as Yup from 'yup';
import {ADD_BUNDLE} from '@mutations';
import {Button, Text, TextInput, View} from 'react-native';
import {SafeAreaContainer} from '@components';
import {showMessage} from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ValidationSchema = Yup.object().shape({
  description: Yup.string().min(2, 'Too Short!').required('Required title'),
  image: Yup.string().url('Invalid').required('Required image'),
  paid: Yup.string().required('Required Status'),
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required title'),
  type: Yup.string().required('Required type'),
  language: Yup.string().required('Required language'),
});

const AdminAddBundleScreen = () => {
  const [addBundle, {loading}] = useMutation(ADD_BUNDLE, {
    onCompleted: data => {
      console.log('onCompleted', data);
      showMessage({
        message: 'Test Added Successfully.',
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

  if (loading) return <Text>'Submitting...'</Text>;

  return (
    <SafeAreaContainer>
      <Text>AdminAddBundleScreen</Text>
      <Formik
        initialValues={{
          description: '',
          image: '',
          paid: '',
          title: '',
          type: '',
          language: '',
        }}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          console.log('onSubmit', values);
          addBundle({
            bundleInput: {
              title: values.title,
              description: values.description,
              image: values.image,
              paid: values.paid === 'true' ? true : false,
              type: values.type,
              language: values.language,
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
            {/* <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
              Category
            </Text>
            <TextInput
              placeholder="Enter category"
              onChangeText={handleChange('categories')}
              value={values.categories}
              onBlur={handleBlur('categories')}
              style={tw`h-10 w-80 p-2 font-popLight`}
            />
            {errors.categories && touched.categories && (
              <Text>{errors.categories}</Text>
            )} */}
            <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
              Description
            </Text>
            <View style={tw`flex mt-2 flex-row border border-black rounded-lg`}>
              <MaterialCommunityIcons
                name="format-title"
                size={25}
                style={tw`border-r p-1 border-b-black`}
              />

              <TextInput
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
            {/* <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
              Exams
            </Text>
            <TextInput
              placeholder="Enter exams"
              onChangeText={handleChange('exams')}
              value={values.exams}
              onBlur={handleBlur('exams')}
              style={tw`h-10 w-80 p-2 font-popLight`}
            />
            {errors.exams && touched.exams && <Text>{errors.exams}</Text>} */}
            <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
              Image Link
            </Text>
            <View style={tw`flex mt-2 flex-row border border-black rounded-lg`}>
              <MaterialCommunityIcons
                name="link"
                size={25}
                style={tw`border-r p-1 border-b-black`}
              />

              <TextInput
                placeholder="Enter image"
                onChangeText={handleChange('image')}
                value={values.image}
                onBlur={handleBlur('image')}
                style={tw`h-10 w-80 p-2 font-popLight`}
              />
            </View>
            {errors.image && touched.image && <Text>{errors.image}</Text>}
            {/* <Text>Instructor</Text>
            <TextInput
              placeholder="Enter instructors"
              onChangeText={handleChange('instructors')}
              value={values.instructors}
              onBlur={handleBlur('instructors')}
              style={tw`h-10 w-80 p-2 font-popLight`}
            />
            {errors.instructors && touched.instructors && (
              <Text>{errors.instructors}</Text>
            )} */}

            <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
              Paid
            </Text>
            <View style={tw`flex mt-2 flex-row border border-black rounded-lg`}>
              <MaterialCommunityIcons
                name="format-title"
                size={25}
                style={tw`border-r p-1 border-b-black`}
              />
              <TextInput
                placeholder="Enter paid"
                onChangeText={handleChange('paid')}
                value={values.paid}
                onBlur={handleBlur('paid')}
                style={tw`h-10 w-80 p-2 font-popLight`}
              />
            </View>
            {errors.paid && touched.paid && <Text>{errors.paid}</Text>}
            {/* <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
              Tag
            </Text>
            <TextInput
              placeholder="Enter tags"
              onChangeText={handleChange('tags')}
              value={values.tags}
              onBlur={handleBlur('tags')}
              style={tw`h-10 w-80 p-2 font-popLight`}
            />
            {errors.tags && touched.tags && <Text>{errors.tags}</Text>} */}
            <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
              Title
            </Text>
            <View style={tw`flex mt-2 flex-row border border-black rounded-lg`}>
              <MaterialCommunityIcons
                name="format-title"
                size={25}
                style={tw`border-r p-1 border-b-black`}
              />
              <TextInput
                placeholder="Enter title"
                onChangeText={handleChange('title')}
                value={values.title}
                onBlur={handleBlur('title')}
                style={tw`h-10 w-80 p-2 font-popLight`}
              />
            </View>
            {errors.tags && touched.tags && <Text>{errors.tags}</Text>}
            <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
              Type
            </Text>
            <View style={tw`flex mt-2 flex-row border border-black rounded-lg`}>
              <MaterialCommunityIcons
                name="format-title"
                size={25}
                style={tw`border-r p-1 border-b-black`}
              />
              <TextInput
                placeholder="Enter type"
                onChangeText={handleChange('type')}
                value={values.type}
                onBlur={handleBlur('type')}
                style={tw`h-10 w-80 p-2 font-popLight`}
              />
            </View>
            {errors.type && touched.type && <Text>{errors.type}</Text>}
            <Text style={tw`font-avSemi pl-2 text-base text-gray-600`}>
              Language
            </Text>
            <View style={tw`flex mt-2 flex-row border border-black rounded-lg`}>
              <MaterialCommunityIcons
                name="format-title"
                size={25}
                style={tw`border-r p-1 border-b-black`}
              />
              <TextInput
                placeholder="Enter language"
                onChangeText={handleChange('language')}
                value={values.language}
                onBlur={handleBlur('language')}
                style={tw`h-10 w-80 p-2 font-popLight`}
              />
            </View>
            {errors.language && touched.language && (
              <Text>{errors.language}</Text>
            )}
            <Button
              title="submit"
              onPress={() => {
                console.log('submit', values);
                handleSubmit();
              }}
            />
          </>
        )}
      </Formik>
    </SafeAreaContainer>
  );
};

export default AdminAddBundleScreen;
