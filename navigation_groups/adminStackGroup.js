import {tw} from '@lib';
import React from 'react';
import {
  AdminHomeScreen,
  AdminAdvertListScreen,
  AdminHeadlineListScreen,
  AdminArticleListScreen,
  AdminWebsiteListScreen,
  AdminTestQuestionListScreen,
} from '@screens';
import {
  MediaListTopTabNavigator,
  CourseListTopTabNavigator,
  ContentListTopTabNavigator,
} from '@navigators';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const adminStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: tw`bg-blue-600`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('white'),
      }}>
      <Stack.Screen
        name="AdminHomeScreen"
        component={AdminHomeScreen}
        options={{
          headerTitle: 'Home',
        }}
      />
      <Stack.Screen
        name="AdminAdvertListScreen"
        component={AdminAdvertListScreen}
        options={{
          headerTitle: 'Adverts',
        }}
      />
      <Stack.Screen
        name="AdminHeadlineListScreen"
        component={AdminHeadlineListScreen}
        options={{
          headerTitle: 'Headlines',
        }}
      />
      <Stack.Screen
        name="AdminArticleListScreen"
        component={AdminArticleListScreen}
        options={{
          headerTitle: 'Articles',
        }}
      />
      <Stack.Screen
        name="AdminWebsiteListScreen"
        component={AdminWebsiteListScreen}
        options={{
          headerTitle: 'Websites',
        }}
      />
      <Stack.Screen
        name="CourseListTopTabNavigator"
        component={CourseListTopTabNavigator}
        options={{
          headerTitle: 'Courses',
        }}
      />
      <Stack.Screen
        name="ContentListTopTabNavigator"
        component={ContentListTopTabNavigator}
        options={{
          headerTitle: 'Contents',
        }}
      />
      <Stack.Screen
        name="MediaListTopTabNavigator"
        component={MediaListTopTabNavigator}
        options={{
          headerTitle: 'Media',
        }}
      />
      <Stack.Screen
        name="AdminTestQuestionListScreen"
        component={AdminTestQuestionListScreen}
        options={{
          headerTitle: 'Test Questions',
        }}
      />
    </Stack.Group>
  );
};

export default adminStackGroup;
