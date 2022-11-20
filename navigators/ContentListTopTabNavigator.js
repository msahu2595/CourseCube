import React from 'react';
import tw from '@lib/tailwind';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  VideoListScreen,
  TestListScreen,
  DocumentListScreen,
  DownloadListScreen,
} from '@screens';
import {SafeAreaContainer} from '@components';

const Tab = createMaterialTopTabNavigator();

const ContentListTopTabNavigator = props => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('green-200')}
      statusBarStyle="dark-content">
      <Tab.Navigator
        backBehavior="none"
        initialRouteName="Info"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-green-200`,
          tabBarItemStyle: tw`px-0`,
          tabBarLabelStyle: tw`font-avSemi text-xs`,
          tabBarIndicatorStyle: tw`bg-green-500`,
        }}>
        <Tab.Screen
          name="Video's"
          component={VideoListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
        <Tab.Screen
          name="PDF's"
          component={DocumentListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
        <Tab.Screen
          name="Test's"
          component={TestListScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            subjectId: props.route.params?.subjectId,
          }}
        />
        <Tab.Screen name="Download's" component={DownloadListScreen} />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default ContentListTopTabNavigator;
