import React from 'react';
import tw from '@lib/tailwind';
import {SafeAreaContainer} from '@components';
import {BookmarkContentScreen, BookmarkArticleScreen} from '@screens';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const BookmarkListTopTabNavigator = props => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="dark-content">
      <Tab.Navigator
        backBehavior="none"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-blue-600`,
          tabBarItemStyle: tw`px-0`,
          tabBarIndicatorStyle: tw`bg-blue-200`,
          tabBarLabelStyle: tw`font-avSemi text-sm text-white capitalize`,
        }}>
        <Tab.Screen
          name="BookmarkContentScreen"
          component={BookmarkContentScreen}
          options={{title: 'Contents'}}
        />
        <Tab.Screen
          name="BookmarkArticleScreen"
          component={BookmarkArticleScreen}
          options={{title: 'Articles'}}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default BookmarkListTopTabNavigator;
