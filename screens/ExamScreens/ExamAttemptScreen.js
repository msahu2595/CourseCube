import tw from '@lib/tailwind';
import {quesIndexVar} from 'apollo/client';
import {LoadingIndicator} from '@components';
import {gql, useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import React, {useRef, useEffect, useCallback} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, Text, Alert, StatusBar, TouchableOpacity} from 'react-native';

// Component
import Duration from './components/Duration';
import QuestionList from './components/QuestionList';
import BackgroundNotice from './components/BackgroundNotice';
import QuestionIndexList from './components/QuestionIndexList';

const SUBMIT_EXAM = gql`
  mutation submitExam($examId: ID!) {
    submitExam(examId: $examId) {
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
          testQuestion {
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

const ExamAttemptScreen = ({route, navigation}) => {
  const timer = useRef(null);
  const flatListRef = useRef();
  const unsubscribe = useRef(null);
  const insets = useSafeAreaInsets();
  const appStateListener = useRef(null);

  const [submitExam, {loading}] = useMutation(SUBMIT_EXAM, {
    variables: {examId: route?.params?._id || ''},
    onCompleted: async () => {
      console.log('Removing listener');
      if (unsubscribe.current) {
        await unsubscribe.current();
      }
      if (timer.current) {
        clearInterval(timer.current);
      }
      if (appStateListener.current) {
        await appStateListener.current?.remove();
      }
      quesIndexVar(new Map());
      navigation?.goBack();
    },
    onError: error => {
      showMessage({
        message: error?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  const handleSubmit = useCallback(() => {
    Alert.alert('Submit', 'Are you sure, you want to submit test ?', [
      {text: 'No', style: 'cancel', onPress: () => {}},
      {text: 'Yes', style: 'destructive', onPress: submitExam},
    ]);
  }, [submitExam]);

  useEffect(() => {
    unsubscribe.current = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      handleSubmit();
    });
  }, [navigation, handleSubmit]);

  const navigateQuestion = useCallback(index => {
    flatListRef.current?.scrollToIndex({animated: false, index});
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={tw.color('amber-200')}
      />
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color('amber-200'),
          tw.color('amber-50'),
          tw.color('white'),
        ]}
        style={tw`flex-1 pt-[${insets.top}px]`}>
        <View
          style={tw`flex-row items-center justify-between px-2 android:pt-2`}>
          <Duration
            ref={timer}
            onTimeUp={submitExam}
            duration={route?.params?.duration || 'PT0S'}
            textStyle={tw`tracking-widest font-avSemi text-xs text-white`}
            containerStyle={tw`w-18 items-center py-2 rounded bg-gray-900 shadow-sm`}
          />
          <Text
            numberOfLines={1}
            style={tw`flex-1 px-2 text-base font-avReg text-gray-600`}>
            {route?.params?.title}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={tw`items-center px-4 py-2 rounded bg-amber-600 shadow-sm`}>
            <Text style={tw`font-avSemi text-xs text-amber-100`}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`flex-1 flex-row`}>
          <QuestionIndexList
            onPress={navigateQuestion}
            data={route?.params?.questions || []}
          />
          <QuestionList
            ref={flatListRef}
            examId={route?.params?._id || ''}
            data={route?.params?.questions || []}
          />
        </View>
      </LinearGradient>
      <BackgroundNotice ref={appStateListener} exitExam={submitExam} />
      <LoadingIndicator loading={loading} color={tw.color('bg-amber-600')} />
    </>
  );
};

export default ExamAttemptScreen;
