import {
  Text,
  View,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import tw from '@lib/tailwind';
import {ADVERTS} from '@queries';
import {DELETE_ADVERT} from '@mutations';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import EditAdvertModal from 'components/EditAdvertModal';
import CreateAdvertModal from 'components/CreateAdvertModal';
import {AdvertItem, Fab, SafeAreaContainer, TagItem} from '@components';

const AdminAdvertListScreen = () => {
  const [advertType, setAdvertType] = useState('ALL');
  const [editAdvertModal, setEditAdvertModal] = useState(null);
  const [createAdvertModal, setCreateAdvertModal] = useState(false);

  const {loading, data, refetch, fetchMore} = useQuery(ADVERTS, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [deleteAdvert] = useMutation(DELETE_ADVERT, {
    onCompleted: () => {
      showMessage({
        message: 'Advertisement is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['adverts'],
  });

  const deleteHandler = useCallback(
    advertId =>
      Alert.alert(
        'Delete Advertisement',
        'Are you sure, you want to delete this advertisement?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteAdvert({
                variables: {advertId},
              });
            },
            style: 'destructive',
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
      ),
    [deleteAdvert],
  );

  const _renderTagItem = useCallback(
    ({item}) => (
      <TagItem
        name={item}
        selected={advertType}
        onPress={name => {
          console.log(name);
          setAdvertType(name);
          if (name === 'ALL') {
            refetch({filter: {}});
          } else {
            refetch({filter: {type: name}});
          }
        }}
      />
    ),
    [refetch, advertType],
  );

  const _renderItem = useCallback(
    ({item}) => {
      return (
        <>
          <AdvertItem {...item} />
          <View style={tw`flex-row px-2 mt-[2px]`}>
            <TouchableOpacity
              style={tw`flex-1 items-center bg-blue-500 py-2 rounded-md`}
              onPress={() => setEditAdvertModal(item)}>
              <Text style={tw`text-white font-avReg`}>Edit</Text>
            </TouchableOpacity>
            <View style={tw`w-[2px]`} />
            <TouchableOpacity
              style={tw`flex-1 items-center bg-red-500 py-2 rounded-md`}
              onPress={() => deleteHandler(item._id)}>
              <Text style={tw`text-white font-avReg`}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    },
    [deleteHandler],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="dark-content">
      <View>
        <FlatList
          horizontal
          data={['ALL', 'TINY', 'SMALL', 'MEDIUM', 'LARGE']}
          renderItem={_renderTagItem}
          keyExtractor={item => item}
          style={tw`bg-white`}
          contentContainerStyle={tw`py-2`}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`w-2`} />}
          ListHeaderComponent={() => <View style={tw`w-2`} />}
          ListFooterComponent={() => <View style={tw`w-2`} />}
        />
      </View>
      <FlatList
        bounces={true}
        //
        data={data?.adverts?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`py-2`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.adverts?.payload.length,
              limit: 10,
            },
          });
        }}
      />
      <CreateAdvertModal
        visible={createAdvertModal}
        onClose={() => {
          setCreateAdvertModal(false);
        }}
      />
      <EditAdvertModal
        advert={editAdvertModal}
        onClose={() => {
          setEditAdvertModal(null);
        }}
      />
      <Fab
        iconName="plus"
        bgColor={tw.color('blue-600')}
        onPress={() => setCreateAdvertModal(true)}
      />
    </SafeAreaContainer>
  );
};

export default AdminAdvertListScreen;
