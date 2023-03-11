import {useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  RefreshControl,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '@lib/tailwind';
import {ARTICLES} from '@queries';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import EditArticleModal from 'components/EditArticleModal';
import {DELETE_ARTICLE} from 'apollo/mutations/DELETE_ARTICLE';
import CreateArticleModal from 'components/CreateArticleModal';
import {CurrentAffairItem, SafeAreaContainer} from '@components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminArticleListScreen = () => {
  const [search, setSearch] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [editArticleModal, setEditArticleModal] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const {loading, data, error, refetch, fetchMore} = useQuery(ARTICLES);

  const [deleteArticle] = useMutation(DELETE_ARTICLE, {
    onCompleted: () => {
      showMessage({
        message: 'Your Article successfully deleted',
        type: 'success',
      });
    },
    onError: () => {
      showMessage({
        message: 'Not able to delete',
        type: 'danger',
      });
    },
    refetchQueries: ['articles'],
  });

  const deleteHandler = useCallback(
    articleId =>
      Alert.alert('Delete Article', 'Are you want to delete article', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            deleteArticle({
              variables: {articleId},
            }),
        },
      ]),
    [deleteArticle],
  );

  const Item = useCallback(
    ({item, index}) => {
      return (
        <View index={index} {...item}>
          <CurrentAffairItem index={index} {...item} />
          <View style={tw`flex flex-row justify-evenly `}>
            <Button
              onPress={() => setEditArticleModal(item)}
              title="Edit"
              color="#841584"
            />
            <Button
              title={'Delete'}
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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error! ${error.message}</Text>;
  }

  return (
    <>
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center m-2`}>
          <View
            style={tw`flex-1 flex-row  justify-between rounded-lg px-2 items-center border`}>
            <TextInput
              placeholder="Search"
              onChangeText={text => {
                console.log('text', text);
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
            style={tw`ml-2`}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value => {
              setIsEnabled(value);
              refetch({filter: {enable: !value}});
            }}
            value={isEnabled}
          />
          <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
            <MaterialIcons
              name="add-circle"
              size={40}
              color={tw.color('blue-600')}
            />
          </TouchableOpacity>
        </View>
        <SafeAreaContainer
          statusBgColor={tw.color('gray-300')}
          statusBarStyle="dark-content">
          <LinearGradient
            locations={[0, 0.5, 1]}
            colors={[
              tw.color('gray-300'),
              tw.color('gray-200'),
              tw.color('gray-100'),
            ]}
            style={tw`flex-1`}>
            <FlatList
              bounces={true}
              data={data?.articles?.payload}
              renderItem={({item}) => <Item item={item} />}
              keyExtractor={item => item._id}
              // contentContainerStyle={tw`bg-white`}
              // ItemSeparatorComponent={() => <View style={tw`h-3`} />}
              ListHeaderComponent={() => <View style={tw`h-2`} />}
              ListFooterComponent={() => <View style={tw`h-2`} />}
              onEndReached={() => {
                console.log('reached end');
                fetchMore({
                  variables: {
                    offset: data?.articles?.payload.length,
                    limit: 10,
                  },
                });
              }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refetch} />
              }
            />
          </LinearGradient>
        </SafeAreaContainer>
      </View>
      <CreateArticleModal
        visible={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
        }}
      />
      <EditArticleModal
        article={editArticleModal}
        onClose={() => {
          setEditArticleModal(null);
        }}
      />
    </>
  );
};

export default AdminArticleListScreen;
