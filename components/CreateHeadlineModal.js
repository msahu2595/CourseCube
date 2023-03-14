import React from 'react';
import * as Yup from 'yup';
import tw from '@lib/tailwind';
import {useMutation} from '@apollo/client';
import {CREATE_HEADLINE} from '@mutations';
import {showMessage} from 'react-native-flash-message';
import {ActivityIndicator} from 'react-native';
import {Formik} from 'formik';
import {CCButton, CCModal, CCTextInput} from './Common';

const ValidationSchema = Yup.object().shape({
  description: Yup.string().required('description is required'),
  image: Yup.string().url('invalid image URL'),
  link: Yup.string().url('invalid link'),
});

const CreateHeadlineModal = ({visible, onClose}) => {
  const [createHeadline, {loading: mutationLoading}] = useMutation(
    CREATE_HEADLINE,
    {
      onCompleted: data => {
        console.log('onCompleted', data);
        onClose();
        showMessage({
          message: 'Haedline Added Successfully.',
          type: 'success',
        });
      },
      onError: error => {
        console.log('onError', error.message);
        showMessage({
          message: 'Error.',
          type: 'error',
        });
      },
    },
  );
  return (
    <CCModal title="Create Headline" visible={!!visible} onClose={onClose}>
      <Formik
        initialValues={{
          description: '',
          image: '',
          link: '',
        }}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          console.log('formik submit', values);
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
            <CCTextInput
              required
              label="description"
              errors={errors}
              touched={touched}
              editable={!mutationLoading}
              placeholder="Enter description"
              onChangeText={handleChange('description')}
              value={values.description}
              onBlur={handleBlur('description')}
            />
            <CCTextInput
              label="Image Link"
              errors={errors}
              touched={touched}
              editable={!mutationLoading}
              placeholder="Enter image link"
              onChangeText={handleChange('image')}
              value={values.image}
              onBlur={handleBlur('image')}
            />
            <CCTextInput
              label="Reference Link"
              errors={errors}
              touched={touched}
              editable={!mutationLoading}
              placeholder="Enter Reference link"
              onChangeText={handleChange('link')}
              value={values.link}
              onBlur={handleBlur('link')}
            />
            <CCButton
              label="Submit"
              disabled={mutationLoading}
              onPress={() => {
                console.log('onpress', values);
                handleSubmit();
              }}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default CreateHeadlineModal;
