import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginIntroScreen} from '@screens';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const authStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginIntroScreen" component={LoginIntroScreen} />
    </Stack.Group>
  );
};

export default authStackGroup;
