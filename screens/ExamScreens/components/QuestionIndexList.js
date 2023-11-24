import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {tw} from '@lib';
import {quesIndexVar} from 'apollo/client';
import {useReactiveVar} from '@apollo/client';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {memo, useState, useCallback, useMemo} from 'react';

const QuestionIndexList = memo(({data, onPress}) => {
  const width = useWindowDimensions().width;
  const [activeIndex, setActiveIndex] = useState(0);
  const quesIndexStatus = useReactiveVar(quesIndexVar);

  const navigateToIndex = useCallback(
    (prevIndex, nextIndex) => {
      if (typeof quesIndexStatus.get(data[prevIndex]?._id) !== 'number') {
        quesIndexVar(quesIndexVar().set(data[prevIndex]?._id, -1));
      }
      onPress(nextIndex);
    },
    [quesIndexStatus, data, onPress],
  );

  const handlePress = useCallback(
    index => {
      if (index !== activeIndex) {
        navigateToIndex(activeIndex, index);
        setActiveIndex(index);
      }
    },
    [activeIndex, navigateToIndex],
  );

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      navigateToIndex(activeIndex, activeIndex - 1);
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex, navigateToIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex < data.length - 1) {
      navigateToIndex(activeIndex, activeIndex + 1);
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, data, navigateToIndex]);

  const indexList = useMemo(
    () =>
      data.map((q, index) => {
        const status = quesIndexStatus.get(q?._id);
        return (
          <TouchableOpacity
            onPress={() => handlePress(index)}
            key={'QUESTION' + q?._id}
            style={tw.style(
              'my-1',
              'shadow-lg',
              'items-center',
              'rounded-full',
              'justify-center',
              {
                width: 40,
                height: 40,
                'bg-white': activeIndex !== index,
                'bg-amber-100': activeIndex === index,
                'bg-green-200': status > -1,
                'bg-red-200': status < 0,
              },
            )}>
            <Text
              style={tw`text-base font-avSemi text-${
                activeIndex === index ? 'amber-600' : 'gray-600'
              }`}>
              {index + 1}
            </Text>
          </TouchableOpacity>
        );
      }),
    [activeIndex, quesIndexStatus, data, handlePress],
  );

  return (
    <View>
      <ScrollView
        contentContainerStyle={tw`items-center py-2`}
        showsVerticalScrollIndicator={false}
        style={tw.style('flex-1', {
          width: (width * 15) / 100,
        })}>
        {indexList}
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

export default QuestionIndexList;
