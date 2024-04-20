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
import {CONTENTS} from '@queries';
import {EDIT_CONTENT} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';

const sizes = {
  Video: {width: 800, height: 450, cropping: true},
  Test: {width: 800, height: 800, cropping: true},
  Document: {width: 600, height: 800, cropping: true},
};

const EditContentValidationSchema = yup.object({
  subject: yup.string().required('Please enter subject.'),
  image: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
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

const EditContentModal = ({content, onClose}) => {
  const [editContent, {loading: submitting}] = useMutation(EDIT_CONTENT, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Content is successfully edited.',
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
      {query: CONTENTS, variables: {filter: {type: content?.type}}},
    ],
  });

  return (
    <CCModal
      title="Edit Content"
      visible={!!content}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          subject: content?.subject,
          image: '',
          title: content?.title,
          media: content?.media?._id,
          type: content?.type,
          paid: content?.paid,
          price: content?.price?.toString(),
          offer: content?.offer?.toString(),
          offerType: content?.offerType,
          highlight: content?.highlight,
          language: content?.language,
          index: content?.index,
          description: content?.description,
          visible: content?.visible,
        }}
        validationSchema={EditContentValidationSchema}
        onSubmit={(values, {setFieldError}) => {
          const contentInput = {
            media: values.media,
            type: values.type,
          };
          if (values.subject && values.subject !== content?.subject) {
            contentInput.subject = values.subject;
          }
          if (values.image) {
            contentInput.image = values.image;
          }
          if (values.title && values.title !== content?.title) {
            contentInput.title = values.title;
          }
          if (values.language && values.language !== content?.language) {
            contentInput.language = values.language;
          }
          if (
            values.description &&
            values.description !== content?.description
          ) {
            contentInput.description = values.description;
          }
          if (values.visible && values.visible !== content?.visible) {
            contentInput.visible = values.visible;
          }
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
          if (values.highlight && values.highlight !== content?.highlight) {
            contentInput.highlight = values.highlight;
          }
          if (values.index && values.index !== content?.index) {
            contentInput.index = values.index;
          }
          editContent({variables: {contentId: content?._id, contentInput}});
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
                prevImage={content?.image}
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
                label="If ticked, this content will be immediately visible to users."
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

export default EditContentModal;
