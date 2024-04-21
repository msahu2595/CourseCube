import tw from '@lib/tailwind';
import {DOCUMENTS} from '@queries';
import {Fab, MediaItem} from '@components';
import {DELETE_DOCUMENT} from '@mutations';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import AddContentModal from 'components/AddContentModal';
import {gql, useMutation, useQuery} from '@apollo/client';
import AddDocumentModal from 'components/AddDocumentModal';
import EditDocumentModal from 'components/EditDocumentModal';
import {View, Alert, FlatList, RefreshControl} from 'react-native';

const REMOVE_DOCUMENT_THUMBNAIL = gql`
  mutation removeDocumentThumbnail($documentId: ID!) {
    removeDocumentThumbnail(documentId: $documentId) {
      code
      success
      message
      token
      payload {
        _id
        title
        thumbnail
        url
        pages
        enable
        createdAt
        updatedAt
      }
    }
  }
`;

const AdminDocumentListScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [addContentModal, setAddContentModal] = useState(null);
  const [addDocumentModal, setAddDocumentModal] = useState(false);
  const [editDocumentModal, setEditDocumentModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(DOCUMENTS, {
    variables: {limit: 20},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [removeDocumentThumbnail] = useMutation(REMOVE_DOCUMENT_THUMBNAIL, {
    onCompleted: () => {
      showMessage({
        message: 'Document thumbnail is successfully removed.',
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

  const removeThumbnailHandler = useCallback(
    documentId =>
      Alert.alert(
        'Remove Thumbnail',
        'Are you sure, you want to remove thumbnail of this document?',
        [
          {
            text: 'Yes',
            onPress: () => {
              removeDocumentThumbnail({
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
    [removeDocumentThumbnail],
  );

  const deleteDocumentHandler = useCallback(
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

  const handleNavigation = useCallback(
    item => {
      navigation.navigate('AdminDocumentViewScreen', {
        documentId: item?._id,
        title: item?.title,
      });
    },
    [navigation],
  );

  const _renderItem = useCallback(
    ({item}) => (
      <MediaItem
        title={item.title}
        label={`${item.pages} Pages`}
        image={item.thumbnail}
        onPress={() => handleNavigation(item)}
        options={[
          {
            key: 'Create content',
            positive: true,
            label: 'Create content',
            onSelect: () => setAddContentModal(item),
          },
          {
            key: 'Edit document',
            label: 'Edit document',
            onSelect: () => setEditDocumentModal(item),
          },
          {
            key: 'Remove thumbnail',
            label: 'Remove thumbnail',
            disabled: !item.thumbnail,
            onSelect: () => removeThumbnailHandler(item._id),
          },
          {
            key: 'Delete document',
            danger: true,
            label: 'Delete document',
            onSelect: () => deleteDocumentHandler(item._id),
          },
        ]}
      />
    ),
    [handleNavigation, removeThumbnailHandler, deleteDocumentHandler],
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
        renderItem={_renderItem}
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
              limit: 20,
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
        media={addContentModal}
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
