import {
  Text,
  View,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import {tw} from '@lib';
import dayjs from 'dayjs';
import {NOTIFICATIONS} from '@queries';
import React, {memo, useCallback} from 'react';
import {gql, useMutation} from '@apollo/client';
import config from 'react-native-ultimate-config';
import updateLocale from 'dayjs/plugin/updateLocale';
import {useNavigation} from '@react-navigation/core';
import {showMessage} from 'react-native-flash-message';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: '1s',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1y',
    yy: '%dy',
  },
});

const READ_NOTIFICATION = gql`
  mutation readNotification($notificationId: ID!) {
    readNotification(notificationId: $notificationId) {
      code
      success
      message
      token
      payload {
        _id
        userId
        title
        body
        icon
        type
        alert
        route
        params
        read
        createdAt
        updatedAt
      }
    }
  }
`;

const NotificationItem = memo(props => {
  const navigation = useNavigation();
  const width = useWindowDimensions().width;

  const [readNotification] = useMutation(READ_NOTIFICATION, {
    variables: {notificationId: props?._id},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    refetchQueries: [
      {query: NOTIFICATIONS, variables: {filter: {type: props?.type}}},
    ],
  });

  const handlePress = useCallback(() => {
    readNotification();
    if (props?.route) {
      navigation.navigate(props?.route, {...props?.params});
    }
  }, [props, readNotification, navigation]);

  return (
    <View style={tw.style('items-center', {width})}>
      <Pressable
        onPress={handlePress}
        android_ripple={{color: tw.color('gray-600'), foreground: true}}
        style={tw.style(
          `flex-row shadow-sm bg-${props?.read ? 'gray-50' : 'gray-300'}`,
          {width: width, height: 72},
        )}>
        {!!props?.icon && (
          <ImageBackground
            resizeMode="cover"
            source={{
              uri: `${
                __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
              }/${props?.icon}`,
            }}
            style={tw.style(
              'ml-2 rounded-full shadow-sm bg-gray-200 self-center',
              {width: 48, height: 48},
            )}
            imageStyle={tw.style('rounded-full')}
          />
        )}
        <View style={tw`flex-1 px-2 py-1 justify-evenly`}>
          <Text
            style={tw`font-avSemi text-gray-600 text-base`}
            numberOfLines={4}>
            {props?.title}
          </Text>
          <Text style={tw`font-avReg text-gray-500 text-sm`} numberOfLines={2}>
            {props?.body}
          </Text>
        </View>
        <View style={tw`py-2 pr-2`}>
          <Text style={tw`font-avReg text-gray-600 text-sm`}>
            {dayjs(parseInt(props?.createdAt, 10)).fromNow()}
          </Text>
        </View>
      </Pressable>
    </View>
  );
});

export default NotificationItem;
