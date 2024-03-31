import React from 'react';
import tw from '@lib/tailwind';
import {
  AdminTestListScreen,
  AdminVideoListScreen,
  AdminDocumentListScreen,
} from '@screens';
import {SafeAreaContainer} from '@components';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const AdminMediaListTopTabNavigator = props => {
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
          name="AdminVideoListScreen"
          component={AdminVideoListScreen}
          options={{title: 'Videos'}}
        />
        <Tab.Screen
          name="AdminTestListScreen"
          component={AdminTestListScreen}
          options={{title: 'Tests'}}
        />
        <Tab.Screen
          name="AdminDocumentListScreen"
          component={AdminDocumentListScreen}
          options={{title: 'Documents'}}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default AdminMediaListTopTabNavigator;
