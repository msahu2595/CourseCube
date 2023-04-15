import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const CCIcon = memo(({icon, label}) => (
  <View style={tw`items-center py-2 w-[60px]`}>
    <AntDesign name={icon} size={20} color={tw.color('blue-600')} />
    {!!label && (
      <Text
        numberOfLines={1}
        style={tw`pt-1 font-avReg text-blue-600 text-[10px]`}>
        {label}
      </Text>
    )}
  </View>
));
