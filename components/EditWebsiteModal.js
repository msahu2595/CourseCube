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
  link: yup
    .string()
    .url('Link is not in the correct format.')
    .required('Please enter website link.'),
});

const EditWebsiteModal = ({website, onClose}) => {
  const [editWebsite, {loading: submitting}] = useMutation(EDIT_WEBSITE, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Website is successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['websites'],
  });

  return (
    <CCModal
      title="Edit Website"
      visible={!!website}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          name: website?.name,
          link: website?.link,
        }}
        validationSchema={EditWebsiteValidationSchema}
        onSubmit={websiteInput => {
          editWebsite({
            variables: {
              websiteId: website?._id,
              websiteInput,
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
                editable={!submitting}
              />
              <CCTextInput
                required
                label="Link"
                error={errors.link}
                touched={touched.link}
                info="Example: https://www.google.com/maps"
                onChangeText={handleChange('link')}
                onBlur={handleBlur('link')}
                value={values.link}
                editable={!submitting}
                autoCapitalize="none"
                inputMode="url"
              />
            </View>
            <CCButton
              label="Submit"
              loading={submitting}
              disabled={submitting}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default EditWebsiteModal;
