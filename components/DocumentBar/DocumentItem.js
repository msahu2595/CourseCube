import tw from '@lib/tailwind';
import React, {memo, useCallback} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, Image, Text, Pressable, ImageBackground} from 'react-native';

const DocumentItem = memo(({width = 144, ...rest}) => {
  const navigation = useNavigation();

  const handleNavigation = useCallback(() => {
    navigation.navigate('DocumentViewScreen', {
      contentId: rest?._id,
      title: rest?.title,
    });
  }, [navigation, rest?._id, rest?.title]);

  return (
    <Pressable onPress={handleNavigation}>
      <View
        style={tw`bg-gray-50 rounded-lg shadow-sm w-[${width}px] opacity-${
          rest?.visible ? 100 : 50
        }`}>
        <ImageBackground
          resizeMode="cover"
          source={{uri: rest?.image}}
          imageStyle={tw`rounded-lg opacity-50`}
          style={tw`rounded-lg items-center shadow-sm bg-white w-[${width}px]`}>
          <Image
            source={{uri: rest?.image}}
            resizeMode="cover"
            style={tw.style({
              width,
              borderRadius: 8,
              aspectRatio: 3 / 4,
            })}
          />
        </ImageBackground>
        <View style={tw`h-[130px] px-2 py-3 justify-between`}>
          <View style={tw`flex-row justify-between`}>
            <Text
              style={tw`flex-1 font-avSemi text-teal-700 capitalize text-[10px]`}
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
            {`${rest?.likes} Likes | 131 Reads ${
              rest?.purchases ? `| ${rest?.purchases} Purchases` : ''
            }`}
            {/* 12 Pages | 131 Reads */}
          </Text>
          {rest?.paid && !rest?.purchased ? (
            <View style={tw`flex-row items-center justify-between`}>
              <Text
                style={tw`font-avSemi rounded text-xs px-2 bg-teal-50 text-teal-600 shadow-sm`}>
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
                style={tw`font-avSemi rounded px-2 py-1 bg-teal-50 text-teal-600 shadow-sm text-[10px]`}>
                {`Read ${rest?.purchased ? '' : 'Free '}➔`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default DocumentItem;
