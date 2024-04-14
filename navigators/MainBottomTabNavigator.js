import React from 'react';
import tw from '@lib/tailwind';
import {Text, Image} from 'react-native';
import {loggedUserVar} from 'apollo/client';
import config from 'react-native-ultimate-config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HomeScreen, MyProfileScreen, CommunityScreen} from '@screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeHeader, MyProfileHeader, CommunityHeader} from 'components/Headers';

const Tab = createBottomTabNavigator(); // Created Bottom Tab Navigator

const MainBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'left',
        headerShadowVisible: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={homeScreenOptions}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={myProfileScreenOptions}
      />
      {/* <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={communityScreenOptions}
      /> */}
    </Tab.Navigator>
  );
};

export default MainBottomTabNavigator;

const homeScreenOptions = props => ({
  headerTitle: 'Lakshya PSC Academy',
  headerStyle: tw`bg-emerald-600`,
  headerTitleStyle: tw`font-avSemi`,
  headerTintColor: tw.color('white'),
  headerRight: () => <HomeHeader {...props} />,
  tabBarLabel: ({focused}) => {
    return (
      <Text
        style={tw.style('font-avSemi', 'px-6', {
          'text-emerald-600': focused,
          'text-gray-600': !focused,
          fontSize: 10,
        })}>
        HOME
      </Text>
    );
  },
  tabBarIcon: ({focused}) => {
    return (
      <Ionicons
        name={focused ? 'home' : 'home-outline'}
        color={focused ? tw.color('emerald-600') : tw.color('gray-600')}
        size={20}
      />
    );
  },
});

const myProfileScreenOptions = props => ({
  headerTitle: 'My Profile',
  headerStyle: tw`bg-blue-600`,
  headerTitleStyle: tw`font-avSemi`,
  headerTintColor: tw.color('white'),
  headerRight: () => <MyProfileHeader {...props} />,
  tabBarLabel: ({focused}) => {
    return (
      <Text
        style={tw.style('font-avSemi', 'px-6', {
          'text-blue-600': focused,
          'text-gray-600': !focused,
          fontSize: 10,
        })}>
        MY PROFILE
      </Text>
    );
  },
  tabBarIcon: () => {
    const loggedUser = loggedUserVar();
    return (
      <Image
        source={
          loggedUser?.picture
            ? {
                uri: `${
                  __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
                }/${loggedUser?.picture}`,
              }
            : loggedUser?.gender === 'MALE'
            ? require('@images/person-male.png')
            : require('@images/person-female.png')
        }
        resizeMode="contain"
        style={tw.style('rounded-full border border-gray-300', {
          width: 24,
          height: 24,
        })}
      />
    );
  },
});

const communityScreenOptions = props => ({
  headerTitle: 'Community',
  headerStyle: tw`bg-red-600`,
  headerTitleStyle: tw`font-avSemi`,
  headerTintColor: tw.color('white'),
  headerRight: () => <CommunityHeader {...props} />,
  tabBarLabel: ({focused}) => {
    return (
      <Text
        style={tw.style('font-avSemi', 'px-6', {
          'text-red-600': focused,
          'text-gray-600': !focused,
          fontSize: 10,
        })}>
        COMMUNITY
      </Text>
    );
  },
  tabBarIcon: ({focused}) => {
    return (
      <Ionicons
        name={focused ? 'people' : 'people-outline'}
        color={focused ? tw.color('red-600') : tw.color('gray-600')}
        size={20}
      />
    );
  },
});
