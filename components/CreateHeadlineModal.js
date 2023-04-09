import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {useMutation} from '@apollo/client';
import {CREATE_HEADLINE} from '@mutations';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCModal, CCTextInput} from './Common';

const CreateHeadlineValidationSchema = yup.object().shape({
  image: yup.string().url('Image should be a link.').nullable(),
  description: yup.string().required('Please enter headline description.'),
  link: yup.string().url('Link is not in the correct format.').nullable(),
});

const CreateHeadlineModal = ({visible, onClose}) => {
  const [createHeadline, {loading: submitting}] = useMutation(CREATE_HEADLINE, {
    onCompleted: () => {
      onClose();
      showMessage({
        message: 'Headline is successfully added.',
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
      title="Create Headline"
      visible={visible}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          image: '',
          description: '',
          link: '',
        }}
        validationSchema={CreateHeadlineValidationSchema}
        onSubmit={values => {
          const headlineInput = {description: values.description};
          if (values.image) {
            headlineInput.image = values.image;
          }
          if (values.link) {
            headlineInput.link = values.link;
          }
          createHeadline({variables: {headlineInput}});
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={tw`py-2`}>
              <CCTextInput
                label="Image"
                error={errors.image}
                touched={touched.image}
                info="Example: https://picsum.photos/64/64"
                onChangeText={handleChange('image')}
                onBlur={handleBlur('image')}
                value={values.image}
                editable={!submitting}
                autoCapitalize="none"
                inputMode="url"
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

export default CreateHeadlineModal;
