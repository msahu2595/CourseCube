import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const CCIcon = memo(
  ({icon, label, color = 'blue-600', size = 20, IconComponent = AntDesign}) => (
    <View style={tw`items-center py-2 w-[60px]`}>
      <IconComponent name={icon} size={size} color={tw.color(color)} />
      {!!label && (
        <Text
          numberOfLines={1}
          style={tw`pt-1 font-avReg text-${color} text-[9px]`}>
          {label}
        </Text>
      )}
    </View>
  ),
);
