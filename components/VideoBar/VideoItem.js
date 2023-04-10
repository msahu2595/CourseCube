import tw from '@lib/tailwind';
import React, {memo, useCallback} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, Image, Text, Pressable, ImageBackground} from 'react-native';

const VideoItem = memo(props => {
  const navigation = useNavigation();

  const handleNavigation = useCallback(() => {
    navigation.navigate('VideoViewScreen', {
      contentId: props._id,
    });
  }, [navigation, props._id]);

  return (
    <Pressable onPress={handleNavigation}>
      <View
        style={tw.style('bg-gray-50', 'rounded-lg', 'shadow-sm', {
          width: 224,
          height: 256,
        })}>
        <ImageBackground
          source={{uri: props?.image}}
          resizeMode="cover"
          imageStyle={tw.style('rounded-lg', {
            opacity: 0.5,
          })}
          style={tw.style(
            'rounded-lg',
            'items-center',
            'shadow-sm',
            'bg-black',
            {
              height: 126,
            },
          )}>
          <Image
            source={{uri: props?.image}}
            resizeMode="cover"
            style={tw.style({
              borderRadius: 8,
              height: 126,
              aspectRatio: 16 / 9,
            })}
          />
        </ImageBackground>
        <View style={tw`flex-1 px-2 py-3 justify-between`}>
          <Text
            style={tw.style('font-avSemi', 'text-indigo-700', 'capitalize', {
              fontSize: 10,
            })}
            numberOfLines={1}>
            {props?.subject}
          </Text>
          <Text
            style={tw`font-avSemi text-xs text-gray-600 capitalize`}
            numberOfLines={2}>
            {props?.title}
          </Text>
          <Text
            style={tw.style('font-avReg', 'text-gray-500', {
              fontSize: 10,
            })}
            numberOfLines={1}>
            {`${props?.likes} Likes | 50k Watched ${
              props?.purchases ? `| ${props?.purchases} Purchases` : ''
            }`}
          </Text>
          {props?.paid && !props?.purchased ? (
            <View style={tw`flex-row justify-between`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text
                  style={tw`font-avSemi rounded text-xs px-2 bg-indigo-50 text-indigo-600 shadow-sm`}>
                  {props?.offer
                    ? `₹ ${
                        props?.price -
                        (props?.offerType === 'PERCENT'
                          ? (props?.price * props?.offer) / 100
                          : props?.offer)
                      }`
                    : `₹ ${props?.price}`}
                </Text>
                {!!props?.offer && (
                  <Text
                    style={tw.style('px-1', 'font-avReg', 'text-gray-500', {
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                      fontSize: 10,
                    })}>
                    {`₹ ${props?.price}`}
                  </Text>
                )}
              </View>
              {!!props?.offer && (
                <Text
                  style={tw.style('font-avSemi', 'text-xs', 'text-red-500', {
                    fontSize: 9,
                  })}>
                  {`${props?.offer}${
                    props?.offerType === 'PERCENT' ? '%' : '₹'
                  } Off`}
                </Text>
              )}
            </View>
          ) : (
            <View style={tw`self-start`}>
              <Text
                style={tw.style(
                  'font-avSemi',
                  'rounded',
                  'px-2',
                  'py-1',
                  'bg-indigo-50',
                  'text-indigo-600',
                  'shadow-sm',
                  {fontSize: 10},
                )}>
                {`Watch ${props?.purchased ? '' : 'Free '}➔`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default VideoItem;
