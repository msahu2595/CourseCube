import {useMutation} from '@apollo/client';
import {tw} from '@lib';
import {CREATE_ARTICLE} from 'apollo/mutations/CREATE_ARTICLE';
import {Formik} from 'formik';
import React from 'react';
import {Button, ScrollView, Text, TextInput, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import * as yup from 'yup';

const ValidationSchema = yup.object({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  author: yup.string().required('required'),
});

const AdminCreateArticleScreen = ({route}) => {
  const [createArticle, {loading, error}] = useMutation(CREATE_ARTICLE, {
    onCompleted: data => {
      console.log(data);
      showMessage({
        message: 'Your Content Successfully added.',
        type: 'success',
      });
    },
  });

  if (loading) return <Text>'Submitting...';</Text>;
  if (error) return <Text>`Submission error! ${error.message}`;</Text>;

  // console.log(data);
  const item = route.params;

  console.log(item);

  return (
    <ScrollView>
      <View style={tw`m-5 `}>
        <Formik
          initialValues={{
            title: '',
            description: '',
            author: '',
          }}
          validationSchema={ValidationSchema}
          onSubmit={values => {
            console.log('onSubmit', values);
            createArticle({
              variables: {
                articleInput: {
                  title: values.title,
                  description: values.description,
                  author: values.author,
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
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                placeholder="title"
              />
              {errors.title && touched.title ? (
                <Text>{errors.title}</Text>
              ) : null}

              <TextInput
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="description"
              />
              <TextInput
                onChangeText={handleChange('author')}
                onBlur={handleBlur('author')}
                value={values.language}
                placeholder="author"
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
      </View>
    </ScrollView>
  );
};

export default AdminCreateArticleScreen;
