import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AdminBundleDocumentListScreen from './AdminBundleDocumentListScreen';
import AdminBundleVideoListScreen from './AdminBundleVideoListScreen';
import AdminBundleTestListScreen from './AdminBundleTestListScreen';

const Tab = createMaterialTopTabNavigator();

const AdminBundleContentListScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: 'powderblue'},
      }}>
      <Tab.Screen
        tabBarShowLabel={false}
        name="Document"
        component={AdminBundleDocumentListScreen}
      />
      <Tab.Screen
        tabBarShowLabel={false}
        name="Video"
        component={AdminBundleVideoListScreen}
      />
      <Tab.Screen
        name="Test"
        component={AdminBundleTestListScreen}
        tabBarShowLabel={false}
      />
    </Tab.Navigator>
  );
};

export default AdminBundleContentListScreen;
