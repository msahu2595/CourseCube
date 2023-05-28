import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CreateProfileScreen} from '@screens';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const verifyUserStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerStyle: tw`bg-blue-600`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('white'),
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="CreateProfileScreen"
        component={CreateProfileScreen}
        options={{
          headerTitle: 'Create Profile',
        }}
      />
    </Stack.Group>
  );
};

export default verifyUserStackGroup;
