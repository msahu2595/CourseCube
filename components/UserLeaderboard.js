import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {LeaderboardItem} from '@components';
import {gql, useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/core';
import {showMessage} from 'react-native-flash-message';
import {Text, View, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WEEKLY_LEADERBOARD = gql`
  query weeklyLeaderboard($limit: Int, $offset: Int) {
    weeklyLeaderboard(limit: $limit, offset: $offset) {
      code
      success
      message
      token
      limit
      offset
      payload {
        __typename
        _id
        fullName
        gender
        picture
        followers
        activities
      }
    }
  }
`;

const UserLeaderboard = () => {
  const navigation = useNavigation();

  const {data} = useQuery(WEEKLY_LEADERBOARD, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const handleSeeAll = useCallback(() => {
    navigation.navigate('LeaderboardScreen');
  }, [navigation]);

  if (!data?.weeklyLeaderboard?.payload?.length) {
    return null;
  }

  return (
    <View style={tw`py-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>Leaderboard</Text>
        <TouchableOpacity
          onPress={handleSeeAll}
          style={tw`flex-row items-center`}>
          <Text style={tw`font-avSemi text-gray-600 text-[10px]`}>SEE ALL</Text>
          <MaterialCommunityIcons
            size={16}
            color="#52525B"
            name="chevron-right"
          />
        </TouchableOpacity>
      </View>
      <View style={tw`bg-white`}>
        {data?.weeklyLeaderboard?.payload?.map((item, index) => (
          <LeaderboardItem
            key={`USER_LEADERBOARD_${item?._id}`}
            index={index}
            {...item}
          />
        ))}
      </View>
    </View>
  );
};

export default UserLeaderboard;
