import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import React, {memo} from 'react';
import {View, ImageBackground, Image, Text, Pressable} from 'react-native';

const ContentItem = memo(props => (
  <Pressable
    onPress={() =>
      props?.onPress({
        contentId: props?._id,
        contentTitle: props?.title,
        contentSubType: props?.type,
        contentType: props?.__typename,
      })
    }>
    <View
      style={tw`flex-row rounded-lg shadow-sm bg-gray-50 ${
        props?.horizontal ? 'w-[320px]' : ''
      }`}>
      <ImageBackground
        resizeMode="cover"
        source={{uri: props?.image}}
        imageStyle={tw`rounded-lg opacity-50`}
        style={tw`rounded-lg items-center shadow-sm bg-black h-[96px]`}>
        <Image
          source={{uri: props?.image}}
          resizeMode="contain"
          style={tw.style({
            height: 96,
            borderRadius: 8,
            aspectRatio: 16 / 9,
          })}
        />
      </ImageBackground>
      <View style={tw`flex-1 px-2 py-2 justify-between`}>
        <Text
          style={tw`font-avSemi text-indigo-700 capitalize text-[10px]`}
          numberOfLines={1}>
          {props?.subject}
        </Text>
        <Text
          style={tw`font-avSemi text-xs text-gray-600 capitalize`}
          numberOfLines={2}>
          {props?.title}
        </Text>
        <Text
          style={tw`font-avReg text-gray-500 text-[10px]`}
          numberOfLines={1}>
          {dayjs(parseInt(props?.createdAt, 10)).fromNow()}
        </Text>
      </View>
    </View>
  </Pressable>
));

export default ContentItem;
