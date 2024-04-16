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
import {BUNDLE_CONTENT} from '@queries';
import formatNumber from 'utils/formatNumber';
import config from 'react-native-ultimate-config';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect} from '@react-navigation/native';
import {InfoItem, SafeAreaContainer} from '@components';
import React, {memo, useCallback, useState} from 'react';
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

const CourseTestViewScreen = ({route, navigation}) => {
  const {width} = useWindowDimensions();

  const [visible, setVisible] = useState(false);

  const openModal = useCallback(() => {
    setVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  const {loading: queryLoading, data: queryData} = useQuery(BUNDLE_CONTENT, {
    variables: {bundleContentId: route?.params?.bundleContentId},
  });

  const [addView] = useMutation(ADD_VIEW, {
    variables: {refId: route?.params?.bundleContentId},
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

  // TODO: Add course test attempt support
  const [attemptExam, {loading: submitting}] = useMutation(ATTEMPT_EXAM, {
    variables: {contentId: route?.params?.bundleContentId},
    onCompleted: data => {
      closeModal();
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

  // TODO: Add course test exam result view support
  const handleResult = useCallback(
    ({contentId, testId}) => {
      navigation.navigate('ExamResultScreen', {contentId, testId});
    },
    [navigation],
  );

  const data = queryData?.bundleContent?.payload || {};

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
                source={{
                  uri: `${
                    __DEV__
                      ? config.REACT_APP_DEV_URI
                      : config.REACT_APP_PROD_URI
                  }/${data?.image}`,
                }}
                resizeMode="cover"
                style={tw.style('self-center', 'mt-4', {
                  borderRadius: 10,
                  width: width - 16,
                  aspectRatio: 1 / 1,
                })}
              />
              <View style={tw`px-4 py-2`}>
                <Text
                  style={tw`font-avSemi text-amber-700 text-[10px]`}
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
                    {
                      query: BUNDLE_CONTENT,
                      variables: {bundleContentId: data?._id},
                    },
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
                    {
                      query: BUNDLE_CONTENT,
                      variables: {bundleContentId: data?._id},
                    },
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
      <ExamInstructionModal
        data={data}
        visible={visible}
        submitting={submitting}
        onPress={attemptExam}
        onClose={closeModal}
      />
      <ExamStatusButton
        contentId={data?._id}
        testId={data?.media?._id}
        seeResult={handleResult}
        attemptExam={openModal}
      />
    </SafeAreaContainer>
  );
};

const ExamInstructionModal = memo(
  ({visible, data, submitting, onPress, onClose}) => {
    const [checked, setChecked] = useState(false);
    return (
      <CCModal
        title="Instructions"
        visible={visible}
        submitting={submitting}
        onClose={onClose}>
        <View style={tw`p-2 my-2 border border-gray-300 rounded-md`}>
          <Text style={tw`text-gray-500 font-popReg text-xs`}>
            {`Please read the instructions carefully

(A). General Instructions:

1. Total duration of examination: ${
              dayjs.duration(data?.media?.duration).hours() > 0
                ? dayjs.duration(data?.media?.duration).hours() + ' Hour'
                : ''
            } ${
              dayjs.duration(data?.media?.duration).minutes() > 0
                ? dayjs.duration(data?.media?.duration).minutes() + ' Minutes'
                : ''
            }
2. Number of questions: ${data?.media?.questions}
3. Total marks of examination: ${data?.media?.totalMarks}
3. All questions are of objective type. Two to Six options are given to each question out of which only one will be the correct answer.
4. There can be negative marking for wrong answers on particular question. How much mark will be deducted for wrong answer mention on the bottom of every question.
5. Click on Next (v) or Prev (^) buttons to go another questions.
6. In case of any variation in the content of the question between the English and any other language, the content in English language shall be treated as valid. Further queries with regard to this will not be entertained.
7. One question will be displayed on the screen at a time.
8. Time available for you to complete the examination will be displayed through a countdown timer in the top left-hand corner of the screen. It will display the remaining time as Time Left. At the beginning of exam, timer will show the duration which will reduce gradually with passage of time. When the timer reaches zero, the examination will end by itself and your examination will be submitted by the system automatically.

(B). Question Number Box:

1. Question Number Box displayed on the left side of the screen will show the status of each question using one of the following background colors:
  White - Question has not visited yet.
  Black - Question is currently selected.
  Green - Question successfully answered.
  Red - Question has been seen but not answered.
2. You can scroll to navigate to the bottom and to navigate to the top of the question, then press Question number box to select the question.
3. The summary of number of questions answered, not answered and not visited will be displayed above the question number box.
4. You can click on the ">" arrow which appears to the left of question number box to minimise the question number box. This will enable you to view the question on a bigger area of the screen. To view the question number box again, you can click on "<" arrow which appears on the right side of the screen.

(C). Answering a Question

1. The questions will appear on the screen in serial order from question number 1 to 100, which can be answered one by one as given below:
  [a]. To select your answer, click on the button of one of the options
  [b]. To deselect your chosen answer, click on the button of the chosen option again.
  [c]. To change your chosen answer, click on the button of option you want to choose.
2. To change your answer to a question that has already been answered, first click on that question number from the question number box and follow the procedure for answering as mentioned at 1 above.

(D). Instruction for enlarging images

To view the image provided in the question in a bigger size, click on the image and pinch the image with two fingers.

${
  data?.media?.instructions
    ? `(E). Other important instructions 

${data?.media?.instructions}`
    : ''
}`}
          </Text>
        </View>
        <CCCheckBox
          color="amber-600"
          label="Tick this, if you have read and understood the instructions."
          checked={checked}
          onPress={setChecked}
          style={tw`mb-3`}
        />
        <CCButton
          color="amber-600"
          label="I am ready to begin"
          loading={submitting}
          disabled={!checked || submitting}
          onPress={onPress}
        />
      </CCModal>
    );
  },
);

const ExamStatusButton = memo(({contentId, testId, seeResult, attemptExam}) => {
  const [fetchExamStatus, {loading: queryLoading, data: queryData}] =
    useLazyQuery(EXAM_ATTEMPTED, {fetchPolicy: 'no-cache'});

  useFocusEffect(
    useCallback(() => {
      if (contentId && testId) {
        fetchExamStatus({variables: {contentId, testId}});
      }
    }, [contentId, testId, fetchExamStatus]),
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
});

export default CourseTestViewScreen;
