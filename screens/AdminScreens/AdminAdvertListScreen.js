import * as Yup from 'yup';
import tw from '@lib/tailwind';
import {ADVERTS} from '@queries';
import {CREATE_ADVERT} from '@mutations';
import {useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useRef, useState} from 'react';
import {AdvertItem, NotificationItem, SafeAreaContainer} from '@components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Separator = () => <View style={tw`h-2`} />;

const AdminAdvertListScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const {loading, error, data, refetch, fetchMore} = useQuery(ADVERTS);

  const renderItem = useCallback(
    ({item, index}) => <AdvertItem index={index} {...item} />,
    [],
  );

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaContainer>
      <View style={tw`flex-row`}>
        <View style={tw` flex-rowrounded-lg items-center m-2`}>
          <View style={tw`items-start`}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => {
                setIsEnabled(value);
                refetch({filter: {enable: !value}});
              }}
              value={isEnabled}
            />
          </View>
          {/* <TextInput
            ref={searchInputRef}
            placeholder="Enter name to search"
            style={tw`flex-1`}
            onChangeText={text => {
              if (text.length > 2) {
                refetch({search: text});
              } else {
                refetch({search: ''});
              }
            }}
          /> */}
          {/* <TouchableOpacity
            onPress={() => {
              searchInputRef.current?.clear();
              refetch({search: ''});
            }}>
            <MaterialIcons
              name="clear"
              size={25}
              style={tw`p-1 items-center`}
            />
          </TouchableOpacity> */}
        </View>
        <View style={tw`justify-end items-end pl-60`}>
          <View>
            <Pressable onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons
                name="plus"
                size={30}
                style={tw`pr-2 items-center`}
              />
            </Pressable>
          </View>
        </View>
      </View>
      <FlatList
        data={data?.adverts?.payload}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={Separator}
        horizontal={false}
        numColumns={2}
        columnWrapperStyle={tw`justify-between`}
        contentContainerStyle={tw`p-1`}
        refreshing={loading}
        onRefresh={refetch}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.adverts?.payload.length,
              limit: 10,
            },
          })
        }
      />
      <AddAdvertModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaContainer>
  );
};

export default AdminAdvertListScreen;

const ValidationSchema = Yup.object().shape({
  image: Yup.string().url('invalid image URL'),
  link: Yup.string().url('invalid link'),
  type: Yup.string(),
});

const AddAdvertModal = ({visible, onClose}) => {
  const [createAdvert, {loading: mutationLoading}] = useMutation(
    CREATE_ADVERT,
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
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
                // const advertInput = {description: values.description};
                // if (values.image) {
                //   advertInput.image = values.image;
                // }
                // if (values.link) {
                //   advertInput.link = values.link;
                // }
                // createAdvert({variables: {advertInput}});
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
                    {/* <MaterialIcons
                      style={tw`border-r p-1 border-b-black`}
                      name="description"
                      color="#4F8EF7"
                      size={25}
                    /> */}
                    {/* <TextInput
                      editable={!mutationLoading}
                      placeholder="Enter type"
                      onChangeText={handleChange('type')}
                      value={values.type}
                      onBlur={handleBlur('type')}
                      style={tw`h-10 p-2 bg-white font-popLight`}
                    /> */}
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
    </Modal>
  );
};
