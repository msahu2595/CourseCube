import {useMutation, useQuery} from '@apollo/client';
import {tw} from '@lib';
import {DELETE_WEBSITE} from 'apollo/mutations/DELETE_WEBSITE';
import {WEBSITES} from 'apollo/queries/WEBSITES';
import AddWebsiteModal from 'components/AddWebsiteModal';
import EditWebsiteModal from 'components/EditWebsiteModal';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Linking,
  RefreshControl,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminWebsiteListScreen = () => {
  const {loading, data, errors, refetch, fetchMore} = useQuery(WEBSITES);
  const [search, setSearch] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [addWebsiteModalVisible, setAddWebsiteModalVisible] = useState(false);
  const [editWebsiteModal, setEditWebsiteModal] = useState(null);

  const [deleteWebsite] = useMutation(DELETE_WEBSITE, {
    onCompleted: () => {
      showMessage({
        message: 'Your Website successfully deleted',
        type: 'success',
      });
    },
    onError: () => {
      showMessage({
        message: 'Not able to delete',
        type: 'danger',
      });
    },
    refetchQueries: ['websites'],
  });

  const deleteHandler = useCallback(
    websiteId =>
      Alert.alert('Delete Website', 'Are you want to delete article', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            deleteWebsite({
              variables: {websiteId},
            }),
        },
      ]),
    [deleteWebsite],
  );

  console.log(data?.websites?.payload);

  const Item = useCallback(
    ({item}) => (
      <View style={tw`p-2`}>
        <Button
          title={item.name}
          onPress={() => {
            Linking.openURL(item.link);
          }}
        />
        <View style={tw`flex-row  justify-around  `}>
          <Button
            onPress={() => setEditWebsiteModal(item)}
            title="Edit"
            color="#841584"
          />
          <Button
            title={'Delete'}
            color="red"
            onPress={() => {
              deleteHandler(item._id);
            }}
          />
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
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value => {
              setIsEnabled(value);
              refetch({filter: {enable: !value}});
              value = {isEnabled};
            }}
          />
          <TouchableOpacity onPress={() => setAddWebsiteModalVisible(true)}>
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
          onEndReached={() => {
            console.log('reached end');
            fetchMore({
              variables: {
                offset: data?.videos?.payload.length,
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
        visible={addWebsiteModalVisible}
        onClose={() => {
          setAddWebsiteModalVisible(false);
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
