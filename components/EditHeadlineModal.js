import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {EDIT_HEADLINE} from '@mutations';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCModal, CCTextInput, CCImageUploader} from './Common';

const EditHeadlineValidationSchema = yup.object().shape({
  image: yup.string().matches(/^assets\/tmp\/.*$/gm, {
    excludeEmptyString: true,
  }),
  description: yup.string().required('Please enter headline description.'),
  link: yup.string().url('Link is not in the correct format.').nullable(),
});

const EditHeadlineModal = ({headline, onClose}) => {
  const [editHeadline, {loading: submitting}] = useMutation(EDIT_HEADLINE, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Headline is successfully edited.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['headlines'],
  });

  return (
    <CCModal
      title="Edit Headline"
      visible={!!headline}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          image: '',
          description: headline?.description,
          link: headline?.link,
        }}
        validationSchema={EditHeadlineValidationSchema}
        onSubmit={values => {
          const headlineInput = {description: values.description};
          if (values.image) {
            headlineInput.image = values.image;
          }
          if (values.link) {
            headlineInput.link = values.link;
          }
          editHeadline({variables: {headlineId: headline._id, headlineInput}});
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
              <CCImageUploader
                label="Image"
                error={errors.image}
                touched={touched.image}
                onChangeImage={value => {
                  setFieldValue('image', value);
                }}
                value={values.image}
                disabled={submitting}
                prevImage={headline?.image}
                imageProps={{width: 400, height: 400, cropping: true}}
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
                label="Link"
                error={errors.link}
                touched={touched.link}
                info="Example: https://indianexpress.com/latest-news/"
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

export default EditHeadlineModal;
