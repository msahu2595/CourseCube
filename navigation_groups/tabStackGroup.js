import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  MainBottomTabNavigator,
  CourseContentListTopTabNavigator,
  CourseDetailTopTabNavigator,
  FollowListTopTabNavigator,
} from '@navigators';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const tabStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="MainBottomTabNavigator"
        component={MainBottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CourseDetailTopTabNavigator"
        component={CourseDetailTopTabNavigator}
        options={({route}) => ({
          headerShadowVisible: false,
          headerTitle: 'Details',
          headerStyle: tw`bg-${route.params?.themeColor || 'green'}-200`,
          headerTitleStyle: tw`font-avSemi`,
          headerTintColor: tw.color('black'),
        })}
      />
      <Stack.Screen
        name="CourseContentListTopTabNavigator"
        component={CourseContentListTopTabNavigator}
        options={({route}) => ({
          headerShadowVisible: false,
          headerTitle: 'Contents',
          headerStyle: tw`bg-${route.params?.themeColor || 'green'}-200`,
          headerTitleStyle: tw`font-avSemi`,
          headerTintColor: tw.color('black'),
        })}
      />
      <Stack.Screen
        name="FollowListTopTabNavigator"
        component={FollowListTopTabNavigator}
        options={{
          headerShadowVisible: false,
          headerTitle: 'Follows',
          headerStyle: tw`bg-blue-600`,
          headerTitleStyle: tw`font-avSemi`,
          headerTintColor: tw.color('white'),
        }}
      />
    </Stack.Group>
  );
};

export default tabStackGroup;
