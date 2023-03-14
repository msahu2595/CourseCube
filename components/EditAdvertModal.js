import React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import tw from '@lib/tailwind';
import {EDIT_ADVERT} from '@mutations';
import {useMutation} from '@apollo/client';
import {CCModal, CCButton, CCTextInput} from './Common';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';

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
            <CCTextInput
              required
              label="Image Link"
              errors={errors}
              touched={touched}
              editable={!loading}
              placeholder="Enter image link"
              onChangeText={handleChange('image')}
              value={values.image}
              onBlur={handleBlur('image')}
            />
            <CCTextInput
              label="Reference Link"
              errors={errors}
              touched={touched}
              editable={!loading}
              placeholder="Enter Reference link"
              onChangeText={handleChange('link')}
              value={values.link}
              onBlur={handleBlur('link')}
            />

            <CCButton
              disabled={loading}
              label="Submit"
              onPress={() => {
                console.log('onPress', values);
                handleSubmit();
              }}
            />
            {loading && <ActivityIndicator animating={true} size="small" />}
          </View>
        )}
      </Formik>
    </CCModal>
  );
};

export default EditAdvertModal;
