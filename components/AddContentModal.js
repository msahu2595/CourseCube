import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {CONTENTS} from '@queries';
import {ADD_CONTENT} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCCheckBox, CCModal, CCRadio, CCTextInput} from './Common';

const AddContentValidationSchema = yup.object({
  subject: yup.string().required('Please enter subject.'),
  image: yup
    .string()
    .url('Image should be a link.')
    .required('Please enter image link.'),
  title: yup.string().required('Please enter title.'),
  media: yup.string().required('Please enter media id.'),
  type: yup
    .string()
    .oneOf(['Video', 'Test', 'Document'])
    .required('Please enter media type.'),
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

const AddContentModal = ({media, onClose}) => {
  const [addContent, {loading: submitting}] = useMutation(ADD_CONTENT, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Content is successfully added.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: [
      {query: CONTENTS, variables: {filter: {type: media?.__typename}}},
    ],
  });

  return (
    <CCModal
      title="Add Content"
      visible={!!media}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          subject: '',
          image: media?.thumbnail,
          title: media?.title,
          media: media?._id,
          type: media?.__typename,
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
        validationSchema={AddContentValidationSchema}
        onSubmit={(values, {setFieldError}) => {
          const contentInput = {
            subject: values.subject,
            image: values.image,
            title: values.title,
            media: values.media,
            type: values.type,
            paid: false,
            language: values.language,
            description: values.description,
            visible: values.visible,
          };
          if (values.paid && values.price && parseInt(values.price, 10)) {
            contentInput.paid = true;
            contentInput.price = parseInt(values.price, 10);
            if (values.offer && parseInt(values.offer, 10)) {
              contentInput.offer = parseInt(values.offer, 10);
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
              contentInput.offerType = values.offerType;
            }
          }
          if (values.highlight) {
            contentInput.highlight = values.highlight;
          }
          if (values.index) {
            contentInput.index = values.index;
          }
          addContent({variables: {contentInput}});
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
                label="Tick this, if content is paid."
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
                label="If ticked, content will be immediately visible to users."
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

export default AddContentModal;
