import tw from 'twrnc';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Button,
} from 'react-native';
import {CONTENTS} from '@queries';
import {DELETE_CONTENT} from '@mutations';
import {SafeAreaContainer} from '@components';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import EditContentModal from 'components/EditContentModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';

const Separator = () => <View style={tw`h-2`} />;

const width = Dimensions.get('window').width;

const Item = item => {
  const [deleteContent] = useMutation(DELETE_CONTENT, {
    onCompleted: () => {
      showMessage({
        message: 'Content successfully deleted',
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
      Alert.alert('Delete Content', 'Are you want to delete contents', [
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

  console.log(item);
  return (
    <View
      style={tw.style(`flex flex-col rounded-lg bg-white`, {
        width: width / 2 - 8,
      })}>
      <Image
        source={{
          uri: item.image,
        }}
        style={tw`h-44 rounded-lg`}
      />
      <View style={tw`h-24 flex justify-between p-2`}>
        <Text style={tw`text-xs font-bold text-red-700`}>{item.subject}</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={tw`text-[14px] font-bold text-black`}>
          {item.title}
        </Text>
        <View>
          <Text style={tw`text-[10px]`}>{item.likes} likes | 180 attempts</Text>
        </View>
        <View style={tw`flex-row px-1 pb-1 flex justify-between `}>
          <Text
            style={tw`text-[10px] shadow bg-orange-200 text-red-700 rounded-sm`}>
            ${item.price}
          </Text>

          <Text style={tw`text-[10px]`}>{item.offer}%off</Text>
        </View>
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
  );
};

function AdminContentTestListScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');
  const [editContentModal, setEditContentModal] = useState(null);

  const {loading, error, data, refetch, fetchMore} = useQuery(CONTENTS, {
    variables: {
      filter: {
        type: 'Test',
      },
    },
  });

  console.log(data);

  if (loading) return null;
  if (error) return <Text>Error: {error.message}</Text>;
  return (
    <>
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
              refetch({filter: {type: 'Test', enable: !value}});
            }}
            value={isEnabled}
          />
        </View>
        <FlatList
          data={data?.contents?.payload}
          renderItem={({item}) => {
            return (
              <View>
                <Item {...item} />
                <Button
                  onPress={() => setEditContentModal(item)}
                  title="Edit"
                  color="#841584"
                />
              </View>
            );
          }}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={Separator}
          horizontal={false}
          numColumns={2}
          columnWrapperStyle={tw`justify-between`}
          contentContainerStyle={tw`p-1`}
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
      </SafeAreaContainer>
      <EditContentModal
        content={editContentModal}
        onClose={() => {
          setEditContentModal(null);
        }}
      />
    </>
  );
}

export default AdminContentTestListScreen;
