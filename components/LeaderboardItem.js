import React from 'react';
import tw from '@lib/tailwind';
import {useNavigation} from '@react-navigation/core';
import {Image, Text, View, Pressable} from 'react-native';

const LeaderboardItem = ({index, image, name, activities, followers}) => {
  const navigation = useNavigation();
  let medal;
  switch (index) {
    case 0:
      medal = require('@images/gold_medal.png');
      break;
    case 1:
      medal = require('@images/bronze_medal.png');
      break;
    case 2:
      medal = require('@images/silver_medal.png');
      break;
  }
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('UserProfileScreen');
      }}
      style={tw`flex-row items-center px-4 py-3`}>
      <Image
        source={{uri: image}}
        resizeMode="contain"
        style={tw.style('rounded-full', {
          width: 40,
          aspectRatio: 1,
        })}
      />
      <View style={tw`flex-1 px-4`}>
        <Text style={tw`font-avSemi text-sm text-black`}>{name}</Text>
        <Text style={tw`font-avReg text-xs text-black`}>
          <Text style={tw`font-avSemi text-blue-500`}>{activities}</Text>{' '}
          Activities |{' '}
          <Text style={tw`font-avSemi text-blue-500`}>{followers}</Text>{' '}
          Followers
        </Text>
      </View>
      {medal ? (
        <Image
          source={medal}
          resizeMode="contain"
          style={tw.style('self-center', {
            width: 32,
            height: 32,
          })}
        />
      ) : (
        <Text
          style={tw.style(
            'font-avSemi',
            'text-xs',
            'text-center',
            'text-blue-600',
            'bg-blue-50',
            'rounded-full',
            {
              width: 32,
              height: 32,
              textAlignVertical: 'center',
            },
          )}>
          #{index + 1}
        </Text>
      )}
    </Pressable>
  );
};

export default LeaderboardItem;
