import React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {CREATE_ADVERT} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCRadio, CCTextInput} from './Common';

const CreateAdvertValidationSchema = Yup.object().shape({
  type: Yup.string().required('Please select type'),
  image: Yup.string()
    .url('Image should be a URL.')
    .required('Please enter image URL.'),
  link: Yup.string().url('Link is not in the correct format.').nullable(),
});

const CreateAdvertModal = ({visible, onClose}) => {
  const [createAdvert, {loading: submitting}] = useMutation(CREATE_ADVERT, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Advertisement is successfully created.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['adverts'],
  });

  return (
    <CCModal
      title="Create Advertisement"
      visible={visible}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          type: 'TINY',
          image: '',
          link: '',
        }}
        validationSchema={CreateAdvertValidationSchema}
        onSubmit={values => {
          const advertInput = {
            type: values.type,
            image: values.image,
          };
          if (values.link) {
            advertInput.link = values.link;
          }
          createAdvert({variables: {advertInput}});
        }}>
        {({
          handleChange,
          setFieldValue,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={tw`py-2`}>
              <CCRadio
                required
                label="Size"
                horizontal={false}
                radio_props={[
                  {label: 'TINY (4/1 Aspect ratio)', value: 'TINY'},
                  {label: 'SMALL (2.5/1 Aspect ratio)', value: 'SMALL'},
                  {label: 'MEDIUM (16/9 Aspect ratio)', value: 'MEDIUM'},
                  {label: 'LARGE (1/1 Aspect ratio)', value: 'LARGE'},
                ]}
                value={values.type}
                onPress={value => {
                  setFieldValue('type', value);
                }}
              />
              <CCTextInput
                required
                label="Image"
                error={errors.image}
                touched={touched.image}
                info="Example: https://picsum.photos/195/110"
                onChangeText={handleChange('image')}
                onBlur={handleBlur('image')}
                value={values.image}
                editable={!submitting}
                autoCapitalize="none"
                inputMode="url"
              />
              <CCTextInput
                label="Link"
                error={errors.link}
                touched={touched.link}
                info="Example: https://www.advert.in/cc_ad1"
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

export default CreateAdvertModal;
