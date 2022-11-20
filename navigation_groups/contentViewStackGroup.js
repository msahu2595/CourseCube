import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  VideoViewScreen,
  TestViewScreen,
  DocumentViewScreen,
  CourseVideoViewScreen,
  CourseTestViewScreen,
  CourseDocumentViewScreen,
  CurrentAffairViewScreen,
} from '@screens';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const contentViewStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerStyle: tw`bg-white`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('black'),
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="VideoViewScreen"
        component={VideoViewScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TestViewScreen"
        component={TestViewScreen}
        options={({route}) => ({
          headerShown: true,
          headerStyle: tw`bg-amber-200`,
          headerTitle: route.params.title || 'Test',
        })}
      />
      <Stack.Screen
        name="DocumentViewScreen"
        component={DocumentViewScreen}
        options={({route}) => ({
          headerShown: true,
          headerStyle: tw`bg-teal-200`,
          headerTitle: route.params.title || 'Document',
        })}
      />
      <Stack.Screen
        name="CourseVideoViewScreen"
        component={CourseVideoViewScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CourseTestViewScreen"
        component={CourseTestViewScreen}
        options={({route}) => ({
          headerShown: true,
          headerStyle: tw`bg-amber-200`,
          headerTitle: route.params.title || 'Test',
        })}
      />
      <Stack.Screen
        name="CourseDocumentViewScreen"
        component={CourseDocumentViewScreen}
        options={({route}) => ({
          headerShown: true,
          headerStyle: tw`bg-teal-200`,
          headerTitle: route.params.title || 'Document',
        })}
      />
      <Stack.Screen
        name="CurrentAffairViewScreen"
        component={CurrentAffairViewScreen}
        options={({route}) => ({
          headerShown: true,
          headerStyle: tw`bg-white`,
          headerTitle: route.params.title || 'Article',
        })}
      />
    </Stack.Group>
  );
};

export default contentViewStackGroup;
