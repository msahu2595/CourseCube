import React from 'react';
import {Text, View, Button, ImageBackground} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {CCModal, CCRadio, CCTextInput} from './Common';
import {EDIT_CONTENT} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';

const AddContentValidationSchema = yup.object({
  subject: yup.string().required('required'),
  image: yup.string().url().required('required'),
  title: yup.string().required('required'),
  type: yup.string().oneOf(['Video', 'Test', 'Document']).required('required'),
  media: yup.string().required('required'),
  paid: yup.boolean().required('required'),
  description: yup.string().required('required'),
  highlight: yup.string().nullable(),
  price: yup.number().nullable(),
  offer: yup.number().nullable(),
  offerType: yup.string().oneOf(['AMOUNT', 'PERCENT']).nullable(),
  language: yup.string().oneOf(['HI', 'EN']).required('required'),
});

const EditContentModal = ({content, onClose}) => {
  const [EditContent, {loading}] = useMutation(EDIT_CONTENT, {
    onCompleted: data => {
      onClose();
      showMessage({
        message: 'Your content Successfully Added.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred.',
        type: 'danger',
      });
    },
    refetchQueries: ['AddContent'],
  });

  return (
    <CCModal title="Add Content" visible={!!content} onClose={onClose}>
      <View style={tw.style(' rounded-lg bg-gray-200 ')}>
        <ImageBackground
          source={{
            uri: content?.thumbnail,
          }}
          resizeMode="cover"
          style={tw`h-40  justify-between`}>
          <View style={tw` h-10 `}>
            <Text
              style={tw` self-end text-xs  text-white p-1 bg-black bg-opacity-40  rounded-bl-lg `}>
              {content?.time}
            </Text>
          </View>
          <View
            style={tw`bg-black bg-opacity-50 text-white p-1 h-10 justify-center`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`text-xs px-1 text-white`}>
              {content?.title}
            </Text>
          </View>
        </ImageBackground>
      </View>

      <Formik
        initialValues={{
          type: content?.type,
          subject: content?.subject,
          image: content?.image,
          title: content?.title,
          description: content?.description,
          highlight: content?.highlight,
          media: content?._id,
          paid: false,
          price: content?.price,
          offer: content?.offer,
          offerType: content?.offerType,
          language: 'HI',
        }}
        validationSchema={AddContentValidationSchema}
        onSubmit={values => {
          console.log('value', values);
          EditContent({
            variables: {
              contentId: content._id,
              contentInput: {
                subject: values.subject,
                image: values.image,
                title: values.title,
                media: values.media,
                type: values.type,
                paid: values.paid,
                price: parseInt(values.price, 10),
                offer: parseInt(values.offer, 10),
                offerType: values.offerType,
                highlight: values.highlight,
                description: values.description,
                language: values.language,
              },
            },
          });
        }}>
        {({
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={tw`py-2`}>
              <CCTextInput
                required
                label="Subject"
                error={errors.subject}
                touched={touched.subject}
                onChangeText={handleChange('subject')}
                onBlur={handleBlur('subject')}
                value={values.subject}
                editable={!loading}
              />

              <CCTextInput
                required
                label="Image"
                error={errors.image}
                touched={touched.image}
                onChangeText={handleChange('image')}
                onBlur={handleBlur('image')}
                value={values.image}
                editable={!loading}
              />
              <CCTextInput
                required
                label="Title"
                error={errors.title}
                touched={touched.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                editable={!loading}
              />
              <CCTextInput
                required
                label="Description"
                error={errors.description}
                touched={touched.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                editable={!loading}
                multiline={true}
                numberOfLines={4}
              />
              <CCTextInput
                label="Highlight"
                error={errors.highlight}
                touched={touched.highlight}
                onChangeText={handleChange('highlight')}
                onBlur={handleBlur('highlight')}
                value={values.highlight}
                editable={!loading}
              />
              <CCRadio
                required
                label="Language"
                onPress={handleChange('language')}
                value={values.language}
                radio_props={[
                  {label: 'Hindi', value: 'HI'},
                  {label: 'English', value: 'EN'},
                ]}
              />

              <CCRadio
                required
                label="Course"
                onPress={value => {
                  setFieldValue('paid', value);
                }}
                radio_props={[
                  {label: 'Free', value: false},
                  {label: 'Paid', value: true},
                ]}
                value={values.paid}
              />

              {values.paid ? (
                <>
                  <CCTextInput
                    label="Price"
                    error={errors.price}
                    touched={touched.price}
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    value={values.price}
                    editable={!loading}
                  />
                  <CCTextInput
                    label="Offer"
                    error={errors.offer}
                    touched={touched.offer}
                    onChangeText={handleChange('offer')}
                    onBlur={handleBlur('offer')}
                    value={values.offer}
                    editable={!loading}
                  />
                  <CCRadio
                    required
                    label="Offer Type"
                    onPress={handleChange('offerType')}
                    value={values.offerType}
                    radio_props={[
                      {label: 'Amount', value: 'AMOUNT'},
                      {label: 'Percent', value: 'PERCENT'},
                    ]}
                  />
                </>
              ) : null}
              <Button
                onPress={() => {
                  handleSubmit();
                }}
                title="Submit"
              />
            </View>
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default EditContentModal;
