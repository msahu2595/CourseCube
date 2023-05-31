import tw from '@lib/tailwind';
import {useGenderImage} from 'hooks';
import React, {useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/core';
import {Image, Text, View, Pressable} from 'react-native';

const LeaderboardItem = ({
  index,
  _id,
  fullName,
  gender,
  picture,
  followers,
  activities,
}) => {
  const navigation = useNavigation();

  const imageByGender = useGenderImage(gender);

  const medal = useMemo(() => {
    switch (index) {
      case 0:
        return require('@images/gold_medal.png');
      case 1:
        return require('@images/bronze_medal.png');
      case 2:
        return require('@images/silver_medal.png');
    }
  }, [index]);

  const handleNavigation = useCallback(() => {
    navigation.navigate('UserProfileScreen', {userId: _id});
  }, [navigation, _id]);

  return (
    <Pressable
      onPress={handleNavigation}
      style={tw`flex-row items-center px-4 py-3`}>
      <Image
        source={picture ? {uri: picture} : imageByGender}
        resizeMode="contain"
        style={tw.style('rounded-full', {
          width: 40,
          aspectRatio: 1,
        })}
      />
      <View style={tw`flex-1 px-4`}>
        <Text style={tw`font-avSemi text-sm text-black`}>{fullName}</Text>
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
