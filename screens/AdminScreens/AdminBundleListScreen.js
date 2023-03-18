import React from 'react';
import AdminFullCourseBundleListScreen from './AdminFullCourseBundleListScreen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AdminSubjectCourseBundleListScreen from './AdminSubjectCourseBundleListScreen';
import AdminPlaylistCourseBundleListScreen from './AdminPlaylistCourseBundleListScreen';

const Tab = createMaterialTopTabNavigator();

const AdminBundleListScreen = () => {
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

export default AdminBundleListScreen;
