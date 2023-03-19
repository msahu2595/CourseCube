import {useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {
  View,
  Alert,
  Switch,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import {TESTS} from '@queries';
import {MediaItem} from '@components';
import {DELETE_TEST} from '@mutations';
import AddTestModal from 'components/AddTestModal';
import EditTestModal from 'components/EditTestModal';
import {showMessage} from 'react-native-flash-message';
import AddContentModal from 'components/AddContentModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminTestListScreen = () => {
  const [search, setSearch] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [addTestModal, setAddTestModal] = useState(false);
  const [editTestModal, setEditTestModal] = useState(null);
  const [addContentModal, setAddContentModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(TESTS);

  const [deleteTest] = useMutation(DELETE_TEST, {
    onCompleted: () => {
      showMessage({
        message: 'Test is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred.',
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

  const Item = useCallback(
    item => (
      <MediaItem
        title={item.title}
        label={new Date(dayjs.duration(item.duration).asMilliseconds())
          .toISOString()
          .slice(11, 19)}
        image={item.thumbnail}
        handleEdit={() => setEditTestModal(item)}
        handleDelete={() => deleteHandler(item._id)}
        handleCreateContent={() => setAddContentModal(item)}
      />
    ),
    [deleteHandler],
  );

  return (
    <>
      <View style={tw`flex-1`}>
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
            }}
            value={isEnabled}
          />
          <TouchableOpacity onPress={() => setAddTestModal(true)}>
            <MaterialIcons
              name="add-circle"
              size={40}
              color={tw.color('blue-600')}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          bounces={true}
          data={data?.tests?.payload}
          renderItem={({item}) => <Item {...item} />}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={tw`justify-between`}
          contentContainerStyle={tw`p-1`}
          ItemSeparatorComponent={() => <View style={tw`h-1`} />}
          onEndReached={() => {
            fetchMore({
              variables: {
                offset: data?.tests?.payload.length,
                limit: 10,
              },
            });
          }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        />
      </View>
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
    </>
  );
};

export default AdminTestListScreen;
