import {
  Text,
  View,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import tw from '@lib/tailwind';
import {HEADLINES} from '@queries';
import {DELETE_HEADLINE} from '@mutations';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import EditHeadlineModal from 'components/EditHeadlineModal';
import CreateHeadlineModal from 'components/CreateHeadlineModal';
import {Fab, HeadlineItem, SafeAreaContainer} from '@components';

const AdminHeadlineListScreen = () => {
  const [search, setSearch] = useState('');
  const [editHeadlineModal, setEditHeadlineModal] = useState(null);
  const [createHeadlineModal, setCreateHeadlineModal] = useState(false);

  const {loading, data, refetch, fetchMore} = useQuery(HEADLINES, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [deleteHeadline] = useMutation(DELETE_HEADLINE, {
    onCompleted: () => {
      showMessage({
        message: 'Headline is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['headlines'],
  });

  const deleteHandler = useCallback(
    headlineId =>
      Alert.alert(
        'Delete Headline',
        'Are you sure, you want to delete this headline?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteHeadline({
                variables: {headlineId},
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
    [deleteHeadline],
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
    ({item}) => {
      return (
        <>
          <HeadlineItem {...item} />
          <View style={tw`flex-row px-2 mt-[2px]`}>
            <TouchableOpacity
              style={tw`flex-1 items-center bg-blue-500 py-2 rounded-md`}
              onPress={() => setEditHeadlineModal(item)}>
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
      containerStyle={tw`bg-white`}
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
        data={data?.headlines?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.headlines?.payload.length,
              limit: 10,
            },
          });
        }}
      />
      <CreateHeadlineModal
        visible={createHeadlineModal}
        onClose={() => {
          setCreateHeadlineModal(false);
        }}
      />
      <EditHeadlineModal
        headline={editHeadlineModal}
        onClose={() => {
          setEditHeadlineModal(null);
        }}
      />
      <Fab
        iconName="plus"
        bgColor={tw.color('blue-600')}
        onPress={() => setCreateHeadlineModal(true)}
      />
    </SafeAreaContainer>
  );
};

export default AdminHeadlineListScreen;
