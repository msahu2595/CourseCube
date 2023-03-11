import {tw} from '@lib';
import React from 'react';
import {memo} from 'react';
import {Text, TouchableOpacity} from 'react-native';

export const CCButton = memo(({label, ...rest}) => (
  <TouchableOpacity
    {...rest}
    style={tw`bg-blue-600 py-3 items-center rounded-lg`}>
    <Text style={tw`text-sm text-white font-avReg`}>{label}</Text>
  </TouchableOpacity>
));
