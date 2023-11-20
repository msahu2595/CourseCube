import {tw} from '@lib';
import dayjs from 'dayjs';
import {gql, useQuery} from '@apollo/client';
import React, {memo, useCallback} from 'react';
import {LoadingIndicator, SafeAreaContainer} from '@components';
import {Text, View, FlatList, useWindowDimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const RESULT = gql`
  query result($contentId: ID!, $testId: ID!) {
    result(contentId: $contentId, testId: $testId) {
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

const ExamResultScreen = ({route}) => {
  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(RESULT, {
    variables: {
      contentId: route.params.contentId,
      testId: route.params.testId,
    },
  });

  const data = queryData?.result?.payload || {};

  const renderItem = useCallback(
    ({item, index}) => <Item index={index} {...item} />,
    [],
  );

  if (queryLoading) {
    return <LoadingIndicator loading={true} color={tw.color('bg-amber-600')} />;
  }

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('amber-200')}
      statusBarStyle="dark-content">
      {queryError ? (
        <View>
          <Text style={tw`p-4 text-center text-gray-600 text-sm font-popReg`}>
            {`Error:\n${
              queryError?.message || 'Something Went Wrong'
            } Please try again after sometime.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data?.questions || []}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          style={tw`bg-amber-200`}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => (
            <HeaderComponent
              totalMarks={data?.totalMarks}
              questions={data?.questions}
              gotMarks={data?.gotMarks}
              duration={data?.duration}
            />
          )}
        />
      )}
    </SafeAreaContainer>
  );
};

const HeaderComponent = ({questions, totalMarks, gotMarks, duration}) => {
  const {width} = useWindowDimensions();

  const quesAttempted = questions?.filter(q => q?.answeredIndex >= 0);

  const quesNotAttempted = questions?.filter(q => q?.answeredIndex < 0);

  return (
    <>
      <View style={tw`pb-4 m-4`}>
        <View style={tw`items-center pb-4`}>
          <MaterialCommunityIcons
            size={128}
            color={tw.color('gray-900')}
            name="checkbox-marked-circle-outline"
          />
          <Text style={tw`text-[26px] text-gray-900 font-avBold py-4`}>
            Successfully completed.
          </Text>
        </View>
        <View style={tw`flex-row justify-around`}>
          <View style={tw`flex-1 items-center py-2`}>
            <Text style={tw`text-[32px] text-gray-900 font-avBold`}>
              {totalMarks}
            </Text>
            <Text style={tw`text-sm text-gray-900 font-avReg mt-1`}>
              Total Marks
            </Text>
          </View>
          <View style={tw`flex-1 items-center py-2`}>
            <Text style={tw`text-[32px] text-gray-900 font-avBold`}>
              {gotMarks}
            </Text>
            <Text style={tw`text-sm text-gray-900 font-avReg mt-1`}>
              Got Marks
            </Text>
          </View>
          <View style={tw`flex-1 items-center py-2`}>
            <Text style={tw`text-[32px] text-gray-900 font-avBold`}>
              {dayjs.duration(duration).hours() > 0 && (
                <>
                  <Text>{dayjs.duration(duration).hours()}</Text>
                  <Text style={tw`text-[16px]`}>H</Text>
                </>
              )}
              {dayjs.duration(duration).minutes() > 0 && (
                <>
                  <Text>{dayjs.duration(duration).minutes()}</Text>
                  <Text style={tw`text-[16px]`}>M</Text>
                </>
              )}
            </Text>
            <Text style={tw`text-sm text-gray-900 font-avReg mt-1`}>
              Duration
            </Text>
          </View>
        </View>
        <View style={tw`flex-row justify-around`}>
          <View style={tw`flex-1 items-center py-2`}>
            <Text style={tw`text-[32px] text-gray-900 font-avBold`}>
              {questions?.length}
            </Text>
            <Text style={tw`text-sm text-gray-900 font-avReg mt-1`}>
              Questions
            </Text>
          </View>
          <View style={tw`flex-1 items-center py-2`}>
            <Text style={tw`text-[32px] text-gray-900 font-avBold`}>
              {quesAttempted?.length}
            </Text>
            <Text style={tw`text-sm text-gray-900 font-avReg mt-1`}>
              Attempted
            </Text>
          </View>
          <View style={tw`flex-1 items-center py-2`}>
            <Text style={tw`text-[32px] text-gray-900 font-avBold`}>
              {quesNotAttempted?.length}
            </Text>
            <Text style={tw`text-sm text-gray-900 font-avReg mt-1`}>
              Not Attempted
            </Text>
          </View>
        </View>
      </View>
      <View style={tw`flex-1 items-center`}>
        <View
          style={tw`absolute w-[${width * 3}px] h-[${
            width * 3
          }px] rounded-full bg-gray-100`}
        />
        <View style={tw`flex-1 w-[${width}px] py-6 items-center`}>
          <Text style={tw`text-[28px] text-gray-900 font-avBold`}>
            Questions:
          </Text>
        </View>
      </View>
    </>
  );
};

const Item = memo(props => {
  return (
    <View key={props?._id} style={tw`bg-white p-2 mx-2 mb-4 rounded-lg`}>
      <View style={tw`px-4 py-4 bg-white rounded-lg border border-gray-200`}>
        <Text style={tw`text-base font-avReg text-gray-900 leading-5`}>
          {`Q.${props?.index + 1}. ${props?.question}`}
        </Text>
      </View>
      <View style={tw`my-1`}>
        {props?.options?.map((option, index) => {
          return (
            <View
              key={`${index}-OPTION`}
              style={tw`flex-row justify-between p-4 bg-${
                props?.testQuestion?.answerIndex === index
                  ? 'green-400'
                  : props?.answeredIndex === index
                  ? 'red-400'
                  : 'yellow-50'
              } my-1 shadow-sm rounded-lg ios:border ios:border-gray-200`}>
              <View style={tw`flex-1 mr-2 flex-row`}>
                <Text style={tw`font-avReg text-black text-sm`}>
                  {index + 1}.
                </Text>
                <Text style={tw`font-avReg text-black text-sm pl-2`}>
                  {option}
                </Text>
              </View>
              {props?.answeredIndex > -1 && (
                <View style={tw`justify-center`}>
                  {props?.testQuestion?.answerIndex === index ? (
                    <MaterialCommunityIcons
                      size={20}
                      name="check"
                      color={tw.color('gray-900')}
                    />
                  ) : props?.answeredIndex === index ? (
                    <MaterialCommunityIcons
                      size={20}
                      name="close"
                      color={tw.color('gray-900')}
                    />
                  ) : null}
                </View>
              )}
            </View>
          );
        })}
      </View>
      <View style={tw`flex-row`}>
        <View
          style={tw`mr-2 items-center px-4 py-2 rounded bg-gray-50 shadow-sm border border-gray-400`}>
          <Text style={tw`font-avSemi text-xs text-gray-900`}>
            {props?.answeredIndex < 0
              ? 'Not attempted'
              : props?.testQuestion?.answerIndex === props?.answeredIndex
              ? 'Right answer'
              : 'Wrong answer'}
          </Text>
        </View>
        {props?.answeredIndex > -1 &&
          (props?.testQuestion?.answerIndex === props?.answeredIndex ? (
            <View
              style={tw`mr-2 items-center px-4 py-2 rounded bg-gray-50 shadow-sm border border-gray-400`}>
              <Text style={tw`font-avSemi text-xs text-gray-900`}>
                Got Marks: {props.mark}
              </Text>
            </View>
          ) : (
            props.negativeMark > 0 && (
              <View
                style={tw`mr-2 items-center px-4 py-2 rounded bg-gray-50 shadow-sm border border-gray-400`}>
                <Text style={tw`font-avSemi text-xs text-gray-900`}>
                  Negative Marks: - {props.negativeMark}
                </Text>
              </View>
            )
          ))}
      </View>
    </View>
  );
});

export default ExamResultScreen;
