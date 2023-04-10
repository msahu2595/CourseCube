import {
  View,
  Text,
  Linking,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import tw from '@lib/tailwind';
import React, {memo, useCallback} from 'react';

const NotificationItem = memo(({image, description, link}) => {
  const width = useWindowDimensions().width;

  const handleLink = useCallback(async () => {
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    }
  }, [link]);

  return (
    <View style={tw.style('items-center', {width})}>
      <View
        style={tw.style('flex-row bg-gray-50 shadow-sm rounded-lg', {
          width: width - 16,
          height: undefined,
        })}>
        <ImageBackground
          resizeMode="cover"
          source={{uri: image}}
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
            onPress={handleLink}
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
