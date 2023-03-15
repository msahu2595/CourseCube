import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Button,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import tw from '@lib/tailwind';
import {CONTENTS} from '@queries';
import {useMutation, useQuery} from '@apollo/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaContainer} from '@components';
import {DELETE_CONTENT} from 'apollo/mutations/DELETE_CONTENT';
import {showMessage} from 'react-native-flash-message';

const separator = () => <View style={tw`h-2`} />;

function AdminContentVideoListScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');

  const {loading, error, data, refetch, fetchMore} = useQuery(CONTENTS, {
    variables: {
      filter: {
        type: 'Video',
      },
    },
  });

  console.log('dataaaaa', data);

  const [deleteContent] = useMutation(DELETE_CONTENT, {
    onCompleted: () => {
      showMessage({
        message: 'Your Content successfully deleted',
        type: 'success',
      });
    },
    onError: () => {
      showMessage({
        message: 'Not able to delete',
        type: 'danger',
      });
    },
    refetchQueries: ['contents'],
  });

  const deleteHandler = useCallback(
    contentId =>
      Alert.alert('Delete Content', 'Are you want to delete content', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            deleteContent({
              variables: {contentId},
            }),
        },
      ]),
    [deleteContent],
  );

  const Item = item => {
    console.log(item);
    return (
      <View style={tw`flex-row pb-2 px-2 rounded-lg`}>
        <Image
          source={{
            uri: item.image,
          }}
          style={tw`w-44 h-24 rounded-lg`}
        />
        <View style={tw`flex justify-between px-1`}>
          <Text style={tw`text-xs font-bold`}>{item.subject}</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={tw`text-[14px] font-bold`}>
            {item.title}
          </Text>
          <View style={tw`flex-row`}>
            <Text style={tw`text-[10px]`}>{item.media.time} | </Text>
            <Text style={tw`text-[10px]`}>{item.likes} likes |</Text>
            <Text style={tw`text-[10px]`}>{item.createdAt}</Text>
          </View>
          {item.enable && (
            <Button
              title={'Delete'}
              onPress={() => {
                deleteHandler(item._id);
              }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaContainer>
      <View style={tw`flex-row m-2`}>
        <View style={tw`flex-1 flex-row items-center border rounded-lg`}>
          <TextInput
            placeholder="Enter name to search"
            style={tw`flex-1`}
            value={search}
            onChangeText={text => {
              setSearch(text);
              if (text.length > 2) {
                refetch({search: text});
              } else {
                refetch({search: ''});
              }
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setSearch('');
              refetch({search: ''});
            }}>
            <MaterialCommunityIcons name="clear" size={25} style={tw`p-1`} />
          </TouchableOpacity>
        </View>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={value => {
            setIsEnabled(value);
            refetch({filter: {type: 'Video', enable: !value}});
          }}
          value={isEnabled}
        />
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <FlatList
          data={data?.contents?.payload}
          renderItem={({item}) => <Item {...item} />}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={separator}
          refreshing={loading}
          onRefresh={refetch}
          onEndReached={() =>
            fetchMore({
              variables: {
                offset: data?.contents?.payload.length,
                limit: 10,
              },
            })
          }
        />
      )}
    </SafeAreaContainer>
  );
}

export default AdminContentVideoListScreen;
