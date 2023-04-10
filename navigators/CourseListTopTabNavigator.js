import React from 'react';
import {
  AdminFullCourseBundleListScreen,
  AdminSubjectCourseBundleListScreen,
  AdminPlaylistCourseBundleListScreen,
} from '@screens';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const CourseListTopTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: 'powderblue'},
      }}>
      <Tab.Screen
        tabBarShowLabel={false}
        name="Full Course"
        component={AdminFullCourseBundleListScreen}
      />
      <Tab.Screen
        tabBarShowLabel={false}
        name="Subject Course"
        component={AdminSubjectCourseBundleListScreen}
      />
      <Tab.Screen
        name="Playlist Course"
        component={AdminPlaylistCourseBundleListScreen}
        tabBarShowLabel={false}
      />
    </Tab.Navigator>
  );
};

export default CourseListTopTabNavigator;
