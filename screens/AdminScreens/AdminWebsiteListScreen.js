import {
  Text,
  View,
  Alert,
  Button,
  Switch,
  Linking,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {tw} from '@lib';
import {WEBSITES} from '@queries';
import {DELETE_WEBSITE} from '@mutations';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import AddWebsiteModal from 'components/AddWebsiteModal';
import EditWebsiteModal from 'components/EditWebsiteModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminWebsiteListScreen = () => {
  const [search, setSearch] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [addWebsiteModal, setAddWebsiteModal] = useState(false);
  const [editWebsiteModal, setEditWebsiteModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(WEBSITES);

  const [deleteWebsite] = useMutation(DELETE_WEBSITE, {
    onCompleted: () => {
      showMessage({
        message: 'Website is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred.',
        type: 'danger',
      });
    },
    refetchQueries: ['websites'],
  });

  const deleteHandler = useCallback(
    websiteId =>
      Alert.alert(
        'Delete Website',
        'Are you sure, you want to delete this website?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteWebsite({
                variables: {websiteId},
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
    [deleteWebsite],
  );

  const Item = useCallback(
    ({item}) => (
      <View style={tw`p-2 flex-row justify-between `}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(item.link);
          }}>
          <View style={tw`  h-8 rounded-lg self-start bg-blue-600 ml-5 `}>
            <Text style={tw`px-2 text-white`}>{item.name}</Text>
          </View>
        </TouchableOpacity>
        <View style={tw`flex-row mx-2  `}>
          {item.enable && (
            <Button
              onPress={() => setEditWebsiteModal(item)}
              title="Edit"
              color="#841584"
            />
          )}
          {item.enable && (
            <Button
              title={'Delete'}
              color="red"
              onPress={() => {
                deleteHandler(item._id);
              }}
            />
          )}
        </View>
      </View>
    ),
    [deleteHandler],
  );

  return (
    <>
      <View style={tw`flex-1 `}>
        <View style={tw`flex-row items-center m-2`}>
          <View
            style={tw`flex-1 flex-row m-2 justify-between rounded-lg px-2 items-center border`}>
            <TextInput
              placeholder="Search"
              onChangeText={text => {
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
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value => {
              setIsEnabled(value);
              refetch({filter: {enable: !value}});
              value = {isEnabled};
            }}
          />
          <TouchableOpacity onPress={() => setAddWebsiteModal(true)}>
            <MaterialIcons
              name="add-circle"
              size={40}
              color={tw.color('blue-600')}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          bounces={true}
          data={data?.websites?.payload}
          renderItem={({item}) => <Item item={item} />}
          ListHeaderComponent={() => <View style={tw`h-2`} />}
          ListFooterComponent={() => <View style={tw`h-2`} />}
          onEndReached={() => {
            fetchMore({
              variables: {
                offset: data?.websites?.payload.length,
                limit: 10,
              },
            });
          }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        />
      </View>
      <AddWebsiteModal
        visible={addWebsiteModal}
        onClose={() => {
          setAddWebsiteModal(false);
        }}
      />
      <EditWebsiteModal
        website={editWebsiteModal}
        onClose={() => {
          setEditWebsiteModal(null);
        }}
      />
    </>
  );
};

export default AdminWebsiteListScreen;
