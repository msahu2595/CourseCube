import {useMutation} from '@apollo/client';
import {SafeAreaContainer} from '@components';
import React from 'react';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {CCButton, CCCheckBox, CCModal, CCRadio, CCTextInput} from './Common';
import {EDIT_BUNDLE} from 'apollo/mutations/EDIT_BUNDLE';
import {ScrollView, Text, View} from 'react-native';
import {tw} from '@lib';

const TextComp = () => (
  <View style={tw`mx-2 flex-1`}>
    <Text style={tw`flex-1 text-justify`}>
      If ticked, course is immediately available to users.
    </Text>
  </View>
);

const ValidationSchema = Yup.object().shape({
  description: Yup.string(),
  subject: Yup.string().nullable(),
  image: Yup.string().url(),
  paid: Yup.string(),
  price: Yup.number().nullable(),
  offer: Yup.string().nullable(),
  offerType: Yup.string().nullable(),
  validity: Yup.string(),
  language: Yup.string(),
  type: Yup.string(),
  title: Yup.string().required('Required title'),
});

const EditBundleModal = ({bundle, onClose}) => {
  const [editBundle, {loading}] = useMutation(EDIT_BUNDLE, {
    onCompleted: data => {
      console.log(' ==> editBundle', data);
      onClose();
      showMessage({
        message: 'Bundle Edited Successfully.',
        type: 'success',
      });
    },
    onError: error => {
      showMessage({
        message: 'Error on edit',
      });
    },
  });

  console.log('bundleContents', bundle);
  // console.log(data, loading, error);

  return (
    <SafeAreaContainer>
      <CCModal title="Edit Courses" visible={!!bundle} onClose={onClose}>
        <Formik
          initialValues={{
            subject: bundle?.subject,
            image: bundle?.image,
            paid: bundle?.paid,
            price: bundle?.price,
            offer: bundle?.offer,
            offerType: bundle?.offerType,
            language: bundle?.language,
            description: bundle?.description,
            validity: bundle?.validity,
            type: bundle?.type,
            title: bundle?.title,
            visible: bundle?.visible,
          }}
          validationSchema={ValidationSchema}
          onSubmit={values => {
            console.log('onsubmit', values);
            const bundleInput = {
              subject: values.subject,
              image: values.image,
              paid: values.paid === 'true' ? true : false,
              language: values.language,
              description: values.description,
              validity: values.validity,
              type: values.type,
              title: values.title,
              visible: values.visible,
            };
            if (values.price) {
              bundleInput.price = parseInt(values.price, 10);
            }
            if (values.offer) {
              bundleInput.offer = values.offer;
            }
            if (values.offerType) {
              bundleInput.offerType = values.offerType;
            }
            if (values.subject) {
              bundleInput.subject = values.subject;
            }
            editBundle({
              variables: {
                bundleId: bundle._id,
                bundleInput,
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
            <ScrollView>
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
              <CCRadio
                label="Language"
                radio_props={[
                  {label: 'Hindi   ', value: 'HI'},
                  {label: 'English', value: 'EN'},
                ]}
                onPress={handleChange('language')}
                value={values.language}
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
              {values.paid ? (
                <>
                  <CCTextInput
                    label="Price"
                    error={errors.price}
                    touched={touched.price}
                    placeholder="Enter price"
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    value={values.price}
                  />
                  <CCTextInput
                    label="Offer"
                    error={errors.offer}
                    touched={touched.offer}
                    placeholder="Enter offer"
                    onChangeText={handleChange('offer')}
                    onBlur={handleBlur('offer')}
                    value={values.offer}
                  />
                  <CCTextInput
                    label="OfferType"
                    error={errors.offerType}
                    touched={touched.offerType}
                    placeholder="Enter offerType"
                    onChangeText={handleChange('offerType')}
                    onBlur={handleBlur('offerType')}
                    value={values.offerType}
                  />
                </>
              ) : null}

              <CCTextInput
                label="Validity"
                error={errors.validity}
                touched={touched.validity}
                placeholder="Enter validity"
                onChangeText={handleChange('validity')}
                onBlur={handleBlur('validity')}
                value={values.validity}
              />

              <CCCheckBox
                onPress={value => {
                  setFieldValue('visible', value);
                }}
                textComponent={<TextComp />}
                isChecked={values.visible}
              />
              <CCButton
                disabled={loading}
                label="Submit"
                onPress={() => {
                  console.log('onPressSSSSSSSSSSSSSSSS', values);
                  handleSubmit();
                }}
              />
            </ScrollView>
          )}
        </Formik>
      </CCModal>
    </SafeAreaContainer>
  );
};

export default EditBundleModal;
