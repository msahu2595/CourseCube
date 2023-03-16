import {useMutation} from '@apollo/client';
import {SafeAreaContainer} from '@components';
import React from 'react';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {CCButton, CCModal, CCTextInput} from './Common';
import {EDIT_BUNDLE} from 'apollo/mutations/EDIT_BUNDLE';
import {ScrollView} from 'react-native';

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
      <CCModal title="Edit Content" visible={!!bundle} onClose={onClose}>
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
            values,
            errors,
            touched,
          }) => (
            <ScrollView>
              <CCTextInput
                label="Description"
                errors={errors}
                touched={touched}
                placeholder="Enter description"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
              />
              <CCTextInput
                label="Subject"
                errors={errors}
                touched={touched}
                placeholder="Enter subject"
                onChangeText={handleChange('subject')}
                onBlur={handleBlur('subject')}
                value={values.subject}
              />
              <CCTextInput
                label="Image"
                errors={errors}
                touched={touched}
                placeholder="Enter image"
                onChangeText={handleChange('image')}
                onBlur={handleBlur('image')}
                value={values.image}
              />
              <CCTextInput
                label="paid"
                errors={errors}
                touched={touched}
                placeholder="Enter paid"
                onChangeText={handleChange('paid')}
                onBlur={handleBlur('paid')}
                value={values.paid}
              />
              <CCTextInput
                label="price"
                errors={errors}
                touched={touched}
                placeholder="Enter price"
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
                value={values.price}
              />
              <CCTextInput
                label="offer"
                errors={errors}
                touched={touched}
                placeholder="Enter offer"
                onChangeText={handleChange('offer')}
                onBlur={handleBlur('offer')}
                value={values.offer}
              />
              <CCTextInput
                label="offerType"
                errors={errors}
                touched={touched}
                placeholder="Enter offerType"
                onChangeText={handleChange('offerType')}
                onBlur={handleBlur('offerType')}
                value={values.offerType}
              />

              <CCTextInput
                label="Validity"
                errors={errors}
                touched={touched}
                placeholder="Enter validity"
                onChangeText={handleChange('validity')}
                onBlur={handleBlur('validity')}
                value={values.validity}
              />

              <CCTextInput
                label="Language"
                errors={errors}
                touched={touched}
                placeholder="Enter language"
                onChangeText={handleChange('language')}
                value={values.language}
                onBlur={handleBlur('language')}
              />

              <CCTextInput
                label="Type"
                errors={errors}
                touched={touched}
                placeholder="Enter type"
                onChangeText={handleChange('type')}
                value={values.type}
                onBlur={handleBlur('type')}
              />
              <CCTextInput
                label=" Title"
                errors={errors}
                touched={touched}
                placeholder="Enter  title"
                onChangeText={handleChange('title')}
                value={values.title}
                onBlur={handleBlur(' title')}
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
