import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, View} from 'react-native';

export const CCText = memo(({content, style}) => (
  <View style={[tw`mb-1`, style]}>
    <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>{content}</Text>
  </View>
));
