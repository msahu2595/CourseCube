/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
import {useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '@lib/tailwind';
import {TESTS} from '@queries';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddTestModal from 'components/AddTestModal';
import EditTestModal from 'components/EditTestModal';
import {DELETE_TEST} from 'apollo/mutations/DELETE_TEST';
import {showMessage} from 'react-native-flash-message';

const AdminTestListScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');

  const [addTestModalVisible, setAddTestModalVisible] = useState(false);
  const [editTestModal, setEditTestModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(TESTS, {
    variables: {offset: 0},
  });

  const [deleteTest] = useMutation(DELETE_TEST, {
    onCompleted: () => {
      showMessage({
        message: 'Your Article successfully deleted',
        type: 'success',
      });
    },
    onError: () => {
      showMessage({
        message: 'Not able to delete',
        type: 'danger',
      });
    },
    refetchQueries: ['tests'],
  });

  const deleteHandler = useCallback(
    testId =>
      Alert.alert('Delete Article', 'Are you want to delete article', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            deleteTest({
              variables: {testId},
            }),
        },
      ]),
    [deleteTest],
  );

  const width = Dimensions.get('window').width;
  // console.log(width);
  const Item = useCallback(
    ({item}) => (
      <View style={tw.style(` rounded-lg bg-gray-200`, {width: width / 2 - 8})}>
        <ImageBackground
          source={{
            uri: item.thumbnail,
          }}
          resizeMode="cover"
          style={tw`h-40  justify-between`}>
          <View style={tw` h-10 `}>
            <Text
              style={tw` self-end text-xs  text-white p-1 bg-black bg-opacity-40  rounded-bl-lg `}>
              {item.time}
            </Text>
          </View>
          <View
            style={tw`bg-black bg-opacity-50 text-white p-1 h-10 justify-center`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`text-xs px-1 text-white`}>
              {item.title}
            </Text>
          </View>
        </ImageBackground>
        <Button
          onPress={() => setEditTestModal(item)}
          title="Edit"
          color="#841584"
        />
        <Button
          title={'Delete'}
          onPress={() => {
            deleteHandler(item._id);
          }}
        />
      </View>
    ),
    [],
  );

  return (
    <>
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center m-2`}>
          <View
            style={tw`flex-1 flex-row m-2 justify-between rounded-lg px-2 items-center border`}>
            <TextInput
              placeholder="Search"
              onChangeText={text => {
                console.log('text', text);
                setSearch(text);
                if (text.length > 2) {
                  refetch({search: text});
                } else {
                  refetch({search: ''});
                }
              }}
              value={search}
            />

            <TouchableOpacity
              onPress={() => {
                setSearch('');
                refetch({search: ''});
              }}>
              <MaterialIcons name="clear" size={20} color={tw.color('black')} />
            </TouchableOpacity>
          </View>

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
          <TouchableOpacity onPress={() => setAddTestModalVisible(true)}>
            <MaterialIcons
              name="add-circle"
              size={40}
              color={tw.color('blue-600')}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          bounces={true}
          data={data?.tests?.payload}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={tw`justify-between`}
          contentContainerStyle={tw`p-1`}
          ItemSeparatorComponent={() => <View style={tw`h-2`} />}
          onEndReached={() => {
            console.log('reached end');
            fetchMore({
              variables: {
                offset: data?.tests?.payload.length,
                limit: 10,
              },
            });
          }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        />
      </View>

      <AddTestModal
        visible={addTestModalVisible}
        onClose={() => {
          setAddTestModalVisible(null);
        }}
      />
      <EditTestModal
        test={editTestModal}
        onClose={() => {
          setEditTestModal(null);
        }}
      />
    </>
  );
};

export default AdminTestListScreen;
