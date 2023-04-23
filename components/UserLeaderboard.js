import React from 'react';
import tw from '@lib/tailwind';
import {Text, View, TouchableOpacity} from 'react-native';
import {LeaderboardItem} from '@components';
import {useNavigation} from '@react-navigation/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import USER_LEADERBOARD_DATA from '@utils/user_leaderboard_data.json';

const UserLeaderboard = () => {
  const navigation = useNavigation();
  return (
    <View style={tw`py-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>Leaderboard</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('LeaderboardScreen')}
          style={tw`flex-row items-center`}>
          <Text
            style={tw.style('font-avSemi', 'text-gray-600', {fontSize: 10})}>
            SEE ALL
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color="#52525B"
          />
        </TouchableOpacity>
      </View>
      <View style={tw`bg-white`}>
        {USER_LEADERBOARD_DATA.map((item, index) => (
          <LeaderboardItem
            key={`USER_LEADERBOARD_${index}`}
            index={index}
            {...item}
          />
        ))}
      </View>
    </View>
  );
};

export default UserLeaderboard;
