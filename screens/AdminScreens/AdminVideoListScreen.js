import {useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {
  View,
  Alert,
  Switch,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import tw from '@lib/tailwind';
import {VIDEOS} from '@queries';
import {MediaItem} from '@components';
import {DELETE_VIDEO} from '@mutations';
import AddVideoModal from 'components/AddVideoModal';
import EditVideoModal from 'components/EditVideoModal';
import {showMessage} from 'react-native-flash-message';
import AddContentModal from 'components/AddContentModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminVideoListScreen = () => {
  const [search, setSearch] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [addVideoModal, setAddVideoModal] = useState(false);
  const [editVideoModal, setEditVideoModal] = useState(null);
  const [addContentModal, setAddContentModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(VIDEOS);

  const [deleteVideo] = useMutation(DELETE_VIDEO, {
    onCompleted: () => {
      showMessage({
        message: 'Video successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred.',
        type: 'danger',
      });
    },
    refetchQueries: ['videos'],
  });

  const deleteHandler = useCallback(
    videoId =>
      Alert.alert(
        'Delete Video',
        'Are you sure, you want to delete this video?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteVideo({
                variables: {videoId},
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
    [deleteVideo],
  );

  const Item = useCallback(
    item => (
      <MediaItem
        label={item.time}
        title={item.title}
        image={item.thumbnail}
        handleEdit={() => setEditVideoModal(item)}
        handleDelete={() => deleteHandler(item._id)}
        handleCreateContent={() => setAddContentModal(item)}
      />
    ),
    [deleteHandler],
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
          <TouchableOpacity onPress={() => setAddVideoModal(true)}>
            <MaterialIcons
              name="add-circle"
              size={40}
              color={tw.color('blue-600')}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          bounces={true}
          data={data?.videos?.payload}
          renderItem={({item}) => <Item {...item} />}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={tw`justify-between`}
          contentContainerStyle={tw`p-1`}
          ItemSeparatorComponent={() => <View style={tw`h-2`} />}
          onEndReached={() => {
            fetchMore({
              variables: {
                offset: data?.videos?.payload.length,
                limit: 10,
              },
            });
          }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        />
      </View>
      <AddVideoModal
        visible={addVideoModal}
        onClose={() => {
          setAddVideoModal(false);
        }}
      />
      <EditVideoModal
        video={editVideoModal}
        onClose={() => {
          setEditVideoModal(null);
        }}
      />
      <AddContentModal
        content={addContentModal}
        onClose={() => {
          setAddContentModal(null);
        }}
      />
    </>
  );
};

export default AdminVideoListScreen;
