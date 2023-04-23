import React from 'react';
import tw from '@lib/tailwind';
import {View, FlatList} from 'react-native';
import {LeaderboardItem, SafeAreaContainer} from '@components';
import USER_LEADERBOARD_DATA from '@utils/user_leaderboard_data.json';

const LeaderboardScreen = () => {
  const renderItem = ({item, index}) => (
    <LeaderboardItem index={index} {...item} />
  );
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <FlatList
        renderItem={renderItem}
        data={USER_LEADERBOARD_DATA}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => <View style={tw`h-2`} />}
        ListFooterComponent={() => <View style={tw`h-2`} />}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
      />
    </SafeAreaContainer>
  );
};

export default LeaderboardScreen;
