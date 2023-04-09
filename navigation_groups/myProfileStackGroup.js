import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  EditProfileScreen,
  MyNotificationScreen,
  UserProfileScreen,
  LeaderboardScreen,
  UserSearchScreen,
} from '@screens';
import {TextInput, TouchableOpacity, View} from 'react-native';
// Icon Import
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminAdvertListScreen from 'screens/AdminScreens/AdminAdvertListScreen';
import AdminHeadlineListScreen from 'screens/AdminScreens/AdminHeadlineListScreen';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const myProfileStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerStyle: tw`bg-blue-600`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('white'),
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{headerTitle: 'Edit Profile'}}
      />
      <Stack.Screen
        name="MyNotificationScreen"
        component={MyNotificationScreen}
        options={{headerTitle: 'Notifications'}}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{headerTitle: 'User Profile'}}
      />
      <Stack.Screen
        name="LeaderboardScreen"
        component={LeaderboardScreen}
        options={{headerTitle: 'Leaderboard'}}
      />
      <Stack.Screen
        name="UserSearchScreen"
        component={UserSearchScreen}
        options={searchScreenOptions}
      />
      <Stack.Screen
        name="AdminAdvertListScreen"
        component={AdminAdvertListScreen}
        options={{headerTitle: 'Admin Advert List'}}
      />
      <Stack.Screen
        name="AdminHeadlineListScreen"
        component={AdminHeadlineListScreen}
        options={{headerTitle: 'Admin Headline List'}}
      />
    </Stack.Group>
  );
};

export default myProfileStackGroup;

const searchScreenOptions = {
  animation: 'slide_from_bottom',
  header: ({navigation}) => (
    <View style={tw`h-14 px-4 flex-row bg-blue-600 items-center`}>
      <View style={tw`flex-1 flex-row items-center bg-white rounded-lg shadow`}>
        <MaterialCommunityIcons
          name="magnify"
          size={28}
          color={tw.color('blue-600')}
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
        onPress={() => navigation.goBack()}
        hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
        <MaterialCommunityIcons
          name="close"
          size={28}
          color={tw.color('white')}
        />
      </TouchableOpacity>
    </View>
  ),
};
