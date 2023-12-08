import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {tw} from '@lib';
import Passage from './Passage';
import {quesIndexVar} from 'apollo/client';
import Zoom from 'react-native-zoom-reanimated';
import {gql, useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import React, {forwardRef, memo, useCallback, useMemo, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const QuestionList = memo(
  forwardRef(({examId, data}, flatListRef) => {
    const __renderItem = useCallback(
      ({item}) => <Item {...item} examId={examId} />,
      [examId],
    );
    const __keyExtractor = useCallback(item => item._id, []);

    return (
      <FlatList
        ref={flatListRef}
        //
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        //
        data={data}
        renderItem={__renderItem}
        keyExtractor={__keyExtractor}
      />
    );
  }),
);

export default QuestionList;

const ADD_ANSWER = gql`
  mutation addAnswer(
    $examId: ID!
    $questionId: ID!
    $answeredIndex: NonNegativeInt!
  ) {
    addAnswer(
      examId: $examId
      questionId: $questionId
      answeredIndex: $answeredIndex
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
  mutation removeAnswer($examId: ID!, $questionId: ID!) {
    removeAnswer(examId: $examId, questionId: $questionId) {
      code
      success
      message
      token
      payload
    }
  }
`;

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

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const answerIndex = quesIndexVar().get(questionId);
    return typeof answerIndex === 'number' ? answerIndex : answeredIndex;
  });

  const [addAnswer] = useMutation(ADD_ANSWER, {
    onCompleted: data => {
      quesIndexVar(quesIndexVar().set(questionId, data?.addAnswer?.payload));
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
      quesIndexVar(quesIndexVar().set(questionId, data?.removeAnswer?.payload));
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

  const imageViewer = useMemo(
    () =>
      image ? (
        <Zoom style={tw.style('mt-2 bg-gray-200')}>
          <Image
            resizeMode="contain"
            source={{uri: image}}
            style={{width: '100%', aspectRatio: 1}}
          />
        </Zoom>
      ) : null,
    [image],
  );

  const optionList = useMemo(() => {
    return options.map((value, index) => (
      <TouchableOpacity
        onPress={() => onSelect(index)}
        key={`${index}-OPTION`}
        style={tw`flex-row p-3 bg-${
          selectedIndex === index ? 'green-400' : 'yellow-50'
        } my-1 shadow-sm rounded-lg ios:border ios:border-gray-200`}>
        <Text style={tw`font-avReg text-black text-sm`}>{index + 1}.</Text>
        <Text numberOfLines={3} style={tw`font-avReg text-black text-sm pl-2`}>
          {value}
        </Text>
      </TouchableOpacity>
    ));
  }, [selectedIndex, options, onSelect]);

  const marks = useMemo(
    () => (
      <View style={tw`flex-row`}>
        <View
          style={tw`flex-row items-center px-2 py-1 rounded bg-green-100 ml-1`}>
          <MaterialCommunityIcons
            size={12}
            name="check-circle-outline"
            color={tw.color('gray-900')}
          />
          <Text style={tw`pl-1 font-avSemi text-[10px] text-gray-900`}>
            {mark} Marks
          </Text>
        </View>
        {negativeMark > 0 && (
          <View
            style={tw`flex-row items-center px-2 py-1 rounded bg-red-100 ml-1`}>
            <MaterialCommunityIcons
              size={12}
              name="close-circle-outline"
              color={tw.color('gray-900')}
            />
            <Text style={tw`pl-1 font-avSemi text-[10px] text-gray-900`}>
              - {negativeMark} Marks
            </Text>
          </View>
        )}
      </View>
    ),
    [mark, negativeMark],
  );

  return (
    <View style={tw.style('pt-2 pr-2', {width: (width * 85) / 100})}>
      <Passage content={passage} />
      <ScrollView
        contentContainerStyle={tw`py-2`}
        style={tw`flex-1 bg-white rounded-lg border border-gray-200`}>
        <Text style={tw`px-2 text-base font-avReg text-gray-600 leading-5`}>
          {question}
        </Text>
        {imageViewer}
      </ScrollView>
      <View style={tw`my-1`}>{optionList}</View>
      <View style={tw`mb-2`}>{marks}</View>
    </View>
  );
});
