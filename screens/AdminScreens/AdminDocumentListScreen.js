import tw from '@lib/tailwind';
import {DOCUMENTS} from '@queries';
import {Fab, MediaItem} from '@components';
import {DELETE_DOCUMENT} from '@mutations';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import AddContentModal from 'components/AddContentModal';
import AddDocumentModal from 'components/AddDocumentModal';
import EditDocumentModal from 'components/EditDocumentModal';
import {View, Alert, FlatList, RefreshControl} from 'react-native';

const AdminDocumentListScreen = () => {
  const [search, setSearch] = useState('');
  const [addContentModal, setAddContentModal] = useState(null);
  const [addDocumentModal, setAddDocumentModal] = useState(false);
  const [editDocumentModal, setEditDocumentModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(DOCUMENTS, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    onCompleted: () => {
      showMessage({
        message: 'Document is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
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

  const onChangeSearchText = useCallback(
    text => {
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

  const Item = item => (
    <MediaItem
      title={item.title}
      label={`${item.pages} Pages`}
      image={item.thumbnail}
      options={[
        {
          key: 'Create content',
          positive: true,
          label: 'Create content',
          onSelect: () => setAddContentModal(item),
        },
        {
          key: 'Edit',
          label: 'Edit',
          onSelect: () => setEditDocumentModal(item),
        },
        {
          key: 'Delete',
          danger: true,
          label: 'Delete',
          onSelect: () => deleteHandler(item._id),
        },
      ]}
    />
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
        numColumns={2}
        //
        data={data?.documents?.payload}
        keyExtractor={item => item._id}
        renderItem={({item}) => <Item {...item} />}
        //
        contentContainerStyle={tw`px-1`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={tw`h-1`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.documents?.payload.length,
              limit: 10,
            },
          });
        }}
      />
      <AddDocumentModal
        visible={addDocumentModal}
        onClose={() => {
          setAddDocumentModal(false);
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
      <Fab
        iconName="plus"
        bgColor={tw.color('blue-600')}
        onPress={() => setAddDocumentModal(true)}
      />
    </View>
  );
};

export default AdminDocumentListScreen;
