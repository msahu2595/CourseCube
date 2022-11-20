import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  PrivacyPolicyScreen,
  TermsConditionsScreen,
  AboutScreen,
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
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{
          headerTitle: 'Privacy Policy',
        }}
      />
      <Stack.Screen
        name="TermsConditionsScreen"
        component={TermsConditionsScreen}
        options={{
          headerTitle: 'Terms & Conditions',
        }}
      />
      <Stack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{
          headerTitle: 'About',
        }}
      />
    </Stack.Group>
  );
};

export default settingStackGroup;
