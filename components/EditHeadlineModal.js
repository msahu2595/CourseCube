import React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {CCButton, CCModal, CCTextInput} from './Common';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {EDIT_HEADLINE} from 'apollo/mutations/EDIT_HEADLINE';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';

const ValidationSchema = Yup.object().shape({
  description: Yup.string().required('description is required'),
  image: Yup.string().url('invalid image URL'),
  link: Yup.string().url('invalid link'),
});

const EditHeadlineModal = ({headline, onClose}) => {
  const [editHeadline, {loading: mutationLoading}] = useMutation(
    EDIT_HEADLINE,
    {
      onCompleted: data => {
        console.log('onCompleted', data);
        onClose();
        showMessage({
          message: 'Headline Edited Successfully.',
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
      refetchQueries: ['headlines'],
    },
  );
  return (
    <CCModal title="Edit Headline" visible={!!headline} onClose={onClose}>
      <Formik
        initialValues={{
          description: headline?.description,
          image: headline?.image,
          link: headline?.link,
        }}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          console.log(values);
          const headlineInput = {description: values.description};
          if (values.image) {
            headlineInput.image = values.image;
          }
          if (values.link) {
            headlineInput.link = values.link;
          }
          editHeadline({variables: {headlineInput}});
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
            <View style={tw``}>
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
            </View>
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
            <View style={tw`m-3 shadow-sm pt-4`}>
              <CCButton
                label="Submit"
                disabled={mutationLoading}
                onPress={() => {
                  console.log('onpress', values);
                  handleSubmit();
                }}
              />
              {mutationLoading && (
                <ActivityIndicator animating={true} size="small" />
              )}
            </View>
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default EditHeadlineModal;
