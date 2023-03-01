import React from 'react';
import {Text, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AddVideosScreen from './AddVideosScreen';
import AddTestScreen from './AddTestScreen';
import AddDocumentsScreen from './AddDocumentsScreen';

const Tab = createMaterialTopTabNavigator();

const AdminContentListScreen = () => {
  return (
    // <View>
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
        component={AddVideosScreen}
      />
      <Tab.Screen
        tabBarShowLabel={false}
        name="Test"
        component={AddTestScreen}
      />
      <Tab.Screen
        name="Documents"
        component={AddDocumentsScreen}
        tabBarShowLabel={false}
      />
    </Tab.Navigator>
  );
};

export default AdminContentListScreen;
