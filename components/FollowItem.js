import tw from '@lib/tailwind';
import {useGenderImage} from 'hooks';
import React, {useCallback} from 'react';
import config from 'react-native-ultimate-config';
import {useNavigation} from '@react-navigation/core';
import {Image, Text, View, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FollowItem = ({
  _id,
  fullName,
  gender,
  picture,
  followers,
  activities,
  isAdmin = false,
  ...rest
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
        source={
          picture
            ? {
                uri: `${
                  __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
                }/${picture}`,
              }
            : imageByGender
        }
        resizeMode="contain"
        style={tw.style('rounded-full', {
          width: 40,
          aspectRatio: 1,
        })}
      />
      <View style={tw`flex-1 px-4`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`mr-1 font-avSemi text-sm text-black`}>
            {fullName}
          </Text>
          {isAdmin && (gender === 'MALE' || gender === 'FEMALE') && (
            <MaterialCommunityIcons
              name={gender === 'MALE' ? 'gender-male' : 'gender-female'}
              size={16}
              color={
                gender === 'MALE' ? tw.color('blue-600') : tw.color('pink-600')
              }
            />
          )}
        </View>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`font-avReg text-xs text-black`}>
            <Text style={tw`font-avSemi text-blue-500`}>{activities}</Text>{' '}
            Activities |{' '}
            <Text style={tw`font-avSemi text-blue-500`}>{followers}</Text>{' '}
            Followers
          </Text>
          {isAdmin && (
            <>
              <Text
                style={tw`capitalize mx-1 px-2 py-[2px] font-avReg text-[10px] text-center text-white bg-${
                  rest?.platform === 'android' ? 'cyan-600' : 'violet-600'
                } rounded`}>
                {rest?.platform}
              </Text>
              {rest?.role !== 'USER' && (
                <Text
                  style={tw`capitalize mx-1 px-2 py-[2px] font-avReg text-[10px] text-center text-white bg-blue-600 rounded`}>
                  {rest?.role}
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default FollowItem;
