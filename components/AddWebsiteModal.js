import {useMutation} from '@apollo/client';
import {tw} from '@lib';
import {ADD_WEBSITE} from 'apollo/mutations/ADD_WEBSITE';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import {Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCModal, CCTextInput} from './Common';

const AddSWebsiteValidationSchema = yup.object({
  name: yup.string().required('Please enter  website name.'),
  link: yup
    .string()
    .url('invalid  link')
    .required('Please enter website link.'),
});

const AddWebsiteModal = ({visible, onClose}) => {
  const [addWebsite, {loading}] = useMutation(ADD_WEBSITE, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your website Successfully added.',
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
    refetchQueries: ['websites'],
  });

  return (
    <CCModal title="Add website" visible={visible} onClose={onClose}>
      <Formik
        initialValues={{
          name: '',
          link: '',
        }}
        validationSchema={AddSWebsiteValidationSchema}
        onSubmit={values => {
          console.log(values);
          addWebsite({
            variables: {
              websiteInput: {
                name: values.name,
                link: values.link,
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
            <View style={tw`py-2`}>
              <CCTextInput
                required
                label="Name"
                error={errors.name}
                touched={touched.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                editable={!loading}
              />
              <CCTextInput
                required
                label="Link"
                error={errors.link}
                touched={touched.link}
                onChangeText={handleChange('link')}
                onBlur={handleBlur('link')}
                value={values.link}
                editable={!loading}
              />
            </View>
            <CCButton
              label="Submit"
              disabled={loading}
              onPress={() => {
                console.log('onPress', values);
                handleSubmit();
              }}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default AddWebsiteModal;
