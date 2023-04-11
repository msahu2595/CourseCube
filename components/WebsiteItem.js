import tw from '@lib/tailwind';
import React, {memo, useCallback} from 'react';
import {showMessage} from 'react-native-flash-message';
import {View, Text, Linking, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WebsiteItem = memo(props => {
  const handlePressLink = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(props?.link);
      if (supported) {
        await Linking.openURL(props?.link);
      } else {
        showMessage({
          message: 'Sorry, link cannot be open.',
          type: 'danger',
        });
      }
    } catch (err) {
      showMessage({
        message: err?.message || 'Some unknown err occurred. Try again!!',
        type: 'danger',
      });
    }
  }, [props?.link]);

  return (
    <View style={tw`flex-1`}>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={tw`py-1 text-sm capitalize text-gray-600`}>
        {props?.name}
      </Text>
      <TouchableOpacity
        onPress={handlePressLink}
        style={tw`p-1 flex-row self-start bg-blue-100 items-center rounded`}>
        <MaterialCommunityIcons
          name="link-variant"
          color={tw.color('blue-600')}
          size={10}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={tw`text-[10px] px-1 text-gray-600`}>
          {props?.link}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default WebsiteItem;
