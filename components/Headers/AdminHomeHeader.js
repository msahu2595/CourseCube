import {tw} from '@lib';
import React, {memo, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const type = 'ADMIN';

export const AdminHomeHeader = memo(({navigation}) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.data?.doc) {
        const notification = JSON.parse(remoteMessage?.data?.doc);
        console.log('AdminHomeHeader notification', notification);
        if (notification?.type === type) {
          console.log(
            'A new FCM message arrived!',
            JSON.stringify(remoteMessage),
          );
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <TouchableOpacity
      style={tw`pr-3`}
      onPress={() => navigation.navigate('NotificationScreen', {type})}
      hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
      <MaterialCommunityIcons name="bell" size={28} color={tw.color('white')} />
    </TouchableOpacity>
  );
});
