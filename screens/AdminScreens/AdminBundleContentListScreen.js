import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AdminBundleContentDocumentListScreen from './AdminBundleContentDocumentListScreen';
import AdminBundleContentTestListScreen from './AdminBundleContentTestListScreen';
import AdminBundleContentVideoListScreen from './AdminBundleContentVideoListScreen';

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
        component={AdminBundleContentDocumentListScreen}
      />
      <Tab.Screen
        tabBarShowLabel={false}
        name="Video"
        component={AdminBundleContentVideoListScreen}
      />
      <Tab.Screen
        name="Test"
        component={AdminBundleContentTestListScreen}
        tabBarShowLabel={false}
      />
    </Tab.Navigator>
  );
};

export default AdminBundleContentListScreen;
