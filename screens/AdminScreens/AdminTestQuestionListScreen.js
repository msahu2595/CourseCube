import {tw} from '@lib';
import {CCSearchInput} from 'components/Common';
import Zoom from 'react-native-zoom-reanimated';
import config from 'react-native-ultimate-config';
import {showMessage} from 'react-native-flash-message';
import {gql, useMutation, useQuery} from '@apollo/client';
import Passage from 'screens/ExamScreens/components/Passage';
import React, {memo, useCallback, useMemo, useState} from 'react';
import AddTestQuestionModal from 'components/AddTestQuestionModal';
import {Fab, MenuOptionItem, SafeAreaContainer} from '@components';
import EditTestQuestionModal from 'components/EditTestQuestionModal';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import DeleteTestQuestionModal from 'components/DeleteTestQuestionModal';
import {Alert, FlatList, Image, RefreshControl, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TEST_QUESTIONS = gql`
  query testQuestions($testId: ID!, $offset: Int, $limit: Int) {
    testQuestions(testId: $testId, offset: $offset, limit: $limit) {
      code
      success
      message
      token
      offset
      limit
      testId
      payload {
        _id
        question
        image
        passage
        options
        answerIndex
        mark
        negativeMark
        invalid
        enable
      }
    }
  }
`;

const REMOVE_TEST_QUESTION_IMAGE = gql`
  mutation removeTestQuestionImage($questionId: ID!) {
    removeTestQuestionImage(questionId: $questionId) {
      code
      success
      message
      token
      payload {
        _id
        question
        image
        passage
        options
        answerIndex
        mark
        negativeMark
        invalid
        enable
      }
    }
  }
`;

const AdminTestQuestionListScreen = ({route: {params}}) => {
  const [search, setSearch] = useState('');
  const [addTestQuestionModal, setAddTestQuestionModal] = useState({
    visible: false,
    position: null,
  });
  const [editTestQuestionModal, setEditTestQuestionModal] = useState(null);
  const [deleteTestQuestionModal, setDeleteTestQuestionModal] = useState(null);

  const {loading, data, refetch, fetchMore} = useQuery(TEST_QUESTIONS, {
    variables: {testId: params?.testId},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [removeTestQuestionImage] = useMutation(REMOVE_TEST_QUESTION_IMAGE, {
    onCompleted: () => {
      showMessage({
        message: 'Test question image is successfully removed.',
        type: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: ['testQuestions'],
  });

  const removeImageHandler = useCallback(
    questionId =>
      Alert.alert(
        'Remove Image',
        'Are you sure, you want to remove image of this question?',
        [
          {
            text: 'Yes',
            onPress: () => {
              removeTestQuestionImage({
                variables: {questionId},
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
    [removeTestQuestionImage],
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

  const _renderItem = useCallback(
    ({item, index}) => (
      <Item
        index={index}
        onCreate={setAddTestQuestionModal}
        onEdit={setEditTestQuestionModal}
        onRemoveImage={removeImageHandler}
        onDelete={setDeleteTestQuestionModal}
        {...item}
      />
    ),
    [removeImageHandler],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="dark-content">
      <CCSearchInput
        value={search}
        searching={loading}
        onChangeText={onChangeSearchText}
        onClear={clearSearchText}
      />
      <FlatList
        bounces={true}
        //
        data={data?.testQuestions?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-1`}
        ListFooterComponent={() => <View style={tw`h-[56px]`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              testId: params?.testId,
              offset: data?.testQuestions?.payload.length,
              limit: 10,
            },
          });
        }}
      />
      <AddTestQuestionModal
        testId={params?.testId}
        data={addTestQuestionModal}
        onClose={() => {
          setAddTestQuestionModal({visible: false, position: null});
        }}
      />
      <EditTestQuestionModal
        question={editTestQuestionModal}
        onClose={() => {
          setEditTestQuestionModal(null);
        }}
      />
      <DeleteTestQuestionModal
        questionId={deleteTestQuestionModal}
        onClose={() => {
          setDeleteTestQuestionModal(null);
        }}
      />
      <Fab
        iconName="plus"
        bgColor={tw.color('blue-600')}
        onPress={() => setAddTestQuestionModal({visible: true, position: null})}
      />
    </SafeAreaContainer>
  );
};

export default AdminTestQuestionListScreen;

const Item = memo(({onCreate, onEdit, onRemoveImage, onDelete, ...item}) => {
  const imageViewer = useMemo(
    () =>
      item?.enable && item?.image ? (
        <Zoom style={tw.style('mt-1 bg-gray-200')}>
          <Image
            resizeMode="contain"
            source={{
              uri: `${
                __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
              }/${item?.image}`,
            }}
            style={{width: '100%', aspectRatio: 1}}
          />
        </Zoom>
      ) : null,
    [item?.enable, item?.image],
  );

  return (
    <View key={item?._id} style={tw`bg-white p-2 mx-2 mb-4 rounded-lg`}>
      {!item?.enable && (
        <Text style={tw`pl-2 pb-2 text-xs font-avReg text-red-600`}>
          {`Question is deleted${item?.invalid ? ' & Invalid' : ''}.`}
        </Text>
      )}
      <View style={tw`opacity-${item?.enable ? 100 : 50}`}>
        <View style={tw`px-4 py-4 bg-white rounded-lg border border-gray-200`}>
          <Text
            style={tw`text-base font-avReg text-${
              item?.invalid ? 'red-600' : 'gray-900'
            } leading-5`}>
            {`Q.${item?.index + 1}. ${item?.question}`}
          </Text>
        </View>
        <View style={tw`pt-2`}>
          <Passage content={item?.passage} />
          {imageViewer}
        </View>
        <View style={tw`my-1`}>
          {item?.options?.map((option, index) => {
            return (
              <View
                key={`${index}-OPTION`}
                style={tw`flex-row justify-between p-4 bg-${
                  item?.answerIndex === index ? 'green-400' : 'yellow-50'
                } my-1 shadow-sm rounded-lg ios:border ios:border-gray-200`}>
                <View style={tw`flex-1 mr-2 flex-row`}>
                  <Text style={tw`font-avReg text-black text-sm`}>
                    {index + 1}.
                  </Text>
                  <Text style={tw`font-avReg text-black text-sm pl-2`}>
                    {option}
                  </Text>
                </View>
                {item?.answerIndex === index && (
                  <View style={tw`justify-center`}>
                    <MaterialCommunityIcons
                      size={20}
                      name="check"
                      color={tw.color('gray-900')}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <View style={tw`flex-row justify-between`}>
          <View style={tw`flex-1 flex-row flex-wrap`}>
            <View
              style={tw`mr-2 items-center px-4 py-2 rounded bg-gray-50 shadow-sm border border-gray-400`}>
              <Text style={tw`font-avSemi text-xs text-gray-900`}>
                Marks: {item.mark}
              </Text>
            </View>
            {item.negativeMark > 0 && (
              <View
                style={tw`mr-2 items-center px-4 py-2 rounded bg-gray-50 shadow-sm border border-gray-400`}>
                <Text style={tw`font-avSemi text-xs text-gray-900`}>
                  Negative Marks: - {item.negativeMark}
                </Text>
              </View>
            )}
          </View>
          <Menu>
            <MenuTrigger
              disabled={!item?.enable}
              style={tw`mr-2 items-center px-2 py-2 rounded bg-gray-50 shadow-sm border border-gray-400`}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={20}
                color={tw.color('gray-900')}
              />
            </MenuTrigger>
            <MenuOptions style={tw`py-2`}>
              <MenuOptionItem
                positive
                label="Add Question Above"
                onSelect={() => {
                  onCreate({visible: true, position: item?.index});
                }}
              />
              <MenuOptionItem
                label="Edit Question"
                onSelect={() => {
                  onEdit(item);
                }}
              />
              <MenuOptionItem
                label="Remove Image"
                disabled={!item?.image}
                onSelect={() => {
                  onRemoveImage(item?._id);
                }}
              />
              <MenuOptionItem
                danger
                label="Delete Question"
                onSelect={() => {
                  onDelete(item?._id);
                }}
              />
            </MenuOptions>
          </Menu>
        </View>
      </View>
    </View>
  );
});
