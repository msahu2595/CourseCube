import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import {TESTS} from '@queries';
import {DELETE_TEST} from '@mutations';
import {Fab, MediaItem} from '@components';
import {CCSearchInput} from 'components/Common';
import AddTestModal from 'components/AddTestModal';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import EditTestModal from 'components/EditTestModal';
import {showMessage} from 'react-native-flash-message';
import AddContentModal from 'components/AddContentModal';
import {View, Alert, FlatList, RefreshControl} from 'react-native';

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

  const deleteHandler = useCallback(
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

  const Item = useCallback(
    item => (
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
            key: 'Questions',
            label: 'Questions',
            onSelect: () =>
              navigation.navigate('AdminTestQuestionListScreen', {
                testId: item._id,
              }),
          },
          {key: 'Edit', label: 'Edit', onSelect: () => setEditTestModal(item)},
          {
            key: 'Delete',
            danger: true,
            label: 'Delete',
            onSelect: () => deleteHandler(item._id),
          },
        ]}
      />
    ),
    [deleteHandler, navigation],
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
        renderItem={({item}) => <Item {...item} />}
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
        content={addContentModal}
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
