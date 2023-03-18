import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export const CCCheckBox = memo(({label, required, ...rest}) => {
  return (
    <View style={tw`mb-1`}>
      {label && (
        <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
          {label}
          {required && <Text style={tw`text-red-600`}>*</Text>}
        </Text>
      )}
      <View style={tw`my-2 `}>
        <BouncyCheckbox
          size={25}
          fillColor={tw.color('blue-600')}
          unfillColor={tw.color('white')}
          {...rest}
        />
      </View>
    </View>
  );
});
