import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {
  CCIcon,
  CCModal,
  CCButton,
  CCCheckBox,
  CCLikeButton,
  CCBookmarkButton,
} from 'components/Common';
import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import {CONTENT} from '@queries';
import formatNumber from 'utils/formatNumber';
import React, {useCallback, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect} from '@react-navigation/native';
import {InfoItem, SafeAreaContainer} from '@components';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {gql, useLazyQuery, useMutation, useQuery} from '@apollo/client';

const EXAM_ATTEMPTED = gql`
  query examAttempted($contentId: ID!, $testId: ID!) {
    examAttempted(contentId: $contentId, testId: $testId) {
      code
      success
      message
      token
      payload
    }
  }
`;

const ADD_VIEW = gql`
  mutation addView($refId: ID!) {
    addView(refId: $refId) {
      code
      success
      message
      token
    }
  }
`;

const ATTEMPT_EXAM = gql`
  mutation attemptExam($contentId: ID!) {
    attemptExam(contentId: $contentId) {
      code
      success
      message
      token
      payload {
        _id
        title
        thumbnail
        instructions
        duration
        questions {
          _id
          question
          image
          passage
          options
          answeredIndex
          mark
          negativeMark
        }
        totalMarks
        gotMarks
        submitted
        createdAt
        updatedAt
      }
    }
  }
`;

const TestViewScreen = ({route, navigation}) => {
  const {width} = useWindowDimensions();

  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  const {loading: queryLoading, data: queryData} = useQuery(CONTENT, {
    variables: {contentId: route.params.contentId},
  });

  const [addView] = useMutation(ADD_VIEW, {
    variables: {refId: route.params.contentId},
    onCompleted: res => {
      console.log('addView', res);
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [attemptExam, {loading: submitting}] = useMutation(ATTEMPT_EXAM, {
    variables: {contentId: route.params.contentId},
    onCompleted: data => {
      addView();
      navigation.navigate('ExamAttemptScreen', data?.attemptExam?.payload);
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  const toggleModal = useCallback(() => {
    setVisible(prev => !prev);
  }, []);

  const handleResult = useCallback(
    ({contentId, testId}) => {
      navigation.navigate('ExamResultScreen', {contentId, testId});
    },
    [navigation],
  );

  const data = queryData?.content?.payload || {};

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('amber-200')}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color('amber-200'),
          tw.color('amber-50'),
          tw.color('white'),
        ]}
        style={tw`flex-1`}>
        <ScrollView style={tw`flex-1`}>
          {queryLoading ? (
            <View style={tw`flex-1 justify-center`}>
              <ActivityIndicator size="large" color={tw.color('amber-600')} />
            </View>
          ) : (
            <>
              <Image
                source={{uri: data?.image}}
                resizeMode="cover"
                style={tw.style('self-center', 'mt-4', {
                  borderRadius: 10,
                  width: width - 16,
                  aspectRatio: 1 / 1,
                })}
              />
              <View style={tw`px-4 py-2`}>
                <Text
                  style={tw`font-avSemi text-amber-700 capitalize text-[10px]`}
                  numberOfLines={1}>
                  {data?.subject}
                </Text>
                <Text
                  style={tw`py-1 font-avSemi text-base text-gray-600`}
                  numberOfLines={2}>
                  {data?.title}
                </Text>
                <Text
                  style={tw`font-avReg text-xs text-amber-600`}
                  numberOfLines={1}>
                  #CGPSE #ACS #SSC #Mains
                </Text>
                <Text
                  style={tw.style('font-avReg', 'text-gray-600', 'text-sm', {
                    fontSize: 10,
                  })}
                  numberOfLines={1}>
                  {`${data?.media?.questions} Ques. | ${
                    data?.media?.totalMarks
                  } Marks | ${
                    dayjs.duration(data?.media?.duration).hours() > 0
                      ? dayjs.duration(data?.media?.duration).hours() + ' Hour'
                      : ''
                  } ${
                    dayjs.duration(data?.media?.duration).minutes() > 0
                      ? dayjs.duration(data?.media?.duration).minutes() +
                        ' Minute'
                      : ''
                  } | ${data?.likes} Likes | ${formatNumber(
                    data?.views,
                    0,
                  )} Attempted`}
                </Text>
              </View>
              <View
                style={tw`flex-row justify-around border-t border-b border-amber-200 px-2`}>
                <CCLikeButton
                  refId={data?._id}
                  initial={data?.liked === 1 ? true : false}
                  refetchQueries={[
                    {query: CONTENT, variables: {contentId: data?._id}},
                  ]}>
                  {liked => (
                    <CCIcon
                      color="amber-600"
                      icon={liked ? 'like1' : 'like2'}
                      label={liked ? 'Liked' : 'Like'}
                    />
                  )}
                </CCLikeButton>
                <CCBookmarkButton
                  refId={data?._id}
                  type={data?.__typename}
                  subType={data?.media?.__typename}
                  initial={data?.bookmarked === 1 ? true : false}
                  refetchQueries={[
                    {query: CONTENT, variables: {contentId: data?._id}},
                  ]}>
                  {bookmarked => (
                    <CCIcon
                      color="amber-600"
                      icon={bookmarked ? 'bookmark' : 'bookmark-o'}
                      label={bookmarked ? 'Bookmarked' : 'Bookmark'}
                      IconComponent={FontAwesome}
                    />
                  )}
                </CCBookmarkButton>
                <TouchableOpacity>
                  <CCIcon color="amber-600" icon="download" label="Download" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <CCIcon
                    color="amber-600"
                    icon="questioncircleo"
                    label="Doubts"
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <CCIcon color="amber-600" icon="sharealt" label="Share" />
                </TouchableOpacity>
              </View>
              <View>
                <InfoItem label="Highlight" value={data?.highlight} />
                <InfoItem
                  inline
                  label="Language"
                  value={data?.language === 'HI' ? 'हिन्दी' : 'English'}
                />
                <InfoItem
                  label="Instructors"
                  value={data?.instructors?.join(', ')}
                />
                <InfoItem label="Index" value={data?.index} />
                <InfoItem label="Description" value={data?.description} />
              </View>
            </>
          )}
        </ScrollView>
      </LinearGradient>
      <CCModal
        title="Instructions"
        visible={visible}
        submitting={submitting}
        onClose={toggleModal}>
        <View style={tw`p-2 my-2 border border-gray-600 rounded-md`}>
          <Text style={tw`text-gray-900 font-avReg leading-7`}>
            {`* Total number of questions is ${
              data?.media?.questions
            }.\n* Total marks is ${
              data?.media?.totalMarks
            }.\n* Total duration of exam is ${
              dayjs.duration(data?.media?.duration).hours() > 0
                ? dayjs.duration(data?.media?.duration).hours() + ' Hour'
                : ''
            } ${
              dayjs.duration(data?.media?.duration).minutes() > 0
                ? dayjs.duration(data?.media?.duration).minutes() + ' Minute'
                : ''
            }.\n${data?.media?.instructions}`}
          </Text>
        </View>
        <CCCheckBox
          label="Tick this, if you agree."
          checked={checked}
          onPress={setChecked}
          style={tw`mb-3`}
        />
        <CCButton
          label="Attempt"
          loading={submitting}
          disabled={!checked || submitting}
          onPress={attemptExam}
        />
      </CCModal>
      <ExamStatusButton
        contentId={data?._id}
        testId={data?.media?._id}
        seeResult={handleResult}
        attemptExam={toggleModal}
      />
    </SafeAreaContainer>
  );
};

const ExamStatusButton = ({contentId, testId, seeResult, attemptExam}) => {
  const [fetchExamStatus, {loading: queryLoading, data: queryData}] =
    useLazyQuery(EXAM_ATTEMPTED, {
      variables: {contentId, testId},
      fetchPolicy: 'no-cache',
    });

  useFocusEffect(
    useCallback(() => {
      fetchExamStatus();
    }, [fetchExamStatus]),
  );

  const handleResult = useCallback(() => {
    seeResult({contentId, testId});
  }, [contentId, testId, seeResult]);

  const data = queryData?.examAttempted?.payload;

  return (
    <>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[
          tw.color('amber-200'),
          tw.color('white'),
          tw.color('amber-50'),
        ]}
        style={tw`absolute bottom-0 right-0 m-4 rounded-lg shadow-sm`}>
        <TouchableOpacity
          disabled={queryLoading}
          onPress={data ? handleResult : attemptExam}
          style={tw`py-4 w-[176px] flex-row items-center justify-around`}>
          {queryLoading ? (
            <ActivityIndicator color={tw.color('amber-600')} size="small" />
          ) : (
            <>
              <Text style={tw`px-4 font-avSemi text-sm text-amber-600`}>
                {data ? 'See Result' : 'Attempt Now'}
              </Text>
              <AntDesign
                name="arrowright"
                size={20}
                color={tw.color('amber-600')}
                style={tw`pr-4`}
              />
            </>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
};

export default TestViewScreen;
