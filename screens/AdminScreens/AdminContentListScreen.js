import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AdminContentVideoListScreen from './AdminContentVideoListScreen';
import AdminContentTestListScreen from './AdminContentTestListScreen';
import AdminContentDocumentListScreen from './AdminContentDocumentListScreen';

const Tab = createMaterialTopTabNavigator();

const AdminContentListScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: 'powderblue'},
      }}>
      <Tab.Screen
        tabBarShowLabel={false}
        name="Videos"
        component={AdminContentVideoListScreen}
      />
      <Tab.Screen
        tabBarShowLabel={false}
        name="Test"
        component={AdminContentTestListScreen}
      />
      <Tab.Screen
        name="Documents"
        component={AdminContentDocumentListScreen}
        tabBarShowLabel={false}
      />
    </Tab.Navigator>
  );
};

export default AdminContentListScreen;
