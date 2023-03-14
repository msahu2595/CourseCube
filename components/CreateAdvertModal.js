import tw from '@lib/tailwind';
import {Formik} from 'formik';
import * as Yup from 'yup';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useMutation} from '@apollo/client';
import {CREATE_ADVERT} from '@mutations';
import {showMessage} from 'react-native-flash-message';
import {CCModal} from './Common/CCModal';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CCTextInput} from './Common';

const ValidationSchema = Yup.object().shape({
  image: Yup.string().url('invalid image URL'),
  link: Yup.string().url('invalid link'),
  type: Yup.string().required('Please select type'),
});

const CreateAdvertModal = ({visible, onClose}) => {
  const [createAdvert, {loading: mutationLoading}] = useMutation(
    CREATE_ADVERT,
    {
      onCompleted: data => {
        console.log('oncompleted', data);
        onClose();
        showMessage({
          message: 'Advert Added Successfully.',
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
    <CCModal title="Create Advertisement" visible={visible} onClose={onClose}>
      <Formik
        initialValues={{
          image: '',
          link: '',
          type: '',
        }}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          console.log(values);
          createAdvert({
            variables: {
              advertInput: {
                image: values.image,
                type: values.type,
                link: values.link,
              },
            },
          });
        }}>
        {({
          handleChange,
          setFieldValue,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Text style={tw`mx-2`}>Type (required!) : </Text>
            <View style={tw`mt-2 flex-row border border-black rounded-lg`}>
              <FlatList
                horizontal
                data={['TINY', 'SMALL', 'MEDIUM', 'LARGE']}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        values.type === item ? tw.color('blue-600') : 'white',
                    }}
                    onPress={() => setFieldValue('type', item)}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item}
                style={tw`bg-white`}
                contentContainerStyle={tw`py-2`}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={tw`w-8`} />}
                ListHeaderComponent={() => <View style={tw`w-8`} />}
                ListFooterComponent={() => <View style={tw`w-2`} />}
              />
            </View>
            {errors.type && touched.type && <Text>{errors.type}</Text>}
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
              <TouchableOpacity
                disabled={mutationLoading}
                title="Submit"
                onPress={() => {
                  console.log(values);
                  handleSubmit();
                }}
                style={tw`bg-blue-800 rounded-lg p-2`}>
                <Text style={tw`text-white text-center text-base font-popSemi`}>
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
    </CCModal>
  );
};

export default CreateAdvertModal;
