import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {PostViewScreen, CreatePostScreen} from '@screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const communityStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerStyle: tw`bg-red-600`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('white'),
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="PostViewScreen"
        component={PostViewScreen}
        options={({route}) => ({
          headerTitle: 'Community Post',
        })}
      />
      <Stack.Screen
        name="CreatePostScreen"
        component={CreatePostScreen}
        options={{
          headerTitle: 'Ask Community',
        }}
      />
    </Stack.Group>
  );
};

export default communityStackGroup;
