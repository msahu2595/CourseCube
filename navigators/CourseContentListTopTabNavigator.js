import React from 'react';
import tw from '@lib/tailwind';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  CourseVideoListScreen,
  CourseTestListScreen,
  CourseDocumentListScreen,
} from '@screens';
import {SafeAreaContainer} from '@components';

const Tab = createMaterialTopTabNavigator();

const CourseContentListTopTabNavigator = props => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color(
        `${props.route.params?.themeColor || 'green'}-200`,
      )}
      statusBarStyle="dark-content">
      <Tab.Navigator
        backBehavior="none"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-${props.route.params?.themeColor || 'green'}-200`,
          tabBarItemStyle: tw`px-0`,
          tabBarLabelStyle: tw`font-avSemi text-xs`,
          tabBarIndicatorStyle: tw`bg-${
            props.route.params?.themeColor || 'green'
          }-500`,
        }}>
        <Tab.Screen
          name="CourseVideoListScreen"
          component={CourseVideoListScreen}
          options={{title: 'Videos'}}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
            themeColor: props.route.params?.themeColor,
          }}
        />
        <Tab.Screen
          name="CourseDocumentListScreen"
          component={CourseDocumentListScreen}
          options={{title: 'PDFs'}}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
            themeColor: props.route.params?.themeColor,
          }}
        />
        <Tab.Screen
          name="CourseTestListScreen"
          component={CourseTestListScreen}
          options={{title: 'Tests'}}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
            themeColor: props.route.params?.themeColor,
          }}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default CourseContentListTopTabNavigator;
