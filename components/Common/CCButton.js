import {tw} from '@lib';
import React from 'react';
import {memo} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';

export const CCButton = memo(({label, loading, ...rest}) => (
  <TouchableOpacity
    {...rest}
    style={tw`flex-row bg-blue-600 py-3 items-center justify-center rounded-lg `}>
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
));
