import {tw} from '@lib';
import React from 'react';
import {
  AdminFullCourseBundleListScreen,
  AdminSubjectCourseBundleListScreen,
  AdminPlaylistCourseBundleListScreen,
} from '@screens';
import {SafeAreaContainer} from '@components';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const CourseListTopTabNavigator = () => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="dark-content">
      <Tab.Navigator
        backBehavior="none"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-blue-600`,
          tabBarItemStyle: tw`px-0`,
          tabBarIndicatorStyle: tw`bg-blue-200`,
          tabBarLabelStyle: tw`font-avSemi text-xs text-white`,
        }}>
        <Tab.Screen
          name="AdminFullCourseBundleListScreen"
          component={AdminFullCourseBundleListScreen}
          options={{title: 'Full Course'}}
        />
        <Tab.Screen
          name="AdminSubjectCourseBundleListScreen"
          component={AdminSubjectCourseBundleListScreen}
          options={{title: 'Subject Wise'}}
        />
        <Tab.Screen
          name="AdminPlaylistCourseBundleListScreen"
          component={AdminPlaylistCourseBundleListScreen}
          options={{title: 'Playlist'}}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default CourseListTopTabNavigator;
