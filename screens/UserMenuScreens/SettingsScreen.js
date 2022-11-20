import {tw} from '@lib';
import React, {useCallback} from 'react';
import {SafeAreaContainer} from '@components';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, ScrollView, Text, TouchableOpacity} from 'react-native';

const menu = [
  {name: 'Privacy Policy', icon: 'lock', screen: 'PrivacyPolicyScreen'},
  {
    name: 'Terms & Conditions',
    icon: 'file-text',
    screen: 'TermsConditionsScreen',
  },
  {name: 'About', icon: 'info', screen: 'AboutScreen'},
  {name: 'Logout', icon: 'log-out', screen: 'Logout'},
];

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleMenuPress = useCallback(
    screen => {
      if (screen === 'Logout') {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          {
            text: 'Logout',
            style: 'destructive',
            onPress: () => {
              auth()
                .signOut()
                .then(() => {
                  console.log('User signed out!');
                  AsyncStorage.multiRemove(['token', 'refresh']);
                });
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]);
      } else {
        navigation.navigate(screen);
      }
    },
    [navigation],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <ScrollView style={tw`bg-white`} contentContainerStyle={tw`p-4`}>
        {menu.map(({name, icon, screen}) => {
          return (
            <TouchableOpacity
              onPress={() => handleMenuPress(screen)}
              key={icon}
              style={tw.style(
                'mb-4',
                'p-4',
                'flex-row',
                'items-center',
                'bg-blue-50',
                'rounded-lg',
                'shadow-sm',
              )}>
              <Feather name={icon} color={tw.color('blue-600')} size={16} />
              <Text style={tw`flex-1 px-4 font-avSemi text-black`}>{name}</Text>
              <Feather
                name="chevron-right"
                color={tw.color('blue-600')}
                size={16}
              />
            </TouchableOpacity>
          );
        })}
        <Text style={tw`text-xs text-center font-avReg text-gray-500`}>
          App Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default SettingsScreen;
