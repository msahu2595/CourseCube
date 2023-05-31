import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import tw from '@lib/tailwind';
import {useGenderImage} from 'hooks';
import {loggedUserVar} from 'apollo/client';
import {useNavigation} from '@react-navigation/core';
import {CCFollowButton, CCTextExpand} from './Common';
import {showMessage} from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import React, {useCallback, useEffect, useState} from 'react';
import {gql, useLazyQuery, useReactiveVar} from '@apollo/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const USER = gql`
  query user($userId: ID) {
    user(userId: $userId) {
      code
      success
      message
      token
      refresh
      payload {
        _id
        fullName
        gender
        picture
        about
        followers
        followings
      }
    }
  }
`;

const UserInfo = ({userId}) => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const loggedUser = useReactiveVar(loggedUserVar);
  const imageByGender = useGenderImage(user?.gender);

  const [fetchUser] = useLazyQuery(USER, {
    onCompleted: data => {
      setUser(data?.user?.payload);
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  useEffect(() => {
    if (!userId || loggedUser?._id === userId) {
      setUser(loggedUser);
    } else {
      fetchUser({variables: {userId}});
    }
  }, [loggedUser, userId, fetchUser]);

  const handleEdit = useCallback(() => {
    navigation.navigate('EditProfileScreen');
  }, [navigation]);

  return (
    <View style={tw`p-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Image
          resizeMode="contain"
          source={user?.picture ? {uri: user?.picture} : imageByGender}
          style={tw.style('rounded-full border border-gray-300', {
            height: 84,
            width: 84,
          })}
        />
        <View style={tw`flex-1 pl-4`}>
          <Text style={tw`font-avSemi text-lg text-blue-600`} numberOfLines={1}>
            {user?.fullName}
          </Text>
          <CCTextExpand
            numberOfLines={2}
            style={tw`font-avReg text-xs text-gray-500 py-1`}>
            {user?.about}
          </CCTextExpand>
          <View style={tw`flex-row justify-between pt-2`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FollowListTopTabNavigator', {
                  screen: 'FollowerListScreen',
                  userId: user?._id,
                  followers: user?.followers,
                  followings: user?.followings,
                })
              }
              style={tw`flex-row items-center bg-blue-50 py-1 px-3 rounded shadow`}>
              <Feather name="users" size={16} color={tw.color('blue-600')} />
              <Text style={tw`font-avReg text-xs pl-1 text-blue-600`}>
                {user?.followers} Followers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FollowListTopTabNavigator', {
                  screen: 'FollowingListScreen',
                  userId: user?._id,
                  followers: user?.followers,
                  followings: user?.followings,
                })
              }
              style={tw`flex-row items-center bg-blue-50 py-1 px-3 rounded shadow`}>
              <Feather
                name="user-check"
                size={16}
                color={tw.color('blue-600')}
              />
              <Text style={tw`font-avReg text-xs pl-1 text-blue-600`}>
                {user?.followings} Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={tw`mt-4 flex-row items-center justify-center`}>
        {user ? (
          user?._id === loggedUser?._id ? (
            <TouchableOpacity
              onPress={handleEdit}
              style={tw`p-2 flex-1 flex-row items-center justify-center bg-blue-600 rounded shadow`}>
              <Feather name="edit" size={16} color={tw.color('white')} />
              <Text style={tw`font-avSemi text-sm pl-2 text-white`}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <CCFollowButton
              refId={user?._id}
              style={tw`p-2 flex-1 flex-row items-center justify-center bg-blue-600 rounded shadow`}>
              {({loading, followed}) =>
                loading ? (
                  <ActivityIndicator size="small" color={tw.color('white')} />
                ) : (
                  <>
                    <Feather
                      size={16}
                      color={tw.color('white')}
                      name={followed ? 'user-minus' : 'user-plus'}
                    />
                    <Text style={tw`font-avSemi text-sm pl-2 text-white`}>
                      {followed ? 'Unfollow' : 'Follow'}
                    </Text>
                  </>
                )
              }
            </CCFollowButton>
          )
        ) : (
          <TouchableOpacity
            disabled={true}
            style={tw`p-2 flex-1 flex-row items-center justify-center bg-blue-600 rounded shadow`}>
            <ActivityIndicator size="small" color={tw.color('white')} />
          </TouchableOpacity>
        )}
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
