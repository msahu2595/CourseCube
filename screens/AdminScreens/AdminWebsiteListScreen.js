import {
  Text,
  View,
  Alert,
  Linking,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {tw} from '@lib';
import {WEBSITES} from '@queries';
import {DELETE_WEBSITE} from '@mutations';
import {CCSearchInput} from 'components/Common';
import {Fab, SafeAreaContainer} from '@components';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import AddWebsiteModal from 'components/AddWebsiteModal';
import EditWebsiteModal from 'components/EditWebsiteModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminWebsiteListScreen = () => {
  const [search, setSearch] = useState('');
  const [addWebsiteModal, setAddWebsiteModal] = useState(false);
  const [editWebsiteModal, setEditWebsiteModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(WEBSITES, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [deleteWebsite] = useMutation(DELETE_WEBSITE, {
    onCompleted: () => {
      showMessage({
        message: 'Website is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['websites'],
  });

  const deleteHandler = useCallback(
    websiteId =>
      Alert.alert(
        'Delete Website',
        'Are you sure, you want to delete this website?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteWebsite({
                variables: {websiteId},
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
    [deleteWebsite],
  );

  const onChangeSearchText = useCallback(
    text => {
      console.log(text);
      setSearch(text);
      if (text.length > 2) {
        refetch({search: text});
      } else {
        refetch({search: ''});
      }
    },
    [refetch],
  );

  const clearSearchText = useCallback(() => {
    setSearch('');
    refetch({search: ''});
  }, [refetch]);

  const _renderItem = useCallback(
    ({item}) => (
      <View style={tw`px-1 flex-row justify-between items-center`}>
        <View style={tw`flex-1`}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={tw`py-1 text-sm capitalize`}>
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(item.link);
            }}
            style={tw`p-1 flex-row self-start bg-blue-100 items-center rounded`}>
            <MaterialCommunityIcons
              name="link-variant"
              color={tw.color('blue-600')}
              size={10}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`text-[10px] px-1`}>
              {item.link}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity onPress={() => setEditWebsiteModal(item)}>
            <MaterialCommunityIcons
              name="square-edit-outline"
              color={tw.color('blue-600')}
              size={24}
              style={tw`px-1`}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteHandler(item._id)}>
            <MaterialCommunityIcons
              name="delete"
              color={tw.color('red-600')}
              size={24}
              style={tw`px-1`}
            />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [deleteHandler],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="dark-content">
      <CCSearchInput
        value={search}
        searching={loading}
        onChangeText={onChangeSearchText}
        onClear={clearSearchText}
      />
      <FlatList
        bounces={true}
        //
        data={data?.websites?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-2`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.websites?.payload.length,
              limit: 10,
            },
          });
        }}
      />
      <AddWebsiteModal
        visible={addWebsiteModal}
        onClose={() => {
          setAddWebsiteModal(false);
        }}
      />
      <EditWebsiteModal
        website={editWebsiteModal}
        onClose={() => {
          setEditWebsiteModal(null);
        }}
      />
      <Fab
        iconName="plus"
        bgColor={tw.color('blue-600')}
        onPress={() => setAddWebsiteModal(true)}
      />
    </SafeAreaContainer>
  );
};

export default AdminWebsiteListScreen;
