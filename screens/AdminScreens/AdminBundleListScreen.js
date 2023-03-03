import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AdminContentVideoListScreen from './AdminContentVideoListScreen';
import AdminContentTestListScreen from './AdminContentTestListScreen';
import AdminContentDocumentListScreen from './AdminContentDocumentListScreen';

const Tab = createMaterialTopTabNavigator();

const AdminBundleListScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: 'powderblue'},
      }}></Tab.Navigator>
  );
};

export default AdminBundleListScreen;
