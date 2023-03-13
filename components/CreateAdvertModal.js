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
      <View style={tw`flex-1 items-center justify-center`}>
        <View style={tw`bg-slate-100`}>
          <View style={tw`m-1 shadow p-1`}>
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
                  <View style={tw`flex-row`}>
                    <Text
                      style={tw`flex-1 text-center font-popBold text-lg m-4`}>
                      Create Advertisement
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                      <MaterialIcons
                        name="clear"
                        size={25}
                        style={tw`p-1 items-center`}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={tw`mx-2`}>Type (required!) : </Text>
                  <View
                    style={tw`mt-2 flex-row border border-black rounded-lg`}>
                    <FlatList
                      horizontal
                      data={['TINY', 'SMALL', 'MEDIUM', 'LARGE']}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={{
                            backgroundColor:
                              values.type === item
                                ? tw.color('blue-600')
                                : 'white',
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
                  <Text style={tw`pt-4 mx-2`}>Image Link (required!) :</Text>
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

export default CreateAdvertModal;
