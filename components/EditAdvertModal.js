import React from 'react';
const {useMutation} = require('@apollo/client');
const {EDIT_ADVERT} = require('@mutations');
import {Formik} from 'formik';
import * as Yup from 'yup';
import tw from '@lib/tailwind';
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

const EditAdvertValidationSchema = Yup.object().shape({
  image: Yup.string()
    .url('Invalid image URL')
    .required('Please enter image url'),
  link: Yup.string().url('Invalid link').nullable(),
  type: Yup.string().required('Please select advert type'),
});

const EditAdvertModal = ({advert, onClose}) => {
  const [editAdvert, {loading}] = useMutation(EDIT_ADVERT, {
    onCompleted: data => {
      console.log('onCompleted', data);
      onClose();
      showMessage({
        message: 'Advert Edited Successfully.',
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
    refetchQueries: ['adverts'],
  });
  console.log('advertMOdal', advert);

  return (
    <CCModal title="Edit Advert" visible={!!advert} onClose={onClose}>
      <Formik
        initialValues={{
          image: advert?.image,
          link: advert?.link,
          type: advert?.type,
        }}
        validationSchema={EditAdvertValidationSchema}
        onSubmit={values => {
          console.log('onSubmit', values);
          const advertInput = {type: values.type, image: values.image};
          if (values.link) {
            advertInput.link = values.link;
          }
          console.log({advertInput});
          editAdvert({variables: {advertId: advert._id, advertInput}});
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
          <View>
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
            <Text style={tw`pt-4 mx-2`}>Image Link (required!) :</Text>
            <View style={tw`mt-2 flex flex-row border border-black rounded-lg`}>
              <MaterialCommunityIcons
                style={tw`border-r p-1 border-b-black`}
                name="link"
                color="#4F8EF7"
                size={25}
              />
              <TextInput
                editable={!loading}
                placeholder="Enter image link"
                onChangeText={handleChange('image')}
                value={values.image}
                onBlur={handleBlur('image')}
                style={tw`h-10 w-80 p-2 bg-white font-popLight`}
              />
            </View>
            {errors.image && touched.image && <Text>{errors.image}</Text>}
            <Text style={tw`pt-4 mx-2`}>Reference Link:</Text>
            <View style={tw`mt-2 flex flex-row border border-black rounded-lg`}>
              <MaterialCommunityIcons
                style={tw`border-r p-1 border-b-black`}
                name="link"
                color="#4F8EF7"
                size={25}
              />
              <TextInput
                editable={!loading}
                placeholder="Enter Reference link"
                onChangeText={handleChange('link')}
                value={values.link}
                onBlur={handleBlur('link')}
                style={tw`h-10 w-80 p-2 bg-white font-popLight`}
              />
            </View>
            {/* {errors.link && touched.link && <Text>{errors.link}</Text>} */}
            <View style={tw`m-3 shadow-sm pt-4`}>
              <TouchableOpacity
                disabled={loading}
                title="Submit"
                onPress={() => {
                  console.log('onPress', values);
                  handleSubmit();
                }}
                style={tw`bg-blue-800 rounded-lg p-2`}>
                <Text style={tw`text-white text-center text-base font-popSemi`}>
                  Submit
                </Text>
                {loading && <ActivityIndicator animating={true} size="small" />}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </CCModal>
  );
};

export default EditAdvertModal;
