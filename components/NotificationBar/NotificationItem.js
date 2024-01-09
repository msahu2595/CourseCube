import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import tw from '@lib/tailwind';
import React, {memo} from 'react';
import openWebURL from 'utils/openWebURL';
import config from 'react-native-ultimate-config';

const NotificationItem = memo(({image, description, link}) => {
  const width = useWindowDimensions().width;
  return (
    <View style={tw.style('items-center', {width})}>
      <View
        style={tw.style('flex-row bg-gray-50 shadow-sm rounded-lg', {
          width: width - 16,
          height: undefined,
        })}>
        <ImageBackground
          resizeMode="cover"
          source={{
            uri: `${
              __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
            }/${image}`,
          }}
          style={tw.style('rounded-lg shadow-sm bg-gray-200', {
            width: 92,
            height: 92,
          })}
          imageStyle={tw.style('rounded-lg')}
        />
        <Text
          style={tw`flex-1 mx-2 font-avReg text-gray-600 text-sm`}
          numberOfLines={4}>
          {description}
        </Text>
        {!!link && (
          <TouchableOpacity
            onPress={() => openWebURL(link)}
            style={tw.style('justify-center bg-blue-700 rounded-r-lg', {
              height: 92,
            })}>
            <Text
              style={tw.style('font-avSemi text-gray-600 text-xs text-white', {
                transform: [{rotate: '270deg'}],
              })}>
              Link
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

export default NotificationItem;
