import tw from '@lib/tailwind';
import config from 'react-native-ultimate-config';
import {useNavigation} from '@react-navigation/core';
import React, {memo, useCallback, useMemo} from 'react';
import {View, Image, Text, Pressable, ImageBackground} from 'react-native';

const VideoItem = memo(({width = 224, ...rest}) => {
  const navigation = useNavigation();

  const info = useMemo(() => {
    const infoArr = [];
    if (rest?.media?.time) {
      infoArr.push(`${rest?.media?.time} Mins`);
    }
    if (rest?.likes) {
      infoArr.push(`${rest?.likes} Likes`);
    }
    if (rest?.views) {
      infoArr.push(`${rest?.views} Watches`);
    }
    return infoArr.join(' | ');
  }, [rest]);

  const handleNavigation = useCallback(() => {
    navigation.navigate('VideoViewScreen', {
      contentId: rest?._id,
    });
  }, [navigation, rest?._id]);

  return (
    <Pressable onPress={handleNavigation}>
      <View
        style={tw`bg-gray-50 rounded-lg shadow-sm w-[${width}px] opacity-${
          rest?.visible ? 100 : 50
        }`}>
        <ImageBackground
          resizeMode="cover"
          source={{
            uri: `${
              __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
            }/${rest?.image}`,
          }}
          imageStyle={tw`rounded-lg opacity-50`}
          style={tw`rounded-lg items-center shadow-sm bg-white w-[${width}px]`}>
          <Image
            source={{
              uri: `${
                __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
              }/${rest?.image}`,
            }}
            resizeMode="cover"
            style={tw.style({
              width,
              borderRadius: 8,
              aspectRatio: 16 / 9,
            })}
          />
        </ImageBackground>
        <View style={tw`h-[130px] px-2 py-3 justify-between`}>
          <View style={tw`flex-row justify-between`}>
            <Text
              style={tw`flex-1 font-avSemi text-indigo-700 capitalize text-[10px]`}
              numberOfLines={1}>
              {rest?.subject}
            </Text>
            {!!rest?.offer && (
              <Text style={tw`font-avSemi text-red-500 text-[10px]`}>
                {`${rest?.offer}${
                  rest?.offerType === 'PERCENT' ? '%' : '₹'
                } Off`}
              </Text>
            )}
          </View>
          <Text
            style={tw`font-avSemi text-xs text-gray-600 capitalize`}
            numberOfLines={2}>
            {rest?.title}
          </Text>
          <Text
            style={tw`font-avReg text-gray-500 text-[10px]`}
            numberOfLines={1}>
            {info}
          </Text>
          {rest?.paid && !rest?.purchased ? (
            <View style={tw`flex-row items-center justify-between`}>
              <Text
                style={tw`font-avSemi rounded text-xs px-2 bg-indigo-50 text-indigo-600 shadow-sm`}>
                {rest?.offer
                  ? `₹ ${
                      rest?.price -
                      (rest?.offerType === 'PERCENT'
                        ? (rest?.price * rest?.offer) / 100
                        : rest?.offer)
                    }`
                  : `₹ ${rest?.price}`}
              </Text>
              {!!rest?.offer && (
                <Text
                  style={tw.style('px-1 font-avReg text-gray-500 text-[10px]', {
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                  })}>
                  {`₹ ${rest?.price}`}
                </Text>
              )}
            </View>
          ) : (
            <View style={tw`self-start`}>
              <Text
                style={tw`font-avSemi rounded px-2 py-1 bg-indigo-50 text-indigo-600 shadow-sm text-[10px]`}>
                {`Watch ${rest?.purchased ? '' : 'Free '}➔`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default VideoItem;
