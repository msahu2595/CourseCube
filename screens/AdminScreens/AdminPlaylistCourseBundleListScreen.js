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
  Button,
  Alert,
  Pressable,
} from 'react-native';
import {BUNDLES} from '@queries';
import {SafeAreaContainer} from '@components';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import AddBundleModal from 'components/AddBundleModal';
import {showMessage} from 'react-native-flash-message';
import EditBundleModal from 'components/EditBundleModal';
import {DELETE_BUNDLE} from 'apollo/mutations/DELETE_BUNDLE';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Separator = () => <View style={tw`h-2`} />;

const width = Dimensions.get('window').width;

const Item = item => {
  const [editBundleModal, setEditBundleModal] = useState(null);
  const [deleteBundle] = useMutation(DELETE_BUNDLE, {
    onCompleted: () => {
      showMessage({
        message: 'Your Playlist successfully deleted',
        type: 'success',
      });
    },
    onError: error => {
      console.log('onError', error.message);
      showMessage({
        message: 'Not able to delete',
        type: 'error',
      });
    },
    refetchQueries: ['bundles'],
  });

  const deleteHandler = useCallback(
    bundleId =>
      Alert.alert('Delete Course', 'Are you sure want to delete Course', [
        {
          text: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            deleteBundle({
              variables: {bundleId},
            }),
        },
      ]),
    [deleteBundle],
  );

  console.log(item);
  return (
    <View
      style={tw.style('flex flex-col rounded-lg bg-white', {
        width: width / 2 - 8,
      })}>
      <Image
        source={{
          uri: item.image,
        }}
        style={tw`h-60 rounded-lg`}
      />
      <View style={tw`h-40 flex justify-between p-2`}>
        <Text style={tw`text-xs font-bold`}>{item.description}</Text>
        <Text style={tw`text-xs font-bold`}>{item.exams}</Text>
        <Text style={tw`text-xs font-bold`}>{item.instructors}</Text>
        <Text style={tw`text-xs font-bold`}>{item.language}</Text>
        <Text style={tw`text-xs font-bold`}>{item.subject}</Text>
        <Text style={tw`text-xs font-bold text-red-700`}>{item.title}</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={tw`text-[14px] font-bold text-black`}>
          {item.title}
        </Text>
      </View>
      <View>
        {item.enable && (
          <Button
            onPress={() => setEditBundleModal(item)}
            title={'edit'}
            color="#841584"
          />
        )}
        {item.enable && (
          <Button
            title={'delete'}
            color="red"
            onPress={() => {
              deleteHandler(item._id);
            }}
          />
        )}
      </View>
      <EditBundleModal
        bundle={editBundleModal}
        onClose={() => {
          setEditBundleModal(null);
        }}
      />
    </View>
  );
};

function AdminPlaylistCourseBundleListScreen() {
  const [search, setSearch] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [addBundleModal, setAddBundleModal] = useState(false);

  const {loading, error, data, refetch, fetchMore} = useQuery(BUNDLES, {
    variables: {
      filter: {
        type: 'PLAYLIST_COURSE',
      },
    },
  });

  console.log(data);

  if (error) return <Text>Error: {error.message}</Text>;

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
            <MaterialIcons name="clear" size={25} style={tw`p-1`} />
          </TouchableOpacity>
        </View>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={value => {
            setIsEnabled(value);
            refetch({filter: {type: 'PLAYLIST_COURSE', enable: !value}});
          }}
          value={isEnabled}
        />
        <View
          style={tw`bg-blue-500 h-8 rounded-full items-center justify-center`}>
          <View>
            <Pressable onPress={() => setAddBundleModal(true)}>
              <MaterialCommunityIcons
                name="plus"
                size={30}
                style={tw`items-center text-white`}
              />
            </Pressable>
          </View>
        </View>
      </View>
      <FlatList
        data={data?.bundles?.payload}
        renderItem={({item}) => <Item {...item} />}
        keyExtractor={item => item._id}
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
      <AddBundleModal
        bundle={addBundleModal}
        onClose={() => {
          setAddBundleModal();
        }}
      />
    </SafeAreaContainer>
  );
}

export default AdminPlaylistCourseBundleListScreen;
