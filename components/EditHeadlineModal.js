import React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {CCModal} from './Common';
import {useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {EDIT_HEADLINE} from 'apollo/mutations/EDIT_HEADLINE';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
      <View style={tw`flex-1 items-center justify-center`}>
        <View style={tw`bg-slate-100`}>
          <View style={tw`m-1 shadow p-1`}>
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
                  <View style={tw`flex-row`}>
                    <Text
                      style={tw`flex-1 text-center font-popBold text-lg m-4`}>
                      Edit Headline
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                      <MaterialIcons
                        name="clear"
                        size={25}
                        style={tw`p-1 items-center`}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={tw`mx-2`}>Description (required!): </Text>
                  <View
                    style={tw`mt-2 flex flex-row border border-black rounded-lg`}>
                    <MaterialIcons
                      style={tw`border-r p-1 border-b-black`}
                      name="description"
                      color="#4F8EF7"
                      size={25}
                    />
                    <TextInput
                      editable={!mutationLoading}
                      placeholder="Enter description"
                      onChangeText={handleChange('description')}
                      value={values.description}
                      onBlur={handleBlur('description')}
                      style={tw`h-10 w-80 p-2 bg-white font-popLight`}
                    />
                  </View>
                  {errors.description && touched.description && (
                    <Text>{errors.description}</Text>
                  )}
                  <Text style={tw`pt-4 mx-2`}>Image Link :</Text>
                  <View
                    style={tw`mt-2 flex flex-row border border-black rounded-lg`}>
                    <MaterialCommunityIcons
                      style={tw`border-r p-1 border-b-black`}
                      name="link"
                      color="#4F8EF7"
                      size={25}
                    />
                    <TextInput
                      editable={!mutationLoading}
                      placeholder="Enter image link"
                      onChangeText={handleChange('image')}
                      value={values.image}
                      onBlur={handleBlur('image')}
                      style={tw`h-10 w-80 p-2 bg-white font-popLight`}
                    />
                  </View>
                  {errors.image && touched.image && <Text>{errors.image}</Text>}
                  <Text style={tw`pt-4 mx-2`}>Reference Link:</Text>
                  <View
                    style={tw`mt-2 flex flex-row border border-black rounded-lg`}>
                    <MaterialCommunityIcons
                      style={tw`border-r p-1 border-b-black`}
                      name="link"
                      color="#4F8EF7"
                      size={25}
                    />
                    <TextInput
                      editable={!mutationLoading}
                      placeholder="Enter Reference link"
                      onChangeText={handleChange('link')}
                      value={values.link}
                      onBlur={handleBlur('link')}
                      style={tw`h-10 w-80 p-2 bg-white font-popLight`}
                    />
                  </View>
                  {errors.link && touched.link && <Text>{errors.link}</Text>}
                  <View style={tw`m-3 shadow-sm pt-4`}>
                    <TouchableOpacity
                      disabled={mutationLoading}
                      title="Submit"
                      onPress={() => {
                        console.log(values);
                        handleSubmit();
                      }}
                      style={tw`bg-blue-800 rounded-lg p-2`}>
                      <Text
                        style={tw`text-white text-center text-base font-popSemi`}>
                        Submit
                      </Text>
                      {mutationLoading && (
                        <ActivityIndicator animating={true} size="small" />
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </CCModal>
  );
};

export default EditHeadlineModal;
