/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
import {useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '@lib/tailwind';
import {DOCUMENTS} from '@queries';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddDocumentModal from 'components/AddDocumentModal';
import EditDocumentModal from 'components/EditDocumentModal';
import {DELETE_DOCUMENT} from 'apollo/mutations/DELETE_DOCUMENT';
import {showMessage} from 'react-native-flash-message';
import AddContentModal from 'components/AddContentModal';

const AdminDocumentListScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');
  const [addDocsModalVisible, setAddDocsModalVisible] = useState(false);
  const [editDocumentModal, setEditDocumentModal] = useState(null);
  const [addContentModal, setAddContentModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(DOCUMENTS, {
    variables: {offset: 0},
  });

  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    onCompleted: () => {
      showMessage({
        message: 'Your Document successfully deleted',
        type: 'success',
      });
    },
    onError: () => {
      showMessage({
        message: 'Not able to delete',
        type: 'danger',
      });
    },
    refetchQueries: ['documents'],
  });

  const deleteHandler = useCallback(
    documentId =>
      Alert.alert('Delete Document', 'Are you want to delete article', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            deleteDocument({
              variables: {documentId},
            }),
        },
      ]),
    [deleteDocument],
  );

  const width = Dimensions.get('window').width;
  // console.log(width);
  const Item = useCallback(
    ({item}) => (
      <View style={tw.style(` rounded-lg bg-gray-200`, {width: width / 2 - 8})}>
        <ImageBackground
          source={{
            uri: item?.thumbnail,
          }}
          resizeMode="cover"
          style={tw`h-40  justify-between`}>
          <View style={tw` h-10 `}>
            <Text
              style={tw` self-end text-xs  text-white p-1 bg-black bg-opacity-40  rounded-bl-lg `}>
              {item.time}
            </Text>
          </View>
          <View
            style={tw`bg-black bg-opacity-50 text-white p-1 h-10 justify-center`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`text-xs px-1 text-white`}>
              {item.title}
            </Text>
          </View>
        </ImageBackground>
        <Button
          onPress={() => setAddContentModal(item)}
          title="Add content"
          color="green"
        />
        <Button
          onPress={() => setEditDocumentModal(item)}
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
    ),
    [],
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
            }}
            value={isEnabled}
          />
          <TouchableOpacity onPress={() => setAddDocsModalVisible(true)}>
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
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={tw`justify-between`}
          contentContainerStyle={tw`p-1`}
          ItemSeparatorComponent={() => <View style={tw`h-2`} />}
          onEndReached={() => {
            console.log('reached end');
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
        visible={addDocsModalVisible}
        onClose={() => {
          setAddDocsModalVisible(false);
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
