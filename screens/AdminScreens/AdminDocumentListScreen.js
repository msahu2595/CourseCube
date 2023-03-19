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
import tw from '@lib/tailwind';
import {DOCUMENTS} from '@queries';
import {MediaItem} from '@components';
import {DELETE_DOCUMENT} from '@mutations';
import {showMessage} from 'react-native-flash-message';
import AddContentModal from 'components/AddContentModal';
import AddDocumentModal from 'components/AddDocumentModal';
import EditDocumentModal from 'components/EditDocumentModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminDocumentListScreen = () => {
  const [search, setSearch] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [addDocsModal, setAddDocsModal] = useState(false);
  const [addContentModal, setAddContentModal] = useState(null);
  const [editDocumentModal, setEditDocumentModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(DOCUMENTS);

  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    onCompleted: () => {
      showMessage({
        message: 'Document is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred.',
        type: 'danger',
      });
    },
    refetchQueries: ['documents'],
  });

  const deleteHandler = useCallback(
    documentId =>
      Alert.alert(
        'Delete Document',
        'Are you sure, you want to delete this document?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteDocument({
                variables: {documentId},
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
    [deleteDocument],
  );

  const Item = item => (
    <MediaItem
      title={item.title}
      label={item.pages}
      image={item.thumbnail}
      handleCreateContent={() => setAddContentModal(item)}
      handleEdit={() => setEditDocumentModal(item)}
      handleDelete={() => deleteHandler(item._id)}
    />
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
          <TouchableOpacity onPress={() => setAddDocsModal(true)}>
            <MaterialIcons
              name="add-circle"
              size={40}
              color={tw.color('blue-600')}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          bounces={true}
          data={data?.documents?.payload}
          renderItem={({item}) => <Item {...item} />}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={tw`justify-between`}
          contentContainerStyle={tw`p-1`}
          ItemSeparatorComponent={() => <View style={tw`h-1`} />}
          onEndReached={() => {
            fetchMore({
              variables: {
                offset: data?.documents?.payload.length,
                limit: 10,
              },
            });
          }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        />
      </View>
      <AddDocumentModal
        visible={addDocsModal}
        onClose={() => {
          setAddDocsModal(false);
        }}
      />
      <EditDocumentModal
        document={editDocumentModal}
        onClose={() => {
          setEditDocumentModal(null);
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

export default AdminDocumentListScreen;
