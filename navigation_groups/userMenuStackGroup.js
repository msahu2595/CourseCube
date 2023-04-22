import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BookmarkListTopTabNavigator} from '@navigators';
import {
  DownloadsScreen,
  HelpSupportScreen,
  MyCoursesScreen,
  PaymentsScreen,
  SettingsScreen,
} from '@screens';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const settingStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerStyle: tw`bg-blue-600`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('white'),
        // animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="BookmarkListTopTabNavigator"
        component={BookmarkListTopTabNavigator}
        options={{
          headerTitle: 'Bookmarks',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="DownloadsScreen"
        component={DownloadsScreen}
        options={{
          headerTitle: 'Downloads',
        }}
      />
      <Stack.Screen
        name="HelpSupportScreen"
        component={HelpSupportScreen}
        options={{
          headerTitle: 'Help Support',
        }}
      />
      <Stack.Screen
        name="MyCoursesScreen"
        component={MyCoursesScreen}
        options={{
          headerTitle: 'My Courses',
        }}
      />
      <Stack.Screen
        name="PaymentsScreen"
        component={PaymentsScreen}
        options={{
          headerTitle: 'Payments',
        }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerTitle: 'Settings',
        }}
      />
    </Stack.Group>
  );
};

export default settingStackGroup;
