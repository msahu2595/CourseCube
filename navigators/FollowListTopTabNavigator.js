import React from 'react';
import tw from '@lib/tailwind';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'; // Import Create Top Tab Navigator
import {FollowerListScreen, FollowingListScreen} from '@screens'; // Import Screens

const Tab = createMaterialTopTabNavigator(); // Create Tap Tab Navigator

const FollowListTopTabNavigator = ({route}) => (
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
    <Tab.Screen
      name="FollowerListScreen"
      component={FollowerListScreen}
      initialParams={{userId: route.params?.userId}}
      options={{title: `${route.params?.followers} Followers`}}
    />
    <Tab.Screen
      name="FollowingListScreen"
      component={FollowingListScreen}
      initialParams={{userId: route.params?.userId}}
      options={{title: `${route.params?.followings} Followings`}}
    />
  </Tab.Navigator>
);

export default FollowListTopTabNavigator;
