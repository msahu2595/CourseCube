import {tw} from '@lib';
import {LOGOUT} from '@mutations';
import React, {useCallback} from 'react';
import {SafeAreaContainer} from '@components';
import {CCNavigationButton} from 'components/Common';
import {loggedUserVar, storage} from 'apollo/client';
import {Alert, ScrollView, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {useMutation, useReactiveVar} from '@apollo/client';

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
  const loggedUser = useReactiveVar(loggedUserVar);

  const [logout, {loading}] = useMutation(LOGOUT, {
    onCompleted: data => {
      console.log(data?.logout?.message);
      storage.clearAll();
      loggedUserVar(null);
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  const handleMenuPress = useCallback(
    screen => {
      if (screen === 'Logout') {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          {
            text: 'Logout',
            style: 'destructive',
            onPress: logout,
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
    [navigation, logout],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <ScrollView style={tw`bg-white`} contentContainerStyle={tw`p-4`}>
        {menu.map(({name, icon, screen}) => (
          <CCNavigationButton
            key={name}
            name={name}
            icon={icon}
            disabled={loading}
            onPress={() => handleMenuPress(screen)}
          />
        ))}
        {loggedUser?.role === 'ADMIN' && (
          <CCNavigationButton
            name="Login as a Admin"
            icon="repeat"
            disabled={loading}
            onPress={() => handleMenuPress('AdminHomeScreen')}
          />
        )}
        <Text style={tw`text-xs text-center font-avReg text-gray-500`}>
          App Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default SettingsScreen;
