import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, View} from 'react-native';

const InfoItem = memo(({label, value, inline = false}) =>
  value ? (
    <View
      style={tw`p-4 border-t border-gray-100 ${
        inline ? 'flex-row items-center' : ''
      }`}>
      <Text style={tw`text-sm font-avSemi text-gray-600`}>{label} : </Text>
      <Text
        style={tw`text-xs leading-5 font-avSemi tracking-wider text-gray-500 ${
          inline ? '' : 'pt-2'
        }`}>
        {value}
      </Text>
    </View>
  ) : null,
);

export default InfoItem;
