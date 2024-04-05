import {
  EditProfileScreen,
  NotificationScreen,
  UserProfileScreen,
  LeaderboardScreen,
  UserSearchScreen,
} from '@screens';
import React from 'react';
import tw from '@lib/tailwind';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();

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
        name="NotificationScreen"
        component={NotificationScreen}
        options={({route}) => ({
          headerTitle: 'Notifications',
          headerStyle: tw`bg-${route.params?.themeColor || 'blue-600'}`,
        })}
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
