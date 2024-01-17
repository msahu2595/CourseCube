import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import {TESTS} from '@queries';
import {DELETE_TEST} from '@mutations';
import {Fab, MediaItem} from '@components';
import {CCSearchInput} from 'components/Common';
import AddTestModal from 'components/AddTestModal';
import React, {useCallback, useState} from 'react';
import EditTestModal from 'components/EditTestModal';
import {showMessage} from 'react-native-flash-message';
import AddContentModal from 'components/AddContentModal';
import {gql, useMutation, useQuery} from '@apollo/client';
import {View, Alert, FlatList, RefreshControl} from 'react-native';

const REMOVE_TEST_THUMBNAIL = gql`
  mutation removeTestThumbnail($testId: ID!) {
    removeTestThumbnail(testId: $testId) {
      code
      success
      message
      token
      payload {
        _id
        title
        thumbnail
        instructions
        duration
        totalMarks
        enable
        createdAt
        updatedAt
      }
    }
  }
`;

const AdminTestListScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [addTestModal, setAddTestModal] = useState(false);
  const [editTestModal, setEditTestModal] = useState(null);
  const [addContentModal, setAddContentModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(TESTS, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [removeTestThumbnail] = useMutation(REMOVE_TEST_THUMBNAIL, {
    onCompleted: () => {
      showMessage({
        message: 'Test thumbnail is successfully removed.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['tests'],
  });

  const [deleteTest] = useMutation(DELETE_TEST, {
    onCompleted: () => {
      showMessage({
        message: 'Test is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['tests'],
  });

  const removeThumbnailHandler = useCallback(
    testId =>
      Alert.alert(
        'Remove Thumbnail',
        'Are you sure, you want to remove thumbnail of this test?',
        [
          {
            text: 'Yes',
            onPress: () => {
              removeTestThumbnail({
                variables: {testId},
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
    [removeTestThumbnail],
  );

  const deleteTestHandler = useCallback(
    testId =>
      Alert.alert(
        'Delete Test',
        'Are you sure, you want to delete this test?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteTest({
                variables: {testId},
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
    [deleteTest],
  );

  const onChangeSearchText = useCallback(
    text => {
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
      <MediaItem
        title={item.title}
        label={`${
          dayjs.duration(item?.duration).hours()
            ? `${dayjs.duration(item?.duration).hours()}H`
            : ''
        } ${
          dayjs.duration(item?.duration).minutes()
            ? `${dayjs.duration(item?.duration).minutes()}M`
            : ''
        }`}
        image={item.thumbnail}
        options={[
          {
            key: 'Create content',
            positive: true,
            label: 'Create content',
            onSelect: () => setAddContentModal(item),
          },
          {
            key: 'Test questions',
            label: 'Test questions',
            onSelect: () =>
              navigation.navigate('AdminTestQuestionListScreen', {
                testId: item._id,
              }),
          },
          {
            key: 'Edit test',
            label: 'Edit test',
            onSelect: () => setEditTestModal(item),
          },
          {
            key: 'Remove thumbnail',
            label: 'Remove thumbnail',
            disabled: !item.thumbnail,
            onSelect: () => removeThumbnailHandler(item._id),
          },
          {
            key: 'Delete test',
            danger: true,
            label: 'Delete test',
            onSelect: () => deleteTestHandler(item._id),
          },
        ]}
      />
    ),
    [removeThumbnailHandler, deleteTestHandler, navigation],
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
        data={data?.tests?.payload}
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
              offset: data?.tests?.payload.length,
              limit: 10,
            },
          });
        }}
      />
      <AddTestModal
        visible={addTestModal}
        onClose={() => {
          setAddTestModal(false);
        }}
      />
      <EditTestModal
        test={editTestModal}
        onClose={() => {
          setEditTestModal(null);
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
        onPress={() => setAddTestModal(true)}
      />
    </View>
  );
};

export default AdminTestListScreen;
