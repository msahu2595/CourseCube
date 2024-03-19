import {tw} from '@lib';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const TreeItem = props => {
  const {
    text,
    onPress,
    onLongPress,
    rightImage,
    iconColor = tw.color('blue-700'),
  } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      onLongPress={onLongPress}
      style={tw.style({flex: 1}, 'py-2 flex-row items-center')}>
      {rightImage ? (
        <MaterialCommunityIcons
          name="book-open-page-variant-outline"
          size={20}
          color={iconColor}
        />
      ) : (
        <MaterialCommunityIcons
          name="play-box-multiple-outline"
          size={18}
          color={iconColor}
        />
      )}
      <Text
        style={tw`flex-1 pl-1 ${
          rightImage ? 'font-avSemi text-base' : 'font-avReg text-sm'
        } text-gray-900`}>
        {text}
      </Text>
      {rightImage && (
        <View style={tw`px-1`}>
          <MaterialCommunityIcons
            name="arrow-down-drop-circle-outline"
            size={20}
            color={iconColor}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
