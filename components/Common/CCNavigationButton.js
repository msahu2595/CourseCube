import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export const CCNavigationButton = memo(
  ({icon, name, disabled, style, onPress}) => (
    <TouchableOpacity
      key={`${name}-${icon}`}
      disabled={disabled}
      onPress={onPress}
      style={tw.style(
        'mb-4 p-4 flex-row items-center bg-blue-50 rounded-lg shadow-sm',
        style,
      )}>
      <Feather name={icon} color={tw.color('blue-600')} size={16} />
      <Text style={tw`flex-1 px-4 font-avSemi text-black`}>{name}</Text>
      <Feather name="chevron-right" color={tw.color('blue-600')} size={16} />
    </TouchableOpacity>
  ),
);
