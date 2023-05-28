import React from 'react';
import tw from '@lib/tailwind';
import {useGenderImage} from 'hooks';
import {loggedUserVar} from 'apollo/client';
import {useReactiveVar} from '@apollo/client';
import {useNavigation} from '@react-navigation/core';
import Feather from 'react-native-vector-icons/Feather';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UserInfo = ({edit}) => {
  const navigation = useNavigation();

  const imageByGender = useGenderImage();
  const loggedUser = useReactiveVar(loggedUserVar);

  return (
    <View style={tw`p-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Image
          resizeMode="contain"
          source={
            loggedUser?.picture ? {uri: loggedUser?.picture} : imageByGender
          }
          style={tw.style('rounded-full border border-gray-300', {
            height: 84,
            width: 84,
          })}
        />
        <View style={tw`flex-1 pl-4`}>
          <Text style={tw`font-avSemi text-lg text-blue-600`} numberOfLines={1}>
            {loggedUser?.fullName}
          </Text>
          <Text
            style={tw`font-avReg text-xs text-gray-500 py-1`}
            numberOfLines={2}>
            {loggedUser?.about}
          </Text>
          <View style={tw`flex-row justify-between pt-2`}>
            <TouchableOpacity
              onPress={() => navigation.navigate('FollowListTopTabNavigator')}
              style={tw`flex-row items-center bg-blue-50 py-1 px-3 rounded shadow`}>
              <Feather name="users" size={16} color={tw.color('blue-600')} />
              <Text style={tw`font-avReg text-xs pl-1 text-blue-600`}>
                {loggedUser?.followers} Followers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('FollowListTopTabNavigator')}
              style={tw`flex-row items-center bg-blue-50 py-1 px-3 rounded shadow`}>
              <Feather
                name="user-check"
                size={16}
                color={tw.color('blue-600')}
              />
              <Text style={tw`font-avReg text-xs pl-1 text-blue-600`}>
                {loggedUser?.followings} Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={tw`mt-4 flex-row items-center justify-center`}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileScreen')}
          style={tw`p-2 flex-1 flex-row items-center justify-center bg-blue-600 rounded shadow`}>
          <Feather
            name={edit ? 'edit' : 'user-plus'}
            size={16}
            color={tw.color('white')}
          />
          <Text style={tw`font-avSemi text-sm pl-2 text-white`}>
            {edit ? 'Edit' : 'Follow'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled
          style={tw`ml-2 p-2 flex-row items-center justify-center bg-blue-600 rounded shadow opacity-50`}>
          <MaterialCommunityIcons
            name="share"
            size={20}
            color={tw.color('white')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserInfo;
