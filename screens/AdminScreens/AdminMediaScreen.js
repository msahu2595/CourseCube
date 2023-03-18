import React from 'react';
import {
  AdminTestListScreen,
  AdminVideoListScreen,
  AdminDocumentListScreen,
} from '@screens';
import {SafeAreaContainer} from '@components';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const AdminMediaScreen = () => {
  return (
    <SafeAreaContainer statusBarStyle="dark-content">
      <Tab.Navigator>
        <Tab.Screen
          name="AdminVideoListScreen"
          component={AdminVideoListScreen}
          options={{title: 'Videos'}}
        />
        <Tab.Screen
          name="AdminTestListScreen"
          component={AdminTestListScreen}
          options={{title: 'Tests'}}
        />
        <Tab.Screen
          name="AdminDocumentListScreen"
          component={AdminDocumentListScreen}
          options={{title: 'Documents'}}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default AdminMediaScreen;
