import {
  View,
  Text,
  Alert,
  FlatList,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import tw from '@lib/tailwind';
import {CONTENTS} from '@queries';
import {TestItem} from '@components';
import {DELETE_CONTENT} from '@mutations';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import EditContentModal from 'components/EditContentModal';

const columns = 2;
const width = Dimensions.get('window').width;
const itemWidth = columns
  ? width / columns - ((columns + 1) * 4) / columns
  : null;

const AdminContentVideoListScreen = () => {
  const [search, setSearch] = useState('');
  const [editContentModal, setEditContentModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(CONTENTS, {
    variables: {filter: {type: 'Test'}},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [deleteContent] = useMutation(DELETE_CONTENT, {
    onCompleted: () => {
      showMessage({
        message: 'Content is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: [{query: CONTENTS, variables: {filter: {type: 'Test'}}}],
  });

  const deleteHandler = useCallback(
    contentId =>
      Alert.alert(
        'Delete Content',
        'Are you sure, you want to delete this content?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteContent({
                variables: {contentId},
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
    [deleteContent],
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
      <View>
        <TestItem {...item} width={itemWidth} />
        <View style={tw`flex-row mt-[2px]`}>
          <TouchableOpacity
            style={tw`flex-1 items-center bg-blue-500 py-2 rounded-md`}
            onPress={() => setEditContentModal(item)}>
            <Text style={tw`text-white text-xs font-avReg`}>Edit</Text>
          </TouchableOpacity>
          <View style={tw`w-[2px]`} />
          <TouchableOpacity
            style={tw`flex-1 items-center bg-red-500 py-2 rounded-md`}
            onPress={() => deleteHandler(item._id)}>
            <Text style={tw`text-white text-xs font-avReg`}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [deleteHandler],
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
        numColumns={columns}
        //
        data={data?.contents?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-1`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={tw`h-1`} />}
        ListFooterComponent={() => (
          <View style={tw`py-4 items-center`}>
            <Text style={tw`text-xs text-gray-600 font-avSemi`}>
              {loading ? 'Loading...' : "That's all, we have got!!"}
            </Text>
          </View>
        )}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.contents?.payload.length,
              limit: 10,
            },
          });
        }}
      />
      <EditContentModal
        content={editContentModal}
        onClose={() => {
          setEditContentModal(null);
        }}
      />
    </View>
  );
};

export default AdminContentVideoListScreen;
