import {tw} from '@lib';
import React, {useEffect} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const AdminHomeHeader = ({navigation}) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <TouchableOpacity
      style={tw`pr-3`}
      onPress={() => navigation.navigate('NotificationScreen', {type: 'ADMIN'})}
      hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
      <MaterialCommunityIcons name="bell" size={28} color={tw.color('white')} />
    </TouchableOpacity>
  );
};
