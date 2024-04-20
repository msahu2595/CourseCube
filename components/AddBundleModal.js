import {
  CCRadio,
  CCModal,
  CCButton,
  CCCheckBox,
  CCTextInput,
  CCImageUploader,
} from './Common';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {BUNDLES} from '@queries';
import {ADD_BUNDLE} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';

const sizes = {
  FULL_COURSE: {width: 800, height: 450, cropping: true},
  SUBJECT_COURSE: {width: 800, height: 450, cropping: true},
  PLAYLIST_COURSE: {width: 800, height: 450, cropping: true},
};

const types = {
  FULL_COURSE: 'Full Course',
  SUBJECT_COURSE: 'Subject Course',
  PLAYLIST_COURSE: 'Playlist Course',
};

const ValidationSchema = yup.object().shape({
  subject: yup.string().required('Please enter subject.'),
  image: yup
    .string()
    .required('Please upload image.')
    .matches(/^assets\/tmp\/.*$/gm, 'Image path is not correct.'),
  title: yup.string().required('Please enter title.'),
  type: yup
    .string()
    .oneOf(['FULL_COURSE', 'SUBJECT_COURSE', 'PLAYLIST_COURSE'])
    .required('Please enter course type.'),
  paid: yup.boolean().required(),
  price: yup.number().min(1).max(99999).nullable(),
  offer: yup.number().min(1).max(99999).nullable(),
  offerType: yup.string().oneOf(['PERCENT', 'AMOUNT']).nullable(),
  highlight: yup.string().nullable(),
  language: yup
    .string()
    .oneOf(['HI', 'EN'])
    .required('Please select language.'),
  index: yup.string().nullable(),
  description: yup.string().required('Please enter description.'),
  visible: yup.boolean().required(),
});

const AddBundleModal = ({visible, type, onClose}) => {
  const [addBundle, {loading: submitting}] = useMutation(ADD_BUNDLE, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: `${types?.[type]} is successfully added.`,
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: [{query: BUNDLES, variables: {filter: {type}}}],
  });

  return (
    <CCModal
      title={`Add ${types?.[type]}`}
      visible={visible}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          subject: '',
          image: '',
          title: '',
          type: type,
          paid: false,
          price: '',
          offer: '',
          offerType: 'PERCENT',
          highlight: '',
          language: 'HI',
          index: '',
          description: '',
          visible: true,
        }}
        validationSchema={ValidationSchema}
        onSubmit={(values, {setFieldError}) => {
          const bundleInput = {
            subject: values.subject,
            image: values.image,
            title: values.title,
            type: values.type,
            paid: false,
            language: values.language,
            description: values.description,
            visible: values.visible,
          };
          if (values.paid && values.price && parseInt(values.price, 10)) {
            bundleInput.paid = true;
            bundleInput.price = parseInt(values.price, 10);
            if (values.offer && parseInt(values.offer, 10)) {
              bundleInput.offer = parseInt(values.offer, 10);
              if (
                values.offerType === 'AMOUNT' &&
                parseInt(values.offer, 10) > parseInt(values.price, 10)
              ) {
                setFieldError(
                  'offer',
                  `Offer must be less than or equal to ${values.price}.`,
                );
                return;
              }
              if (
                (values.offerType === 'PERCENT' &&
                  parseInt(values.offer, 10) > 100) ||
                (values.offerType === 'PERCENT' &&
                  parseInt(values.offer, 10) < 0)
              ) {
                setFieldError(
                  'offer',
                  'Offer must be less than or equal to 100.',
                );
                return;
              }
              bundleInput.offerType = values.offerType;
            }
          }
          if (values.highlight) {
            bundleInput.highlight = values.highlight;
          }
          if (values.index) {
            bundleInput.index = values.index;
          }
          addBundle({variables: {bundleInput}});
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
            <View style={tw`py-2`}>
              <CCTextInput
                required
                label="Title"
                error={errors.title}
                touched={touched.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                editable={!submitting}
              />
              <CCTextInput
                required
                label="Subject"
                error={errors.subject}
                touched={touched.subject}
                onChangeText={handleChange('subject')}
                onBlur={handleBlur('subject')}
                value={values.subject}
                editable={!submitting}
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
                imageProps={sizes[values.type]}
              />
              <CCRadio
                required
                label="Language"
                radio_props={[
                  {label: 'Hindi   ', value: 'HI'},
                  {label: 'English   ', value: 'EN'},
                ]}
                value={values.language}
                onPress={value => {
                  setFieldValue('language', value);
                }}
              />
              <CCTextInput
                label="Highlight"
                error={errors.highlight}
                touched={touched.highlight}
                onChangeText={handleChange('highlight')}
                onBlur={handleBlur('highlight')}
                value={values.highlight}
                editable={!submitting}
              />
              <CCTextInput
                required
                label="Description"
                error={errors.description}
                touched={touched.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                editable={!submitting}
                multiline={true}
                numberOfLines={4}
              />
              <CCTextInput
                label="Index"
                error={errors.index}
                touched={touched.index}
                onChangeText={handleChange('index')}
                onBlur={handleBlur('index')}
                value={values.index}
                editable={!submitting}
                multiline={true}
                numberOfLines={4}
              />
              <CCCheckBox
                label="Tick this, if course is paid."
                checked={values.paid}
                onPress={value => {
                  setFieldValue('paid', value);
                }}
              />
              {values.paid && (
                <>
                  <CCTextInput
                    label="Price"
                    error={errors.price}
                    touched={touched.price}
                    info="Min: 1, Max: 99999"
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    value={values.price}
                    editable={!submitting}
                    keyboardType="number-pad"
                  />
                  {!!values.price && (
                    <>
                      <CCTextInput
                        label="Offer"
                        error={errors.offer}
                        touched={touched.offer}
                        onChangeText={handleChange('offer')}
                        onBlur={handleBlur('offer')}
                        value={values.offer}
                        editable={!submitting}
                        keyboardType="number-pad"
                      />
                      {!!values.offer && (
                        <CCRadio
                          label="Offer Type"
                          radio_props={[
                            {label: 'Percent   ', value: 'PERCENT'},
                            {label: 'Amount   ', value: 'AMOUNT'},
                          ]}
                          value={values.offerType}
                          onPress={value => {
                            setFieldValue('offerType', value);
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              )}
              <CCCheckBox
                label="If ticked, course will be immediately visible to users."
                checked={values.visible}
                onPress={value => {
                  setFieldValue('visible', value);
                }}
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

export default AddBundleModal;
