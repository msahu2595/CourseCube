import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  BookmarksScreen,
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
        name="BookmarksScreen"
        component={BookmarksScreen}
        options={{
          headerTitle: 'Bookmarks',
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
