import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaContainer} from '@components';
import {
  AdminVideoListScreen,
  AdminTestListScreen,
  AdminDocumentListScreen,
} from '@screens';

const Tab = createMaterialTopTabNavigator();

const MediaScreen = () => {
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
          options={{title: 'Docs'}}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default MediaScreen;
