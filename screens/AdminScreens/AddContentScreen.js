import {useMutation} from '@apollo/client';
import {tw} from '@lib';
import {ADD_CONTENT} from 'apollo/mutations/ADD_CONTENT';
import {Formik} from 'formik';
import React from 'react';
import {Button, ImageBackground, ScrollView, Text, TextInput, View} from 'react-native';

const AddContentScreen = ({route}) => {
  const [addContent, {data, loading, error}] = useMutation(ADD_CONTENT);

  if (loading) return <Text>'Submitting...';</Text>;
  if (error) return <Text>`Submission error! ${error.message}`;</Text>;

  // console.log(data);
  const item = route.params;

  console.log(item);
  console.log('data', data);

  return (
    <ScrollView>
      <View style={tw.style(` rounded-lg bg-gray-200 `)}>
        <ImageBackground
          source={{
            uri: item.thumbnail,
          }}
          resizeMode="cover"
          style={tw`h-40  justify-between`}>
          <View style={tw` h-10 `}>
            <Text
              style={tw` self-end text-xs  text-white p-1 bg-black bg-opacity-40  rounded-bl-lg `}>
              {item.time}
            </Text>
          </View>
          <View
            style={tw`bg-black bg-opacity-50 text-white p-1 h-10 justify-center`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`text-xs px-1 text-white`}>
              {item.title}
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View style={tw`m-5 `}>
        <Formik
          initialValues={{
            subject: '',
            image: '',
            title: '',
            type: '',
            media: '',
            paid: '',
            description: '',
            language: '',
          }}
          onSubmit={values => {
            console.log(values);
            addContent({
              variables: {
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
          {({handleChange, handleBlur, handleSubmit, values}) => (
            <View>
              <TextInput
                onChangeText={handleChange('subject')}
                onBlur={handleBlur('subject')}
                value={values.subject}
                placeholder="Subject"
              />
              <TextInput
                onChangeText={handleChange('image')}
                onBlur={handleBlur('image')}
                value={values.image}
                placeholder="image"
              />
              <TextInput
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                placeholder="title"
              />
              <TextInput
                onChangeText={handleChange('media')}
                onBlur={handleBlur('media')}
                value={values.media}
                placeholder="media"
              />
              <TextInput
                onChangeText={handleChange('type')}
                onBlur={handleBlur('type')}
                value={values.type}
                placeholder="type"
              />
              <TextInput
                onChangeText={handleChange('paid')}
                onBlur={handleBlur('paid')}
                value={values.paid}
                placeholder="paid"
              />
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
              <Button onPress={handleSubmit} title="Submit" />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default AddContentScreen;
