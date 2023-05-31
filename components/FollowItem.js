import tw from '@lib/tailwind';
import {useGenderImage} from 'hooks';
import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/core';
import {Image, Text, View, Pressable} from 'react-native';

const FollowItem = ({
  _id,
  fullName,
  gender,
  picture,
  followers,
  activities,
}) => {
  const navigation = useNavigation();

  const imageByGender = useGenderImage(gender);

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
    </Pressable>
  );
};

export default FollowItem;
