import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, TextInput, View} from 'react-native';

export const CCTextInput = memo(
  ({label, required = false, errors, touched, ...rest}) => (
    <View style={tw`mb-1`}>
      <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
        {label}
        {required && <Text style={tw`text-red-600`}>*</Text>}
      </Text>
      <TextInput
        style={tw.style('border border-gray-300 rounded-lg px-2', {
          textAlignVertical: 'top',
        })}
        {...rest}
      />
      {errors.title && touched.title ? (
        <Text style={tw`text-sm text-red-600 font-avReg p-1`}>
          {errors.title}
        </Text>
      ) : null}
    </View>
  ),
);
