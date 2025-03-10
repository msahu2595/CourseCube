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

const AdminContentListTopTabNavigator = () => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="dark-content">
      <Tab.Navigator
        backBehavior="none"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-blue-600`,
          tabBarItemStyle: tw`px-0`,
          tabBarIndicatorStyle: tw`bg-blue-200`,
          tabBarLabelStyle: tw`font-avSemi text-xs text-white`,
        }}>
        <Tab.Screen
          name="AdminContentVideoListScreen"
          component={AdminContentVideoListScreen}
          options={{title: 'Videos'}}
        />
        <Tab.Screen
          name="AdminContentDocumentListScreen"
          component={AdminContentDocumentListScreen}
          options={{title: 'Documents'}}
        />
        <Tab.Screen
          name="AdminContentTestListScreen"
          component={AdminContentTestListScreen}
          options={{title: 'Tests'}}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default AdminContentListTopTabNavigator;
