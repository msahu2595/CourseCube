import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {View, ScrollView, Linking} from 'react-native';
import {
  SafeAreaContainer,
  UserInfo,
  UserMenu,
  UserStatistics,
  UserLeaderboard,
  FollowUs,
  ShareApp,
  Fab,
} from '@components';
import {YOUTUBE_CHANNEL_URL} from '@utils/constants';

const MyProfileScreen = () => {
  const visitYoutubeChannel = useCallback(() => {
    Linking.openURL(YOUTUBE_CHANNEL_URL);
  }, []);

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <ScrollView>
        <View style={tw`pt-1`}>
          <UserInfo />
        </View>
        <View style={tw`pt-1`}>
          <UserMenu />
        </View>
        <View style={tw`pt-1`}>
          <UserStatistics />
        </View>
        <View style={tw`pt-1`}>
          <UserLeaderboard />
        </View>
        <View style={tw`pt-2`}>
          <FollowUs />
        </View>
        <View style={tw`py-2`}>
          <ShareApp />
        </View>
      </ScrollView>
      <Fab
        iconName="youtube"
        bgColor={tw.color('blue-600')}
        onPress={visitYoutubeChannel}
      />
    </SafeAreaContainer>
  );
};

export default MyProfileScreen;
