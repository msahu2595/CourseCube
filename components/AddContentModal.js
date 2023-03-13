import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {
  Button,
  ImageBackground,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput} from './Common';
import {ADD_CONTENT} from '@mutations';

const AddContentValidationSchema = yup.object({
  subject: yup.string().required('required'),
  image: yup.string().url().required('required'),
  title: yup.string().required('required'),
  type: yup.string().oneOf(['Video', 'Test', 'Document']).required('required'),
  media: yup.string().required('required'),
  paid: yup.boolean().required('required'),
  description: yup.string().required('required'),
  language: yup.string().oneOf(['HI', 'EN']).required('required'),
});

const AddContentModal = ({content, onClose}) => {
  const [AddContent, {loading}] = useMutation(ADD_CONTENT, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your content Successfully edited.',
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
    refetchQueries: ['AddContent'],
  });

  //   console.log(content, 'hello');
  return (
    <CCModal title="Edit content" visible={!!content} onClose={onClose}>
      <View style={tw.style(` rounded-lg bg-gray-200 `)}>
        <ImageBackground
          source={{
            uri: content?.thumbnail,
          }}
          resizeMode="cover"
          style={tw`h-40  justify-between`}>
          <View style={tw` h-10 `}>
            <Text
              style={tw` self-end text-xs  text-white p-1 bg-black bg-opacity-40  rounded-bl-lg `}>
              {content?.time}
            </Text>
          </View>
          <View
            style={tw`bg-black bg-opacity-50 text-white p-1 h-10 justify-center`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`text-xs px-1 text-white`}>
              {content?.title}
            </Text>
          </View>
        </ImageBackground>
      </View>

      <Formik
        initialValues={{
          subject: '',
          image: '',
          title: '',
          type: content?.__typename,
          media: content?._id,
          paid: false,
          description: '',
          language: 'HI',
        }}
        validationSchema={AddContentValidationSchema}
        onSubmit={values => {
          AddContent({
            variables: {
              videoId: values.id,
              contentInput: {
                subject: values.subject,
                image: values.image,
                title: values.title,
                media: values.media,
                type: values.type,
                paid: values.paid,
                description: values.description,
                language: values.language,
              },
            },
          });
        }}>
        {({
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <TextInput
              onChangeText={handleChange('subject')}
              onBlur={handleBlur('subject')}
              value={values.subject}
              placeholder="Subject"
            />
            {errors.subject && touched.subject ? (
              <Text>{errors.subject}</Text>
            ) : null}
            <TextInput
              onChangeText={handleChange('image')}
              onBlur={handleBlur('image')}
              value={values.image}
              placeholder="image"
            />
            {errors.image && touched.image ? <Text>{errors.image}</Text> : null}
            <TextInput
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
              placeholder="title"
            />
            {errors.title && touched.title ? <Text>{errors.title}</Text> : null}
            <View style={tw`flex-1 flex-row  justify-between items-center `}>
              <Text> Content paid </Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={values.paid ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => {
                  console.log(value);
                  setFieldValue('paid', value);
                }}
                value={values.paid}
              />
            </View>
            {errors.paid && touched.paid ? <Text>{errors.paid}</Text> : null}
            <TextInput
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              placeholder="description"
            />
            <TextInput
              onChangeText={handleChange('language')}
              onBlur={handleBlur('language')}
              value={values.language}
              placeholder="language"
            />
            {errors.language && touched.language ? (
              <Text>{errors.language}</Text>
            ) : null}
            <Button
              onPress={() => {
                console.log('handleSubmit', values);
                handleSubmit();
              }}
              title="Submit"
            />
          </View>
        )}
      </Formik>
    </CCModal>
  );
};

export default AddContentModal;
