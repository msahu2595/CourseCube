import React from 'react';
import tw from '@lib/tailwind';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  CourseVideoListScreen,
  CourseTestListScreen,
  CourseDocumentListScreen,
  CourseDownloadListScreen,
} from '@screens';
import {SafeAreaContainer} from '@components';

const Tab = createMaterialTopTabNavigator();

const CourseContentListTopTabNavigator = props => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('green-200')}
      statusBarStyle="dark-content">
      <Tab.Navigator
        backBehavior="none"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-green-200`,
          tabBarItemStyle: tw`px-0`,
          tabBarLabelStyle: tw`font-avSemi text-xs`,
          tabBarIndicatorStyle: tw`bg-green-500`,
        }}>
        <Tab.Screen
          name="Video's"
          component={CourseVideoListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
        <Tab.Screen
          name="PDF's"
          component={CourseDocumentListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
        <Tab.Screen
          name="Test's"
          component={CourseTestListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
        <Tab.Screen
          name="Download's"
          component={CourseDownloadListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default CourseContentListTopTabNavigator;
