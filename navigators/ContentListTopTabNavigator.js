import {tw} from '@lib';
import React from 'react';
import {
  AdminContentTestListScreen,
  AdminContentVideoListScreen,
  AdminContentDocumentListScreen,
} from '@screens';
import {SafeAreaContainer} from '@components';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const ContentListTopTabNavigator = () => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-500')}
      statusBarStyle="dark-content">
      <Tab.Navigator
        backBehavior="none"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-blue-200`,
          tabBarItemStyle: tw`px-0`,
          tabBarLabelStyle: tw`font-avSemi text-xs`,
          tabBarIndicatorStyle: tw`bg-blue-500`,
        }}>
        <Tab.Screen name="Video's" component={AdminContentVideoListScreen} />
        <Tab.Screen name="PDF's" component={AdminContentDocumentListScreen} />
        <Tab.Screen name="Test's" component={AdminContentTestListScreen} />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default ContentListTopTabNavigator;
