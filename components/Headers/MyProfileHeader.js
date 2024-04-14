import {tw} from '@lib';
import React, {memo, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const type = 'USER';

export const MyProfileHeader = memo(({navigation}) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.data?.doc) {
        const notification = JSON.parse(remoteMessage?.data?.doc);
        console.log('MyProfileHeader notification', notification);
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
        onPress={() =>
          navigation.navigate('NotificationScreen', {
            themeColor: 'blue-600',
            type,
          })
        }
        hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
        <MaterialCommunityIcons
          name="bell"
          size={28}
          color={tw.color('white')}
        />
      </TouchableOpacity>
    </View>
  );
});
