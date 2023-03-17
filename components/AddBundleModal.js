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
import {CCModal, CCRadio, CCTextInput} from './Common';

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

const AddBundleModal = ({bundle, onClose}) => {
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
    <CCModal title="Add Courses" visible={!!bundle} onClose={onClose}>
      <SafeAreaContainer>
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
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <>
              <CCTextInput
                label=" Title"
                error={errors.title}
                touched={touched.title}
                placeholder="Enter title"
                onChangeText={handleChange('title')}
                value={values.title}
                onBlur={handleBlur(' title')}
              />

              <CCTextInput
                label="Subject"
                error={errors.subject}
                touched={touched.subject}
                placeholder="Enter subject"
                onChangeText={handleChange('subject')}
                onBlur={handleBlur('subject')}
                value={values.subject}
              />
              <CCTextInput
                label="Image"
                error={errors.image}
                touched={touched.image}
                placeholder="Enter image"
                onChangeText={handleChange('image')}
                onBlur={handleBlur('image')}
                value={values.image}
              />

              <CCTextInput
                label="Description"
                error={errors.description}
                touched={touched.description}
                placeholder="Enter description"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                multiline={true}
                numberOfLines={4}
              />
              <CCRadio
                label="Paid"
                value={values.paid}
                radio_props={[
                  {label: 'Free   ', value: false},
                  {label: 'Paid', value: true},
                ]}
                onPress={value => {
                  setFieldValue('paid', value);
                }}
              />
              <CCRadio
                label="Type"
                radio_props={[
                  {label: 'Full Syllabus   ', value: 'FULL_COURSE'},
                  {label: 'Subject  ', value: 'SUBJECT_COURSE'},
                  {label: 'Playlist', value: 'PLAYLIST_COURSE'},
                ]}
                onPress={handleChange('type')}
                value={values.type}
                formHorizontal={false}
              />

              <CCRadio
                label="Language"
                error={errors.language}
                touched={touched.language}
                radio_props={[
                  {label: 'Hindi   ', value: 'HI'},
                  {label: 'English', value: 'EN'},
                ]}
                value={values.language}
                onPress={handleChange('language')}
              />

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
    </CCModal>
  );
};

export default AddBundleModal;
