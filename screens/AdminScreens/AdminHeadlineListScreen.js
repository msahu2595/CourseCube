import * as Yup from 'yup';
import tw from '@lib/tailwind';
import {HEADLINES} from '@queries';
import {CREATE_HEADLINE} from '@mutations';
import {useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useRef, useState} from 'react';
import {NotificationItem, SafeAreaContainer} from '@components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Separator = () => <View style={tw`h-2`} />;

const AdminHeadlineListScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const searchInputRef = useRef(null);
  const {loading, error, data, refetch, fetchMore} = useQuery(HEADLINES);

  const renderItem = useCallback(
    ({item, index}) => <NotificationItem index={index} {...item} />,
    [],
  );

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaContainer>
      <View style={tw`flex-row`}>
        <View style={tw`flex-1 flex-row border rounded-lg items-center m-2`}>
          <TextInput
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
          />
          <TouchableOpacity
            onPress={() => {
              searchInputRef.current?.clear();
              refetch({search: ''});
            }}>
            <MaterialIcons
              name="clear"
              size={25}
              style={tw`p-1 items-center`}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Pressable onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons
              name="plus"
              size={30}
              style={tw`pt-4 pr-2 items-center`}
            />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={data?.headlines?.payload}
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
              offset: data?.headlines?.payload.length,
              limit: 10,
            },
          })
        }
      />
      <AddHeadlineModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaContainer>
  );
};

export default AdminHeadlineListScreen;

const ValidationSchema = Yup.object().shape({
  description: Yup.string().required('description is required'),
  image: Yup.string().url('invalid image URL'),
  link: Yup.string().url('invalid link'),
});

const AddHeadlineModal = ({visible, onClose}) => {
  const [createHeadline, {loading: mutationLoading}] = useMutation(
    CREATE_HEADLINE,
    {
      onCompleted: data => {
        console.log('onCompleted', data);
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
                description: '',
                image: '',
                link: '',
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
                  <View style={tw`flex-row`}>
                    <Text
                      style={tw`flex-1 text-center font-popBold text-lg m-4`}>
                      Create Headline
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
    </Modal>
  );
};
