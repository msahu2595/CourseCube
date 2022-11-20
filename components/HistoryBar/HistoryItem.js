import React from 'react';
import tw from '@lib/tailwind';
import {View, Image, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';

const HistoryItem = ({image}) => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.navigate('VideoViewScreen')}>
      <View
        style={tw.style(
          'flex-row',
          'rounded-lg',
          'bg-gray-50',
          'mb-3',
          'shadow-sm',
          {
            width: 320,
          },
        )}>
        <View
          style={tw.style('rounded-lg', 'items-center', 'shadow-sm', {
            height: 96,
          })}>
          <Image
            source={{uri: image}}
            resizeMode="cover"
            style={tw.style('rounded-lg', {height: 96, aspectRatio: 16 / 9})}
          />
        </View>
        <View style={tw`flex-1 px-2 py-1 justify-between`}>
          <Text
            style={tw.style('font-avSemi', 'text-sky-700', 'py-1', {
              fontSize: 10,
            })}
            numberOfLines={1}>
            Geography
          </Text>
          <Text style={tw`font-avSemi text-xs text-gray-600`} numberOfLines={2}>
            CGPSC Prelims Hindi Medium Mobile Course
          </Text>
          <Text
            style={tw.style('font-avReg', 'text-gray-500', 'py-1', {
              fontSize: 10,
            })}
            numberOfLines={1}>
            13 Mins Remaining
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default HistoryItem;
