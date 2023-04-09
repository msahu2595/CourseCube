import {
  Text,
  View,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import tw from '@lib/tailwind';
import {ARTICLES} from '@queries';
import {DELETE_ARTICLE} from '@mutations';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import EditArticleModal from 'components/EditArticleModal';
import CreateArticleModal from 'components/CreateArticleModal';
import {CurrentAffairItem, Fab, SafeAreaContainer} from '@components';

const AdminArticleListScreen = () => {
  const [search, setSearch] = useState('');
  const [editArticleModal, setEditArticleModal] = useState(null);
  const [createArticleModal, setCreateArticleModal] = useState(false);

  const {loading, data, refetch, fetchMore} = useQuery(ARTICLES, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [deleteArticle] = useMutation(DELETE_ARTICLE, {
    onCompleted: () => {
      showMessage({
        message: 'Article is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['articles'],
  });

  const deleteHandler = useCallback(
    articleId =>
      Alert.alert(
        'Delete Article',
        'Are you sure, you want to delete this article?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteArticle({
                variables: {articleId},
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
    [deleteArticle],
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
      <>
        <CurrentAffairItem {...item} />
        <View style={tw`flex-row px-2 mt-[2px]`}>
          <TouchableOpacity
            style={tw`flex-1 items-center bg-blue-500 py-2 rounded-md`}
            onPress={() => setEditArticleModal(item)}>
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
    ),
    [deleteHandler],
  );

  return (
    <>
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
          data={data?.articles?.payload}
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
                offset: data?.articles?.payload.length,
                limit: 10,
              },
            });
          }}
        />
        <CreateArticleModal
          visible={createArticleModal}
          onClose={() => {
            setCreateArticleModal(false);
          }}
        />
        <EditArticleModal
          article={editArticleModal}
          onClose={() => {
            setEditArticleModal(null);
          }}
        />
        <Fab
          iconName="plus"
          bgColor={tw.color('blue-600')}
          onPress={() => setCreateArticleModal(true)}
        />
      </SafeAreaContainer>
    </>
  );
};

export default AdminArticleListScreen;
