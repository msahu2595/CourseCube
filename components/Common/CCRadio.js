import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, View} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';

export const CCRadio = memo(({label, required = false, ...rest}) => {
  return (
    <View style={tw`mb-1`}>
      <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
        {label}
        {required && <Text style={tw`text-red-600`}>*</Text>}
      </Text>
      <RadioForm
        initial={0}
        formHorizontal={true}
        buttonColor={tw.color('blue-600')}
        selectedButtonColor={tw.color('blue-600')}
        {...rest}
      />
    </View>
  );
});
