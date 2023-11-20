import React, {
  memo,
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  AppState,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import {LoadingIndicator} from '@components';
import {gql, useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ADD_ANSWER = gql`
  mutation addAnswer(
    $questionId: ID!
    $answeredIndex: NonNegativeInt!
    $examId: ID!
  ) {
    addAnswer(
      questionId: $questionId
      answeredIndex: $answeredIndex
      examId: $examId
    ) {
      code
      success
      message
      token
      payload
    }
  }
`;

const REMOVE_ANSWER = gql`
  mutation removeAnswer($questionId: ID!, $examId: ID!) {
    removeAnswer(questionId: $questionId, examId: $examId) {
      code
      success
      message
      token
      payload
    }
  }
`;

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
  const appStateListener = useRef(null);

  const insets = useSafeAreaInsets();

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
    flatListRef.current?.scrollToIndex({index});
  }, []);

  const renderItem = useCallback(
    ({item}) => <Item {...item} examId={route?.params?._id || ''} />,
    [route?.params?._id],
  );

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
            style={tw`flex-1 px-2 capitalize text-base font-avReg text-gray-600`}>
            {route?.params?.title}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={tw`items-center px-4 py-2 rounded bg-amber-600 shadow-sm`}>
            <Text style={tw`font-avSemi text-xs text-amber-100`}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`flex-1 flex-row`}>
          <IndexList
            data={route?.params?.questions || []}
            onPress={navigateQuestion}
          />
          <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            data={route?.params?.questions || []}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={tw``}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </LinearGradient>
      <BackgroundNotice ref={appStateListener} exitExam={submitExam} />
      <LoadingIndicator loading={loading} color={tw.color('bg-amber-600')} />
    </>
  );
};

const BackgroundNotice = memo(
  forwardRef((props, appStateListener) => {
    const backgroundTimes = useRef(0);
    const activeTimestamp = useRef(null);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
      appStateListener.current = AppState.addEventListener(
        'change',
        nextAppState => {
          console.log('===========appStateListener=============');
          switch (nextAppState) {
            case 'background':
              console.log('App is in BACKGROUND state.');
              if (!activeTimestamp.current && appState.current === 'active') {
                appState.current = 'background';
                activeTimestamp.current = dayjs();
              }
              break;
            case 'active':
              console.log('App is in ACTIVE state.');
              if (
                activeTimestamp.current &&
                appState.current === 'background'
              ) {
                appState.current = 'active';
                backgroundTimes.current += 1;
                const timeDifference = dayjs().diff(
                  activeTimestamp.current,
                  'second',
                );
                console.log('timeDifference ==> ', timeDifference);
                activeTimestamp.current = null;
                if (timeDifference > 30) {
                  Alert.alert(
                    'Disqualify',
                    'As per our exam rule, We are disqualify yor from this exam as you are in background for more than 30 second. Please take care on your next exam.',
                    [{text: 'Ok', onPress: props?.exitExam}],
                  );
                } else {
                  if (backgroundTimes.current < 3) {
                    Alert.alert(
                      'Warning',
                      `This is ${
                        backgroundTimes.current < 2 ? '1st' : 'last'
                      } warning, if you minimize the app while exam is in progress we can disqualify yor from this exam.`,
                    );
                  } else {
                    Alert.alert(
                      'Disqualify',
                      'As per our exam rule, We are disqualify yor from this exam as you had minimized app more than 2 times while exam is in progress.',
                      [{text: 'Ok', onPress: props?.exitExam}],
                    );
                  }
                }
              }
              break;
            default:
              break;
          }
          console.log('===========appStateListener=============');
        },
      );
      return () => {
        appStateListener.current?.remove();
      };
    }, [appStateListener, props?.exitExam]);

    return null;
  }),
);

const IndexList = memo(({data, onPress}) => {
  const width = useWindowDimensions().width;
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePress = useCallback(
    index => {
      if (index !== activeIndex) {
        onPress(index);
        setActiveIndex(index);
      }
    },
    [activeIndex, onPress],
  );

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      onPress(activeIndex - 1);
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex, onPress]);

  const handleNext = useCallback(() => {
    if (activeIndex < data.length - 1) {
      onPress(activeIndex + 1);
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, data, onPress]);

  return (
    <View>
      <ScrollView
        contentContainerStyle={tw`items-center py-2`}
        showsVerticalScrollIndicator={false}
        style={tw.style('flex-1', {
          width: (width * 15) / 100,
        })}>
        {data.map((q, index) => (
          <TouchableOpacity
            onPress={() => handlePress(index)}
            key={'QUESTION' + q?._id}
            style={tw.style(
              'rounded-full',
              `bg-${activeIndex === index ? 'amber-100' : 'white'}`,
              'my-1',
              'justify-center',
              'items-center',
              'shadow-lg',
              {
                width: 40,
                height: 40,
              },
            )}>
            <Text
              style={tw`text-base font-avSemi text-${
                activeIndex === index ? 'amber-600' : 'gray-600'
              }`}>
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={tw`mr-1 pb-4 items-center rounded-tr-lg`}>
        <TouchableOpacity onPress={handlePrev} style={tw`py-1`}>
          <AntDesign size={36} name="upcircle" color={tw.color('amber-600')} />
        </TouchableOpacity>
        {Array.isArray(data) && data?.length ? (
          <Text style={tw`text-sm font-avReg text-gray-600`}>
            {activeIndex + 1}/{data?.length}
          </Text>
        ) : null}
        <TouchableOpacity onPress={handleNext} style={tw`py-1`}>
          <AntDesign
            size={36}
            name="downcircle"
            color={tw.color('amber-600')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const Duration = memo(
  forwardRef(({duration, onTimeUp, containerStyle, textStyle}, timer) => {
    const [time, setTime] = useState(dayjs.duration(duration).asMilliseconds());

    useEffect(() => {
      if (time <= 0) {
        onTimeUp();
      }
    }, [time, onTimeUp]);

    useEffect(() => {
      timer.current = setInterval(() => {
        setTime(prev => {
          if (prev - 1000 > 0) {
            return prev - 1000;
          } else {
            clearInterval(timer.current);
            return 0;
          }
        });
      }, 1000);
      return () => {
        clearInterval(timer.current);
      };
    }, [timer]);

    return (
      <View style={containerStyle}>
        <Text style={textStyle}>
          {new Date(time).toISOString().slice(11, 19)}
        </Text>
      </View>
    );
  }),
);

const Item = memo(props => {
  const width = useWindowDimensions().width;

  const {
    examId,
    _id: questionId,
    question,
    image,
    passage,
    options,
    answeredIndex,
    mark,
    negativeMark,
  } = props;

  const [selectedIndex, setSelectedIndex] = useState(answeredIndex);
  const [passageVisible, setPassageVisible] = useState(false);

  const togglePassageVisibility = useCallback(() => {
    setPassageVisible(!passageVisible);
  }, [passageVisible]);

  const [addAnswer] = useMutation(ADD_ANSWER, {
    onCompleted: data => {
      setSelectedIndex(data?.addAnswer?.payload);
    },
    onError: error => {
      showMessage({
        message: error?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  const [removeAnswer] = useMutation(REMOVE_ANSWER, {
    onCompleted: data => {
      setSelectedIndex(data?.removeAnswer?.payload);
    },
    onError: error => {
      showMessage({
        message: error?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  const onSelect = useCallback(
    index => {
      console.log({selectedIndex, index});
      if (selectedIndex === index) {
        removeAnswer({
          variables: {examId, questionId},
        });
      } else {
        addAnswer({
          variables: {examId, questionId, answeredIndex: index},
        });
      }
    },
    [selectedIndex, examId, questionId, addAnswer, removeAnswer],
  );

  return (
    <View style={tw.style('pr-2', {width: (width * 85) / 100})}>
      {!!passage && (
        <View style={tw`mt-2 bg-white shadow-sm rounded-lg`}>
          <TouchableOpacity
            onPress={togglePassageVisibility}
            style={tw`flex-row justify-between px-4 py-2 `}>
            <Text style={tw`text-base font-avSemi text-gray-600`}>Passage</Text>
            <Text style={tw`text-base font-avSemi text-gray-600`}>{'>'}</Text>
          </TouchableOpacity>
          {passageVisible && (
            <ScrollView
              contentContainerStyle={tw`p-3`}
              style={tw`max-h-48 border-t border-yellow-100`}>
              <Text style={tw`text-sm font-avReg text-gray-600 leading-5`}>
                {passage}
              </Text>
            </ScrollView>
          )}
        </View>
      )}
      <ScrollView
        contentContainerStyle={tw`p-3`}
        style={tw`flex-1 bg-white mt-2 rounded-lg border border-gray-200`}>
        <Text style={tw`text-base font-avReg text-gray-600 leading-5`}>
          {question}
        </Text>
        {!!image && (
          <Image
            source={{uri: image}}
            resizeMode="contain"
            style={tw.style({
              marginTop: 8,
              width: '100%',
              aspectRatio: 1,
            })}
          />
        )}
      </ScrollView>
      <View style={tw`my-1`}>
        {options.map((value, index) => {
          return (
            <TouchableOpacity
              onPress={() => onSelect(index)}
              key={`${index}-OPTION`}
              style={tw`flex-row p-4 bg-${
                selectedIndex === index ? 'green-400' : 'yellow-50'
              } my-1 shadow-sm rounded-lg ios:border ios:border-gray-200`}>
              <Text style={tw`font-avReg text-black text-sm`}>
                {index + 1}.
              </Text>
              <Text style={tw`font-avReg text-black text-sm pl-2`}>
                {value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={tw`flex-row justify-between mb-2`}>
        <View
          style={tw`items-center px-4 py-2 rounded bg-amber-200 shadow-sm border border-gray-400`}>
          <Text style={tw`font-avSemi text-xs text-gray-900`}>
            Mark: {mark}
          </Text>
        </View>
        {negativeMark ? (
          <View
            style={tw`items-center px-4 py-2 rounded bg-amber-200 shadow-sm border border-gray-400`}>
            <Text style={tw`font-avSemi text-xs text-gray-900`}>
              Negative Mark: -{negativeMark}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});

export default ExamAttemptScreen;
