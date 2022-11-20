import tw from '@lib/tailwind';
import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {View, ImageBackground, Image, Text, Pressable} from 'react-native';

const ContentItem = memo(props => (
  <Pressable onPress={() => props?.handlePress(props?._id, props?.title)}>
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      locations={[0.5, 1]}
      colors={[tw.color('white'), tw.color(`${props?.color}-200`)]}
      style={tw.style('flex-row', 'rounded-lg', 'shadow-sm', 'mx-4')}>
      <ImageBackground
        source={{uri: props?.image}}
        resizeMode="cover"
        imageStyle={tw.style('rounded-lg', {
          opacity: 0.5,
        })}
        style={tw.style('rounded-lg', 'items-center', 'shadow-sm', 'bg-black', {
          height: 96,
        })}>
        <Image
          source={{uri: props?.image}}
          resizeMode="contain"
          style={tw.style({
            height: 96,
            aspectRatio: 16 / 9,
            borderRadius: 20,
          })}
        />
      </ImageBackground>
      <View style={tw`flex-1 px-2 py-2 justify-between`}>
        <Text
          style={tw.style('font-avSemi', `text-${props?.color}-700`, 'py-1', {
            fontSize: 10,
          })}
          numberOfLines={1}>
          {props?.subject}
        </Text>
        <Text
          style={tw`flex-1 font-avSemi text-xs text-gray-600`}
          numberOfLines={2}>
          {props?.title}
        </Text>
        <Text
          style={tw.style('font-avReg', 'text-gray-600', 'py-1', {
            fontSize: 10,
          })}
          numberOfLines={1}>
          {props?.description}
        </Text>
      </View>
    </LinearGradient>
  </Pressable>
));

export default ContentItem;
