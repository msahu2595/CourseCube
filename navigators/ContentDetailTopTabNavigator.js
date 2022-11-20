import React from 'react';
import tw from '@lib/tailwind';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {InfoScreen, SyllabusScreen, FAQScreen} from '@screens';
import {SafeAreaContainer} from '@components';

const Tab = createMaterialTopTabNavigator();

const ContentDetailTopTabNavigator = props => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color(
        `${props.route.params?.themeColor || 'green'}-200`,
      )}
      statusBarStyle="dark-content">
      <Tab.Navigator
        backBehavior="none"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-${props.route.params?.themeColor || 'green'}-200`,
          tabBarItemStyle: tw`px-0`,
          tabBarLabelStyle: tw`font-avSemi text-xs`,
          tabBarIndicatorStyle: tw`bg-${
            props.route.params?.themeColor || 'green'
          }-500`,
        }}>
        <Tab.Screen
          name="Info"
          component={InfoScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            themeColor: props.route.params?.themeColor,
          }}
        />
        <Tab.Screen
          name="Syllabus"
          component={SyllabusScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            themeColor: props.route.params?.themeColor,
          }}
        />
        <Tab.Screen
          name="FAQ"
          component={FAQScreen}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            themeColor: props.route.params?.themeColor,
          }}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default ContentDetailTopTabNavigator;
