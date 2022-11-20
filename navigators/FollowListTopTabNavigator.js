import React from 'react';
import tw from '@lib/tailwind';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'; // Import Create Top Tab Navigator
import {FollowerListScreen, FollowingListScreen} from '@screens'; // Import Screens

const Tab = createMaterialTopTabNavigator(); // Create Tap Tab Navigator

const FollowListTopTabNavigator = () => {
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar
        backgroundColor={tw.color('blue-600')}
        barStyle="light-content"
      />
      <Tab.Navigator
        backBehavior="none"
        initialRouteName="Info"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-white`,
          tabBarItemStyle: tw`px-0`,
          tabBarLabelStyle: tw`font-avSemi text-xs`,
          tabBarIndicatorStyle: tw`bg-blue-500`,
        }}>
        <Tab.Screen name="1.3k Followers" component={FollowerListScreen} />
        <Tab.Screen name="202 Followings" component={FollowingListScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default FollowListTopTabNavigator;
