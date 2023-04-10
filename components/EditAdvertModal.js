import React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_ADVERT} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCTextInput, CCRadio} from './Common';

const EditAdvertValidationSchema = Yup.object().shape({
  type: Yup.string().required('Please select type'),
  image: Yup.string()
    .url('Image should be a URL.')
    .required('Please enter image URL.'),
  link: Yup.string().url('Link is not in the correct format.').nullable(),
});

const EditAdvertModal = ({advert, onClose}) => {
  const [editAdvert, {loading: submitting}] = useMutation(EDIT_ADVERT, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Advertisement is successfully edited.',
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
      title="Edit Advertisement"
      visible={!!advert}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          type: advert?.type,
          image: advert?.image,
          link: advert?.link,
        }}
        validationSchema={EditAdvertValidationSchema}
        onSubmit={values => {
          const advertInput = {
            type: values.type,
            image: values.image,
          };
          if (values.link) {
            advertInput.link = values.link;
          }
          editAdvert({variables: {advertId: advert._id, advertInput}});
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

export default EditAdvertModal;
