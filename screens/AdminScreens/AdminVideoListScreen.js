import tw from '@lib/tailwind';
import {VIDEOS} from '@queries';
import {DELETE_VIDEO} from '@mutations';
import {Fab, MediaItem} from '@components';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import AddVideoModal from 'components/AddVideoModal';
import EditVideoModal from 'components/EditVideoModal';
import {showMessage} from 'react-native-flash-message';
import AddContentModal from 'components/AddContentModal';
import {gql, useMutation, useQuery} from '@apollo/client';
import {View, Alert, FlatList, RefreshControl} from 'react-native';

const REMOVE_VIDEO_THUMBNAIL = gql`
  mutation removeVideoThumbnail($videoId: ID!) {
    removeVideoThumbnail(videoId: $videoId) {
      code
      success
      message
      token
      payload {
        _id
        title
        thumbnail
        time
        link
        enable
        createdAt
        updatedAt
      }
    }
  }
`;

const AdminVideoListScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [addVideoModal, setAddVideoModal] = useState(false);
  const [editVideoModal, setEditVideoModal] = useState(null);
  const [addContentModal, setAddContentModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(VIDEOS, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [removeVideoThumbnail] = useMutation(REMOVE_VIDEO_THUMBNAIL, {
    onCompleted: () => {
      showMessage({
        message: 'Video thumbnail is successfully removed.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['videos'],
  });

  const [deleteVideo] = useMutation(DELETE_VIDEO, {
    onCompleted: () => {
      showMessage({
        message: 'Video is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['videos'],
  });

  const removeThumbnailHandler = useCallback(
    videoId =>
      Alert.alert(
        'Remove Thumbnail',
        'Are you sure, you want to remove thumbnail of this video?',
        [
          {
            text: 'Yes',
            onPress: () => {
              removeVideoThumbnail({
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
    [removeVideoThumbnail],
  );

  const deleteVideoHandler = useCallback(
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

  const handleNavigation = useCallback(
    item => {
      navigation.navigate('AdminVideoViewScreen', {
        videoId: item?._id,
      });
    },
    [navigation],
  );

  const _renderItem = useCallback(
    ({item}) => (
      <MediaItem
        label={item.time}
        title={item.title}
        image={item.thumbnail}
        onPress={() => handleNavigation(item)}
        options={[
          {
            key: 'Create content',
            positive: true,
            label: 'Create content',
            onSelect: () => setAddContentModal(item),
          },
          {
            key: 'Edit video',
            label: 'Edit video',
            onSelect: () => setEditVideoModal(item),
          },
          {
            key: 'Remove thumbnail',
            label: 'Remove thumbnail',
            disabled: !item.thumbnail,
            onSelect: () => removeThumbnailHandler(item._id),
          },
          {
            key: 'Delete video',
            danger: true,
            label: 'Delete video',
            onSelect: () => deleteVideoHandler(item._id),
          },
        ]}
      />
    ),
    [handleNavigation, removeThumbnailHandler, deleteVideoHandler],
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <CCSearchInput
        value={search}
        searching={loading}
        onChangeText={onChangeSearchText}
        onClear={clearSearchText}
      />
      <FlatList
        bounces={true}
        numColumns={2}
        //
        data={data?.videos?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-1`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={tw`h-1`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.videos?.payload.length,
              limit: 10,
            },
          });
        }}
      />
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
        media={addContentModal}
        onClose={() => {
          setAddContentModal(null);
        }}
      />
      <Fab
        iconName="plus"
        bgColor={tw.color('blue-600')}
        onPress={() => setAddVideoModal(true)}
      />
    </View>
  );
};

export default AdminVideoListScreen;
