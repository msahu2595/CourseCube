import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import {useMutation} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BOOKMARK, LIKE, UNBOOKMARK, UNLIKE} from '@mutations';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuOptionItem from './MenuOptionItem';
// import {CORE_QUESTION_FIELDS} from '@fragments';
// import {QUESTIONS} from '@queries';

const alphabets = 'ABCDEFGH';

const CommunityPostItem = props => {
  const navigation = useNavigation();
  const [choice, setChoice] = useState(null);

  const [like, {loading: likeLoading}] = useMutation(LIKE, {
    variables: {refId: props?._id},
    onCompleted: data => {
      console.log('like ==> ', data);
    },
    onError: error => {
      console.log('like ==> ', error);
    },
    // update: (cache, {data}) => {
    //   const questionId = data?.like?.payload?.refId;
    //   const existingResponse = cache.readQuery({
    //     query: QUESTIONS,
    //   });
    //   const questionIndex = existingResponse?.questions?.payload?.findIndex(
    //     q => q?._id === questionId,
    //   );
    //   const questionData = existingResponse?.questions?.payload?.find(
    //     q => q?._id === questionId,
    //   );
    //   console.log({questionData});
    //   const newQuestions = [...existingResponse?.questions?.payload]?.splice(
    //     questionIndex,
    //     0,
    //     {...questionData, liked: 1, likes: questionData?.likes + 1},
    //   );
    //   cache.writeQuery({
    //     query: QUESTIONS,
    //     data: {
    //       questions: {...existingResponse?.questions, payload: newQuestions},
    //     },
    //   });
    // },
  });

  const [unlike, {loading: unlikeLoading}] = useMutation(UNLIKE, {
    variables: {refId: props?._id},
    onCompleted: data => {
      console.log('unlike ==> ', data);
    },
    onError: error => {
      console.log('unlike ==> ', error);
    },
    // update: (cache, {data}) => {
    //   const questionId = data?.unlike?.payload?.refId;
    //   const existingResponse = cache.readQuery({
    //     query: QUESTIONS,
    //   });
    //   const questionIndex = existingResponse?.questions?.payload?.findIndex(
    //     q => q?._id === questionId,
    //   );
    //   const questionData = existingResponse?.questions?.payload?.find(
    //     q => q?._id === questionId,
    //   );
    //   console.log({questionData});
    //   const newQuestions = [...existingResponse?.questions?.payload]?.splice(
    //     questionIndex,
    //     0,
    //     {...questionData, liked: 0, likes: questionData?.likes - 1},
    //   );
    //   cache.writeQuery({
    //     query: QUESTIONS,
    //     data: {
    //       questions: {...existingResponse?.questions, payload: newQuestions},
    //     },
    //   });
    // },
  });

  const [bookmark, {loading: bookmarkLoading}] = useMutation(BOOKMARK, {
    variables: {refId: props?._id, type: 'QUESTION'},
    onCompleted: data => {
      console.log('bookmark ==> ', data);
    },
    onError: error => {
      console.log('bookmark ==> ', error);
    },
  });

  const [unbookmark, {loading: unbookmarkLoading}] = useMutation(UNBOOKMARK, {
    variables: {refId: props?._id, type: 'QUESTION'},
    onCompleted: data => {
      console.log('unbookmark ==> ', data);
    },
    onError: error => {
      console.log('unbookmark ==> ', error);
    },
  });

  const navigateUserProfile = useCallback(() => {
    navigation.navigate('UserProfileScreen', {
      userId: props?.user?._id,
    });
  }, [navigation, props?.user?._id]);

  const navigatePostScreen = useCallback(() => {
    navigation.navigate('PostViewScreen', {
      question: props,
    });
  }, [navigation, props]);

  console.log(props?.user);

  return (
    <View style={tw`bg-white`}>
      <View style={tw`flex-row items-center py-2`}>
        <Image
          source={{uri: props?.user?.picture}}
          resizeMode="contain"
          style={tw.style('rounded-full', 'mx-4', {
            width: 40,
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
        <TouchableOpacity
          disabled={bookmarkLoading || unbookmarkLoading}
          onPress={props?.bookmarked ? unbookmark : bookmark}>
          <MaterialCommunityIcons
            name={props?.bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={tw.color(props?.bookmarked ? 'red-600' : 'gray-600')}
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
          style={tw`px-4 mb-2 font-avSemi text-base text-gray-600`}
          numberOfLines={6}>
          {props?.title}
        </Text>
        <Text
          style={tw`px-4 mb-2 font-avReg text-sm text-gray-600`}
          numberOfLines={6}>
          {props?.description}
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
        {props?.options?.length && (
          <View>
            {props?.options.map((option, optionIndex) => (
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
                        ? optionIndex === props?.answerIndex
                        : false,
                  },
                )}>
                <Text
                  style={tw`font-avSemi text-sm ${
                    (typeof choice === 'number' &&
                      optionIndex === props?.answerIndex) ||
                    (typeof choice === 'number' && choice === optionIndex)
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}>
                  {alphabets.charAt(optionIndex)}
                </Text>
                <Text
                  style={tw`font-avReg text-sm pl-3 ${
                    (typeof choice === 'number' &&
                      optionIndex === props?.answerIndex) ||
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
          onPress={props?.liked ? unlike : like}
          style={tw`py-3 flex-1 flex-row items-center justify-center`}>
          <AntDesign
            name={props?.liked ? 'like1' : 'like2'}
            size={18}
            color={tw.color(props?.liked ? 'red-600' : 'gray-600')}
          />
          <Text style={tw`font-avSemi text-xs text-gray-600 pl-2`}>
            {props?.likes} Upvotes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigatePostScreen}
          style={tw`py-3 flex-1 flex-row items-center justify-center`}>
          <AntDesign name="message1" size={18} color={tw.color('gray-600')} />
          <Text style={tw`font-avSemi text-xs text-gray-600 pl-2`}>
            {props?.answers} Answers
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
};

export default CommunityPostItem;
