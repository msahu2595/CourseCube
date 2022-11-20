import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'; // Tab Navigator Import
import {HomeScreen, MyProfileScreen, CommunityScreen} from '@screens'; // Screens Import
// Icon Imports
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator(); // Created Bottom Tab Navigator

const MainBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerShadowVisible: true,
        tabBarStyle: tw`h-14 pb-1`,
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
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={communityScreenOptions}
      />
    </Tab.Navigator>
  );
};

export default MainBottomTabNavigator;

const homeScreenOptions = {
  header: ({navigation}) => {
    return (
      <View
        style={tw`h-14 px-4 flex-row justify-between items-center bg-emerald-600`}>
        <View style={tw`flex-1 flex-row items-center`}>
          <Image
            source={require('@images/Logo.png')}
            resizeMode="contain"
            style={tw.style({height: 36, width: 36})}
          />
          <Text
            style={tw`flex-1 font-avSemi text-base text-white pl-4`}
            numberOfLines={1}>
            Lakshya PSC Academy
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchScreen')}
          hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
          <MaterialCommunityIcons
            name="magnify"
            size={28}
            color={tw.color('white')}
          />
        </TouchableOpacity>
      </View>
    );
  },
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
};

const myProfileScreenOptions = ({navigation}) => ({
  headerTitle: 'My Profile',
  headerStyle: tw`bg-blue-600`,
  headerTitleStyle: tw`font-avSemi`,
  headerTintColor: tw.color('white'),
  headerRight: () => {
    return (
      <View style={tw`flex-row`}>
        <TouchableOpacity
          style={tw`pr-3`}
          onPress={() => navigation.navigate('UserSearchScreen')}
          hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
          <MaterialCommunityIcons
            name="magnify"
            size={28}
            color={tw.color('white')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`pr-3`}
          onPress={() => navigation.navigate('MyNotificationScreen')}
          hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
          <MaterialCommunityIcons
            name="bell"
            size={28}
            color={tw.color('white')}
          />
        </TouchableOpacity>
      </View>
    );
  },
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
    return (
      <Image
        source={require('@images/manish.jpg')}
        resizeMode="contain"
        style={tw.style('rounded-full', {
          width: 24,
          height: 24,
        })}
      />
    );
  },
});

const communityScreenOptions = {
  header: ({navigation}) => (
    <View style={tw`h-14 px-4 flex-row bg-red-600 items-center`}>
      <View style={tw`flex-1 flex-row items-center bg-white rounded-lg shadow`}>
        <MaterialCommunityIcons
          name="magnify"
          size={28}
          color={tw.color('red-600')}
          style={tw`px-2`}
        />
        <TextInput
          style={tw.style(
            'py-1',
            'flex-1',
            'font-avReg',
            'text-base',
            'text-black',
            'rounded',
            {
              paddingVertical: 0,
            },
          )}
          returnKeyType="search"
          returnKeyLabel="Search"
          placeholder="Type search keyword here ..."
          placeholderTextColor={tw.color('gray-400')}
          onSubmitEditing={() => console.log('Pressed return key !!!')}
        />
      </View>
      <TouchableOpacity
        style={tw`pl-2`}
        onPress={() => navigation.navigate('CommunityNotificationScreen')}
        hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
        <MaterialCommunityIcons
          name="bell"
          size={28}
          color={tw.color('white')}
        />
      </TouchableOpacity>
    </View>
  ),
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
};
