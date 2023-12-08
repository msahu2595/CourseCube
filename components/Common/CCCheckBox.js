import {tw} from '@lib';
import React, {memo} from 'react';
import {View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export const CCCheckBox = memo(
  ({label, color = 'blue-600', checked = false, onPress, style, ...rest}) => {
    return (
      <View style={tw.style('mt-2 mb-1', style)}>
        <BouncyCheckbox
          size={25}
          unfillColor={tw.color('white')}
          fillColor={tw.color(color)}
          text={label}
          isChecked={checked}
          onPress={onPress}
          textContainerStyle={tw`flex-1 ml-2`}
          textStyle={tw.style('text-xs font-avReg text-gray-600', {
            textDecorationLine: 'none',
          })}
          {...rest}
        />
      </View>
    );
  },
);
