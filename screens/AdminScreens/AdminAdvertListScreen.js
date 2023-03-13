import tw from '@lib/tailwind';
import {ADVERTS} from '@queries';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {AdvertItem, SafeAreaContainer} from '@components';
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditAdvertModal from 'components/EditAdvertModal';
import CreateAdvertModal from 'components/CreateAdvertModal';
import {DELETE_ADVERT} from '@mutations';
import {showMessage} from 'react-native-flash-message';
import {onError} from '@apollo/client/link/error';

const Separator = () => <View style={tw`h-2`} />;

const AdminAdvertListScreen = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [editAdvertModal, setEditAdvertModal] = useState(null);
  const {loading, error, data, refetch, fetchMore} = useQuery(
    ADVERTS,
    //    {
    //   variables: {
    //     filter: {
    //       type: '',
    //     },
    //   },
    // }
  );

  const [deleteAdvert] = useMutation(DELETE_ADVERT, {
    onCompleted: () => {
      showMessage({
        message: 'Your article successfully deleted',
        type: 'success',
      });
    },
    onError: error => {
      console.log('onError', error.message);
      showMessage({
        message: 'Not able to delete',
        type: 'error',
      });
    },
    refetchQueries: ['adverts'],
  });

  const deleteHandler = useCallback(
    advertId =>
      Alert.alert('Delete Advert', 'Are you sure want to delete advert', [
        {
          text: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            deleteAdvert({
              variables: {advertId},
            }),
        },
      ]),
    [deleteAdvert],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View index={index} {...item}>
          <AdvertItem index={index} {...item} />
          <View style={tw`flex flex-row justify-evenly`}>
            <Button
              onPress={() => setEditAdvertModal(item)}
              title="Edit"
              color="#841584"
            />
            <Button
              title={'delete'}
              color="red"
              onPress={() => {
                deleteHandler(item._id);
              }}
            />
          </View>
        </View>
      );
    },
    [deleteHandler],
  );

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaContainer>
      <View style={tw`flex-row justify-between`}>
        <View style={tw` flex-row bg-gray-600 items-center m-2`}>
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
        </View>
        <FlatList
          horizontal
          data={['ALL', 'TINY', 'SMALL', 'MEDIUM', 'LARGE']}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
              }}
              onPress={() => {
                console.log(item);
                if (item === 'ALL') {
                  refetch({filter: {}});
                } else {
                  refetch({filter: {type: item}});
                }
              }}>
              <Text style={tw`font-bold`}>{item}</Text>
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
        <View style={tw`bg-slate-500`}>
          <View>
            <Pressable onPress={() => setCreateModalVisible(true)}>
              <MaterialCommunityIcons
                name="plus"
                size={30}
                style={tw`pr-1 items-center text-white`}
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
      <CreateAdvertModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
      <EditAdvertModal
        advert={editAdvertModal}
        onClose={() => {
          setEditAdvertModal(null);
        }}
      />
    </SafeAreaContainer>
  );
};

export default AdminAdvertListScreen;
