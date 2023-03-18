import {tw} from '@lib';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import {View} from 'react-native';
import {EDIT_WEBSITE} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCModal, CCTextInput} from './Common';

const EditWebsiteValidationSchema = yup.object({
  name: yup.string().required('Please enter website name.'),
  link: yup.string().url('invalid link').required('Please enter website link.'),
});

const EditWebsiteModal = ({website, onClose}) => {
  const [editWebsite, {loading}] = useMutation(EDIT_WEBSITE, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Website is successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred',
        type: 'danger',
      });
    },
    refetchQueries: ['websites'],
  });

  return (
    <CCModal title="Edit Website" visible={!!website} onClose={onClose}>
      <Formik
        initialValues={{
          name: website?.name,
          link: website?.link,
        }}
        validationSchema={EditWebsiteValidationSchema}
        onSubmit={values => {
          editWebsite({
            variables: {
              websiteId: website?._id,
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
              loading={loading}
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
