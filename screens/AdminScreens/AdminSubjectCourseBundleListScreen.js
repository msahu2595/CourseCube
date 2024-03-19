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
import {BUNDLES} from '@queries';
import {DELETE_BUNDLE} from '@mutations';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import AddBundleModal from 'components/AddBundleModal';
import {showMessage} from 'react-native-flash-message';
import {Fab, SubjectWiseCourseItem} from '@components';
import EditBundleModal from 'components/EditBundleModal';

const columns = 1;
const type = 'SUBJECT_COURSE';
const width = Dimensions.get('window').width;
const itemWidth = columns
  ? width / columns - ((columns + 1) * 8) / columns
  : null;

function AdminSubjectCourseBundleListScreen({navigation}) {
  const [search, setSearch] = useState('');
  const [addBundleModal, setAddBundleModal] = useState(false);
  const [editBundleModal, setEditBundleModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(BUNDLES, {
    variables: {filter: {type}},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [deleteBundle] = useMutation(DELETE_BUNDLE, {
    onCompleted: () => {
      showMessage({
        message: 'Subject course is successfully deleted',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: [{query: BUNDLES, variables: {filter: {type}}}],
  });

  const deleteHandler = useCallback(
    bundleId =>
      Alert.alert(
        'Delete Course',
        'Are you sure, you want to delete this subject course?',
        [
          {
            text: 'Yes',
            onPress: () =>
              deleteBundle({
                variables: {bundleId},
              }),
            style: 'destructive',
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
      ),
    [deleteBundle],
  );

  const onChangeSearchText = useCallback(
    text => {
      console.log(text);
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

  const navigateSyllabusScreen = useCallback(
    bundleId => {
      navigation.navigate('AdminCourseSyllabusScreen', {bundleId});
    },
    [navigation],
  );

  const _renderItem = useCallback(
    ({item}) => (
      <View>
        <SubjectWiseCourseItem {...item} width={itemWidth} />
        <View style={tw`flex-row mt-[2px]`}>
          <TouchableOpacity
            style={tw`flex-1 items-center bg-blue-500 py-2 rounded-md`}
            onPress={() => setEditBundleModal(item)}>
            <Text style={tw`text-white text-xs font-avReg`}>Edit</Text>
          </TouchableOpacity>
          <View style={tw`w-[2px]`} />
          <TouchableOpacity
            style={tw`flex-1 items-center bg-purple-500 py-2 rounded-md`}
            onPress={() => navigateSyllabusScreen(item._id)}>
            <Text style={tw`text-white text-xs font-avReg`}>Syllabus</Text>
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
    [navigateSyllabusScreen, deleteHandler],
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
        numColumns={columns}
        //
        data={data?.bundles?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-2`}
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
              offset: data?.bundles?.payload.length,
              limit: 10,
            },
          });
        }}
      />
      <AddBundleModal
        type={type}
        visible={addBundleModal}
        onClose={() => {
          setAddBundleModal(false);
        }}
      />
      <EditBundleModal
        type={type}
        bundle={editBundleModal}
        onClose={() => {
          setEditBundleModal(null);
        }}
      />
      <Fab
        iconName="plus"
        disabled={addBundleModal}
        bgColor={tw.color('blue-600')}
        onPress={() => setAddBundleModal(true)}
      />
    </View>
  );
}

export default AdminSubjectCourseBundleListScreen;
