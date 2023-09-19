import {tw} from '@lib';
import React from 'react';
import {memo} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';

export const CCButton = memo(
  ({label, color = 'blue-600', loading, style, ...rest}) => (
    <TouchableOpacity
      {...rest}
      style={tw.style(
        `flex-row bg-${color} opacity-${
          rest?.disabled ? 50 : 100
        } py-3 items-center justify-center rounded-lg`,
        style,
      )}>
      <Text style={tw`text-sm text-white font-avReg`}>{label}</Text>
      {loading && (
        <ActivityIndicator
          size="small"
          animating={true}
          color={tw.color('white')}
          style={tw`mx-2`}
        />
      )}
    </TouchableOpacity>
  ),
);
