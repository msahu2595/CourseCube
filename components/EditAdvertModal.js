import {
  CCRadio,
  CCModal,
  CCButton,
  CCTextInput,
  CCImageUploader,
} from './Common';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_ADVERT} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';

const sizes = {
  TINY: {width: 800, height: 200, cropping: true},
  SMALL: {width: 800, height: 320, cropping: true},
  MEDIUM: {width: 800, height: 450, cropping: true},
  LARGE: {width: 800, height: 800, cropping: true},
};

const EditAdvertValidationSchema = yup.object().shape({
  image: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
  link: yup.string().url('Link is not in the correct format.').nullable(),
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
          image: '',
          link: advert?.link,
        }}
        validationSchema={EditAdvertValidationSchema}
        onSubmit={values => {
          const advertInput = {};
          if (values.link) {
            advertInput.link = values.link;
          }
          if (values.image) {
            advertInput.image = values.image;
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
                disabled
                required
                label="Size"
                horizontal={false}
                radio_props={[
                  {label: 'TINY (4/1 Aspect ratio)', value: 'TINY'},
                  {label: 'SMALL (2.5/1 Aspect ratio)', value: 'SMALL'},
                  {label: 'MEDIUM (16/9 Aspect ratio)', value: 'MEDIUM'},
                  {label: 'LARGE (1/1 Aspect ratio)', value: 'LARGE'},
                ]}
                value={advert?.type}
                onPress={value => {
                  setFieldValue('type', value);
                }}
              />
              <CCImageUploader
                required
                label="Image"
                error={errors.image}
                touched={touched.image}
                onChangeImage={value => {
                  setFieldValue('image', value);
                }}
                value={values.image}
                disabled={submitting}
                prevImage={advert?.image}
                imageProps={sizes[advert?.type]}
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
