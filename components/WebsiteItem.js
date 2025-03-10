import tw from '@lib/tailwind';
import React, {memo} from 'react';
import openWebURL from 'utils/openWebURL';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WebsiteItem = memo(props => {
  return (
    <View style={tw`flex-1`}>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={tw`py-1 text-sm text-gray-600`}>
        {props?.name}
      </Text>
      <TouchableOpacity
        onPress={() => openWebURL(props?.link)}
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
