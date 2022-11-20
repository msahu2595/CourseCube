import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import tw from '@lib/tailwind';
import {CONTENT} from '@queries';
import {useQuery} from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {memo, useCallback, useRef, useState} from 'react';

const TestViewScreen = ({route}) => {
  const flatListRef = useRef();
  const width = useWindowDimensions().width;
  const [activeIndex, setActiveIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  const {loading: queryLoading} = useQuery(CONTENT, {
    variables: {contentId: route.params.contentId},
    onCompleted: data => {
      setQuestions(data?.content?.payload?.media?.questions);
    },
  });

  const navigateQuestion = useCallback(index => {
    flatListRef.current?.scrollToIndex({index});
    setActiveIndex(index);
  }, []);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({index: activeIndex - 1});
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex < questions.length - 1) {
      flatListRef.current?.scrollToIndex({index: activeIndex + 1});
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, questions]);

  const handleSelect = useCallback(
    (qId, index) => {
      console.log(qId, index);
      setQuestions(
        questions.map(q => {
          if (q._id === qId) {
            return {...q, selectedIndex: index};
          } else {
            return q;
          }
        }),
      );
    },
    [questions],
  );

  const handleSubmit = useCallback(() => {
    Alert.alert('Submit', 'Are you sure, you want to submit test ?', [
      {text: 'No', style: 'cancel'},
      {text: 'Yes', style: 'destructive'},
    ]);
  }, []);

  const renderItem = useCallback(
    ({item}) => <Item {...item} onSelect={handleSelect} />,
    [handleSelect],
  );

  console.log({questions});

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar
        backgroundColor={tw.color('amber-200')}
        barStyle="dark-content"
      />
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color('amber-200'),
          tw.color('amber-50'),
          tw.color('white'),
        ]}
        style={tw`flex-1`}>
        <View style={tw`flex-1 flex-row`}>
          <ScrollView
            contentContainerStyle={tw`items-center py-2`}
            showsVerticalScrollIndicator={false}
            style={tw.style('flex-none', {
              width: (width * 15) / 100,
            })}>
            {questions.map((_, index) => {
              return (
                <TouchableOpacity
                  onPress={() => navigateQuestion(index)}
                  key={'QUESTION' + index}
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
              );
            })}
          </ScrollView>
          <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            data={questions}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={tw`border`}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={tw`flex-row items-center justify-between p-2 pt-1 pb-3`}>
          <Text
            style={tw`tracking-widest font-avSemi rounded text-xs px-4 py-2 bg-black text-white shadow-sm`}>
            01:33
          </Text>
          <TouchableOpacity onPress={handlePrev}>
            <Text
              style={tw`font-avSemi rounded text-xs px-4 py-2 bg-amber-100 text-amber-600 shadow-sm`}>
              {'< Prev'}
            </Text>
          </TouchableOpacity>
          <Text style={tw`text-base font-avReg text-gray-600`}>
            {`${activeIndex + 1} / ${questions.length}`}
          </Text>
          <TouchableOpacity onPress={handleNext}>
            <Text
              style={tw`font-avSemi rounded text-xs px-4 py-2 bg-amber-100 text-amber-600 shadow-sm`}>
              {'Next >'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit}>
            <Text
              style={tw`font-avSemi rounded text-xs px-4 py-2 bg-amber-600 text-amber-100 shadow-sm`}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const Item = memo(props => {
  const width = useWindowDimensions().width;
  const [passageVisible, setPassageVisible] = useState(false);
  const togglePassageVisibility = useCallback(() => {
    setPassageVisible(!passageVisible);
  }, [passageVisible]);
  return (
    <View style={tw.style('pr-2', {width: (width * 85) / 100})}>
      {!!props?.passage && (
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
                {props?.passage}
              </Text>
            </ScrollView>
          )}
        </View>
      )}
      <ScrollView
        contentContainerStyle={tw`p-3`}
        style={tw`flex-1 bg-white mt-2 shadow-sm rounded-lg`}>
        <Text style={tw`text-base font-avReg text-gray-600 leading-5`}>
          {props?.question}
        </Text>
        {!!props?.image && (
          <Image
            source={{uri: props?.image}}
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
        {props?.options.map((value, index) => {
          return (
            <TouchableOpacity
              onPress={() => props?.onSelect(props?._id, index)}
              key={`${index}-OPTION`}
              style={tw`flex-row p-4 bg-${
                props?.selectedIndex === index ? 'green-400' : 'yellow-50'
              } my-1 shadow-sm rounded-lg`}>
              <Text style={tw`font-avReg text-sm`}>{index + 1}.</Text>
              <Text style={tw`font-avReg text-sm pl-2`}>{value}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

export default TestViewScreen;
