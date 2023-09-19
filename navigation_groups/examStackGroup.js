import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {ExamAttemptScreen, ExamResultScreen} from '@screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const examStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerStyle: tw`bg-amber-200`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('black'),
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="ExamAttemptScreen"
        component={ExamAttemptScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          orientation: 'portrait',
          navigationBarHidden: true,
          autoHideHomeIndicator: true,
        }}
      />
      <Stack.Screen
        name="ExamResultScreen"
        component={ExamResultScreen}
        options={{
          headerTitle: 'Result',
        }}
      />
    </Stack.Group>
  );
};

export default examStackGroup;
