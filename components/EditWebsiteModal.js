import {useMutation} from '@apollo/client';
import {EDIT_WEBSITE} from 'apollo/mutations/EDIT_WEBSITE';
import {Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCModal, CCTextInput} from './Common';
import * as yup from 'yup';
import {tw} from '@lib';

const EditWebsiteValidationSchema = yup.object({
  name: yup.string().required('Please enter  website name.'),
  link: yup
    .string()
    .url('invalid  link')
    .required('Please enter website link.'),
});

const EditWebsiteModal = ({website, onClose}) => {
  const [editWebsite, {loading}] = useMutation(EDIT_WEBSITE, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your video Successfully edited.',
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
    <CCModal title="Edit website" visible={!!website} onClose={onClose}>
      <Formik
        initialValues={{
          id: website?._id,
          name: website?.name,
          link: website?.link,
        }}
        validationSchema={EditWebsiteValidationSchema}
        onSubmit={values => {
          editWebsite({
            variables: {
              websiteId: values.id,
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
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default EditWebsiteModal;
