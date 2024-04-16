import React from 'react';
import tw from '@lib/tailwind';
import {VIDEO} from '@queries';
import {useQuery} from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaContainer, YoutubeVideoPlayer} from '@components';
import {Text, View, ActivityIndicator, useWindowDimensions} from 'react-native';

const AdminVideoViewScreen = ({route}) => {
  const {width, height} = useWindowDimensions();

  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(VIDEO, {
    variables: {videoId: route.params?.videoId},
  });

  const data = queryData?.video?.payload || null;

  if (queryError) {
    return (
      <SafeAreaContainer style={tw`justify-center items-center`}>
        <Text style={tw`text-black align-center`}>
          Unexpected error happened, Please try again!
        </Text>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer style={tw`bg-black`}>
      {queryLoading ? (
        <View
          style={tw.style('bg-black justify-center', {
            width: width < height ? width : (height * 16) / 9,
            height: height < width ? height : (width * 9) / 16,
          })}>
          <ActivityIndicator size="large" color={tw.color('white')} />
        </View>
      ) : (
        <YoutubeVideoPlayer link={data?.link} />
      )}
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[tw.color('blue-200'), tw.color('blue-50'), tw.color('white')]}
        style={tw`flex-1`}>
        {queryLoading ? (
          <View style={tw`flex-1 justify-center`}>
            <ActivityIndicator size="large" color={tw.color('indigo-600')} />
          </View>
        ) : (
          <View style={tw`px-4 py-2`}>
            <Text
              style={tw`py-1 font-avSemi text-base text-gray-600`}
              numberOfLines={2}>
              {data?.title}
            </Text>
            <Text
              style={tw.style('font-avReg', 'text-gray-600', 'text-sm', {
                fontSize: 10,
              })}
              numberOfLines={1}>
              {`${data?.time} Mins`}
            </Text>
          </View>
        )}
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default AdminVideoViewScreen;
