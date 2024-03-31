import React from 'react';
import tw from '@lib/tailwind';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  AdminCourseVideoListScreen,
  AdminCourseTestListScreen,
  AdminCourseDocumentListScreen,
} from '@screens';
import {SafeAreaContainer} from '@components';

const Tab = createMaterialTopTabNavigator();

const AdminCourseContentListTopTabNavigator = props => {
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
          name="Videos"
          component={AdminCourseVideoListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
        <Tab.Screen
          name="Tests"
          component={AdminCourseTestListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
        <Tab.Screen
          name="Documents"
          component={AdminCourseDocumentListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default AdminCourseContentListTopTabNavigator;
