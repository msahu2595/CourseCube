import React, {
  memo,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {tw} from '@lib';
import dayjs from 'dayjs';
import {ANSWERS} from '@queries';
import {SafeAreaContainer} from '@components';
import {useMutation, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {BOOKMARK, CREATE_ANSWER, LIKE, UNBOOKMARK, UNLIKE} from '@mutations';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuOptionItem from 'components/MenuOptionItem';

const alphabets = 'ABCDEFGH';

const PostViewScreen = ({route}) => {
  const answerInputRef = useRef(null);

  const {loading: queryLoading, data: queryData} = useQuery(ANSWERS, {
    variables: {questionId: route?.params?.question?._id},
    fetchPolicy: 'network-only',
  });

  const question = useMemo(
    () => route?.params?.question,
    [route?.params?.question],
  );

  const focusAnswerInput = useCallback(() => {
    answerInputRef.current?.focus();
  }, []);

  const renderPostItem = useCallback(
    ({item, index}) => <AnswerListItem index={index} {...item} />,
    [],
  );

  const ListHeaderComponent = useCallback(
    () => (
      <>
        <QuestionView {...question} onPressAnswer={focusAnswerInput} />
        <View style={tw`mt-2 py-2 px-3 bg-white border-b border-gray-300`}>
          <Text style={tw`font-avSemi text-lg text-gray-600`}>Answers</Text>
        </View>
        <View style={tw`h-3 bg-white`} />
      </>
    ),
    [question, focusAnswerInput],
  );

  console.log(queryLoading, queryData);

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('red-600')}
      statusBarStyle="dark-content">
      <FlatList
        data={queryData?.answers?.payload || []}
        renderItem={renderPostItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={() => <View style={tw`h-2`} />}
      />
      <AnswerInput ref={answerInputRef} questionId={question?._id} />
    </SafeAreaContainer>
  );
};

export default PostViewScreen;

const AnswerListItem = memo(props => {
  const navigation = useNavigation();

  const navigateUserProfile = useCallback(() => {
    navigation.navigate('UserProfileScreen', {
      userId: props?.user?._id,
    });
  }, [navigation, props?.user?._id]);

  return (
    <View style={tw`bg-white py-2`}>
      <View style={tw`flex-row items-center`}>
        <Image
          source={{uri: props?.user?.picture}}
          resizeMode="contain"
          style={tw.style('rounded-full', 'mx-4', {
            width: 34,
            aspectRatio: 1,
          })}
        />
        <TouchableOpacity onPress={navigateUserProfile} style={tw`flex-1`}>
          <Text style={tw`font-avSemi text-sm text-gray-600`}>
            {props?.user?.fullName}
          </Text>
          <Text style={tw`font-avReg text-xs text-gray-500`}>
            {dayjs(parseInt(props?.createdAt, 10)).fromNow()}
          </Text>
        </TouchableOpacity>
        <Menu>
          <MenuTrigger style={tw`px-2`}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={tw.color('gray-600')}
            />
          </MenuTrigger>
          <MenuOptions style={tw`py-2`}>
            {props?.user?._id && (
              <>
                <MenuOptionItem label="Edit" onSelect={null} />
                <MenuOptionItem label="Delete" onSelect={null} />
              </>
            )}
            <MenuOptionItem danger label="Report" onSelect={null} />
          </MenuOptions>
        </Menu>
      </View>
      <Pressable onPress={null} style={tw`my-2`}>
        <Text
          style={tw`px-4 mb-2 font-avReg text-sm text-gray-600`}
          numberOfLines={6}>
          {props?.answer}
        </Text>
        {!!props?.image && (
          <Image
            source={{uri: props?.image}}
            resizeMode="contain"
            style={tw.style({
              width: '100%',
              height: undefined,
              aspectRatio: 16 / 9,
            })}
          />
        )}
      </Pressable>
      <View style={tw`flex-row px-2`}>
        <TouchableOpacity style={tw`px-3 flex-row items-center justify-center`}>
          <AntDesign name="like2" size={18} color={tw.color('gray-600')} />
          <Text style={tw`font-avSemi text-xs text-gray-600 pl-2`}>
            {props?.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`px-3 flex-row items-center justify-center`}>
          <AntDesign name="dislike2" size={18} color={tw.color('gray-600')} />
          <Text style={tw`font-avSemi text-xs text-gray-600 pl-2`}>
            {props?.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`px-3 flex-row items-center justify-center`}>
          <AntDesign name="sharealt" size={18} color={tw.color('gray-600')} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const QuestionView = memo(question => {
  const navigation = useNavigation();
  const [choice, setChoice] = useState(null);
  const [liked, setLiked] = useState(question?.liked);
  const [bookmarked, setBookmarked] = useState(question?.bookmarked);

  const [like, {loading: likeLoading}] = useMutation(LIKE, {
    variables: {refId: question?._id},
    onCompleted: data => {
      console.log('like ==> ', data);
      setLiked(true);
    },
    onError: error => {
      console.log('like ==> ', error);
    },
    // update: (cache, {data}, options) => {
    //   cache.modify({
    //     fields: {
    //       questions(existingQuestions = {}) {
    //         const newQuestionsArr = existingQuestions?.payload?.map(q => {
    //           if (q?._id === data?.like?.payload?.refId) {
    //             q.liked = 1;
    //             q.likes = q.likes + 1;
    //           }
    //           return q;
    //         });
    //         existingQuestions.payload = newQuestionsArr;
    //         return existingQuestions;
    //       },
    //     },
    //   });
    // },
  });

  const [unlike, {loading: unlikeLoading}] = useMutation(UNLIKE, {
    variables: {refId: question?._id},
    onCompleted: data => {
      console.log('unlike ==> ', data);
      setLiked(false);
    },
    onError: error => {
      console.log('unlike ==> ', error);
    },
    // update: (cache, {data}, options) => {
    //   cache.modify({
    //     fields: {
    //       questions(existingQuestions = {}) {
    //         const newQuestionsArr = existingQuestions?.payload?.map(q => {
    //           if (q?._id === data?.like?.payload?.refId) {
    //             q.liked = 0;
    //             q.likes = q.likes - 1;
    //           }
    //           return q;
    //         });
    //         existingQuestions.payload = newQuestionsArr;
    //         return existingQuestions;
    //       },
    //     },
    //   });
    // },
  });

  const [bookmark, {loading: bookmarkLoading}] = useMutation(BOOKMARK, {
    variables: {refId: question?._id, type: 'QUESTION'},
    onCompleted: data => {
      console.log('bookmark ==> ', data);
      setBookmarked(true);
    },
    onError: error => {
      console.log('bookmark ==> ', error);
    },
  });

  const [unbookmark, {loading: unbookmarkLoading}] = useMutation(UNBOOKMARK, {
    variables: {refId: question?._id, type: 'QUESTION'},
    onCompleted: data => {
      console.log('unbookmark ==> ', data);
      setBookmarked(false);
    },
    onError: error => {
      console.log('unbookmark ==> ', error);
    },
  });

  const navigateUserProfile = useCallback(() => {
    navigation.navigate('UserProfileScreen', {
      userId: question?.user?._id,
    });
  }, [navigation, question?.user?._id]);

  return (
    <View style={tw`bg-white`}>
      <View style={tw`flex-row items-center py-2`}>
        <Image
          source={{uri: question?.user?.picture}}
          resizeMode="contain"
          style={tw.style('rounded-full', 'mx-4', {
            width: 40,
            aspectRatio: 1,
          })}
        />
        <TouchableOpacity onPress={navigateUserProfile} style={tw`flex-1`}>
          <Text style={tw`font-avSemi text-sm text-gray-600`}>
            {question?.user?.fullName}
          </Text>
          <Text style={tw`font-avReg text-xs text-gray-500`}>
            {dayjs(parseInt(question?.createdAt, 10)).fromNow()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={bookmarkLoading || unbookmarkLoading}
          onPress={bookmarked ? unbookmark : bookmark}>
          <MaterialCommunityIcons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={tw.color(bookmarked ? 'red-600' : 'gray-600')}
          />
        </TouchableOpacity>
        <Menu>
          <MenuTrigger style={tw`px-2`}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={tw.color('gray-600')}
            />
          </MenuTrigger>
          <MenuOptions style={tw`py-2`}>
            {question?.user?._id && (
              <>
                <MenuOptionItem label="Edit" onSelect={null} />
                <MenuOptionItem label="Delete" onSelect={null} />
              </>
            )}
            <MenuOptionItem danger label="Report" onSelect={null} />
          </MenuOptions>
        </Menu>
      </View>
      <Pressable onPress={null} style={tw`my-2`}>
        <Text
          style={tw`px-4 mb-2 font-avSemi text-base text-gray-600`}
          numberOfLines={6}>
          {question?.title}
        </Text>
        <Text
          style={tw`px-4 mb-2 font-avReg text-sm text-gray-600`}
          numberOfLines={6}>
          {question?.description}
        </Text>
        {!!question?.image && (
          <Image
            source={{uri: question?.image}}
            resizeMode="contain"
            style={tw.style({
              width: '100%',
              height: undefined,
              aspectRatio: 16 / 9,
            })}
          />
        )}
        {question?.options?.length && (
          <View>
            {question?.options.map((option, optionIndex) => (
              <TouchableOpacity
                onPress={() => setChoice(optionIndex)}
                key={'OPTION' + optionIndex}
                style={tw.style(
                  'flex-row',
                  'items-center',
                  'rounded-lg',
                  'py-3',
                  'px-4',
                  'mx-4',
                  'mb-2',
                  'bg-gray-100',
                  {
                    'bg-red-600':
                      typeof choice === 'number'
                        ? choice === optionIndex
                        : false,
                    'bg-green-600':
                      typeof choice === 'number'
                        ? optionIndex === question?.answerIndex
                        : false,
                  },
                )}>
                <Text
                  style={tw`font-avSemi text-sm ${
                    (typeof choice === 'number' &&
                      optionIndex === question?.answerIndex) ||
                    (typeof choice === 'number' && choice === optionIndex)
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}>
                  {alphabets.charAt(optionIndex)}
                </Text>
                <Text
                  style={tw`font-avReg text-sm pl-3 ${
                    (typeof choice === 'number' &&
                      optionIndex === question?.answerIndex) ||
                    (typeof choice === 'number' && choice === optionIndex)
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}
                  numberOfLines={3}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Pressable>
      <View style={tw`flex-row border-t border-gray-200 mx-2`}>
        <TouchableOpacity
          disabled={likeLoading || unlikeLoading}
          onPress={liked ? unlike : like}
          style={tw`py-3 flex-1 flex-row items-center justify-center`}>
          <AntDesign
            name={liked ? 'like1' : 'like2'}
            size={18}
            color={tw.color(liked ? 'red-600' : 'gray-600')}
          />
          <Text style={tw`font-avSemi text-xs text-gray-600 pl-2`}>
            {question?.likes} Upvotes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={question?.onPressAnswer}
          style={tw`py-3 flex-1 flex-row items-center justify-center`}>
          <AntDesign
            name="message1"
            size={18}
            color={tw.color(question?.answered ? 'red-600' : 'gray-600')}
          />
          <Text style={tw`font-avSemi text-xs text-gray-600 pl-2`}>
            {question?.answers} Answers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`py-3 flex-1 flex-row items-center justify-center`}>
          <AntDesign name="sharealt" size={18} color={tw.color('gray-600')} />
          <Text style={tw`font-avSemi text-xs text-gray-600 pl-2`}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const AnswerInput = memo(
  forwardRef(({questionId}, ref) => {
    const [answer, setAnswer] = useState('');
    const [image, setImage] = useState('');

    const [createAnswer, {loading}] = useMutation(CREATE_ANSWER, {
      onCompleted: data => {
        console.log('createAnswer ==> ', data);
        showMessage({
          message:
            'Answer successfully posted. After verification it will show here.',
          type: 'success',
        });
        setAnswer('');
        setImage('');
      },
      onError: error => {
        console.log('createAnswer ==> ', error);
        showMessage({
          message: error?.message || 'Some error occurred.',
          type: 'danger',
        });
      },
      refetchQueries: [
        {query: ANSWERS, variables: {questionId}}, // DocumentNode object parsed with gql
        'answers', // Query name
      ],
    });

    const handleSubmit = useCallback(() => {
      const answerInput = {answer};
      if (image) {
        answerInput.image = image;
      }
      createAnswer({variables: {questionId, answerInput}});
    }, [answer, image, questionId, createAnswer]);

    return (
      <View style={tw`px-2 py-2 flex-row bg-white items-center shadow-2xl`}>
        <View
          style={tw`flex-1 flex-row items-center bg-white rounded-lg border border-gray-300`}>
          <TextInput
            ref={ref}
            style={tw.style(
              'px-2',
              'py-1',
              'flex-1',
              'font-avReg',
              'text-base',
              'text-black',
              'rounded',
              {
                paddingVertical: 0,
                maxHeight: 100,
              },
            )}
            multiline
            textAlignVertical="top"
            placeholder="Type your answer"
            placeholderTextColor={tw.color('gray-400')}
            value={answer}
            onChangeText={setAnswer}
          />
        </View>
        <TouchableOpacity
          style={tw`px-2`}
          disabled={loading}
          onPress={handleSubmit}
          hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
          <FontAwesome name="send" size={24} color={tw.color('red-600')} />
        </TouchableOpacity>
      </View>
    );
  }),
);
