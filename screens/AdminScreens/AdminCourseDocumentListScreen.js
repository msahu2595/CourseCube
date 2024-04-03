import {
  View,
  Text,
  Alert,
  FlatList,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import tw from '@lib/tailwind';
import {BUNDLE_CONTENTS} from '@queries';
import {DocumentItem, Fab} from '@components';
// import {CCSearchInput} from 'components/Common';
import {DELETE_BUNDLE_CONTENT} from '@mutations';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import SelectMediaModal from 'components/SelectMediaModal';
import AddBundleContentModal from 'components/AddBundleContentModal';
import EditBundleContentModal from 'components/EditBundleContentModal';

const columns = 3;
const type = 'Document';
const width = Dimensions.get('window').width;
const itemWidth = columns
  ? width / columns - ((columns + 1) * 4) / columns
  : null;

const AdminCourseDocumentListScreen = ({route: {params}}) => {
  // const [search, setSearch] = useState('');
  const [addBundleContentModal, setAddBundleContentModal] = useState(null);
  const [editBundleContentModal, setEditBundleContentModal] = useState(null);
  const [selectMediaModal, setSelectMediaModal] = useState(false);

  const {loading, data, refetch, fetchMore} = useQuery(BUNDLE_CONTENTS, {
    variables: {
      bundleId: params?.bundleId,
      filter: {type, subjectId: params?.subjectId || null},
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [deleteBundleContent] = useMutation(DELETE_BUNDLE_CONTENT, {
    onCompleted: () => {
      showMessage({
        message: 'Course content is successfully deleted.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: [
      {
        query: BUNDLE_CONTENTS,
        variables: {
          bundleId: params?.bundleId,
          filter: {type, subjectId: params?.subjectId || null},
        },
      },
    ],
  });

  const deleteHandler = useCallback(
    bundleContentId =>
      Alert.alert(
        'Delete Course Content',
        'Are you sure, you want to delete this course content?',
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteBundleContent({
                variables: {bundleContentId},
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
    [deleteBundleContent],
  );

  // const onChangeSearchText = useCallback(
  //   text => {
  //     console.log(text);
  //     setSearch(text);
  //     if (text.length > 2) {
  //       refetch({search: text});
  //     } else {
  //       refetch({search: ''});
  //     }
  //   },
  //   [refetch],
  // );

  // const clearSearchText = useCallback(() => {
  //   setSearch('');
  //   refetch({search: ''});
  // }, [refetch]);

  const _renderItem = useCallback(
    ({item}) => (
      <View>
        <DocumentItem {...item} width={itemWidth} />
        <View style={tw`flex-row mt-[2px]`}>
          <TouchableOpacity
            style={tw`flex-1 items-center bg-blue-500 py-2 rounded-md`}
            onPress={() => setEditBundleContentModal(item)}>
            <Text style={tw`text-white text-xs font-avReg`}>Edit</Text>
          </TouchableOpacity>
          <View style={tw`w-[2px]`} />
          <TouchableOpacity
            style={tw`flex-1 items-center bg-red-500 py-2 rounded-md`}
            onPress={() => deleteHandler(item._id)}>
            <Text style={tw`text-white text-xs font-avReg`}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [deleteHandler],
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* <CCSearchInput
        value={search}
        searching={loading}
        onChangeText={onChangeSearchText}
        onClear={clearSearchText}
      /> */}
      <FlatList
        bounces={true}
        numColumns={columns}
        //
        data={data?.bundleContents?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-1`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={tw`h-1`} />}
        ListFooterComponent={() => (
          <View style={tw`py-4 items-center`}>
            <Text style={tw`text-xs text-gray-600 font-avSemi`}>
              {loading ? 'Loading...' : "That's all, we have got!!"}
            </Text>
          </View>
        )}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.bundleContents?.payload.length,
              limit: 10,
            },
          });
        }}
      />
      <AddBundleContentModal
        bundleId={params?.bundleId}
        subjectId={params?.subjectId || null}
        media={addBundleContentModal}
        onClose={() => {
          setAddBundleContentModal(null);
        }}
      />
      <EditBundleContentModal
        bundleId={params?.bundleId}
        subjectId={params?.subjectId || null}
        bundleContent={editBundleContentModal}
        onClose={() => {
          setEditBundleContentModal(null);
        }}
      />
      <SelectMediaModal
        type={type}
        visible={selectMediaModal}
        onSelect={item => {
          setSelectMediaModal(false);
          setAddBundleContentModal(item);
        }}
        onClose={() => {
          setSelectMediaModal(false);
        }}
      />
      <Fab
        iconName="plus"
        disabled={selectMediaModal}
        bgColor={tw.color('blue-600')}
        onPress={() => setSelectMediaModal(true)}
      />
    </View>
  );
};

export default AdminCourseDocumentListScreen;
