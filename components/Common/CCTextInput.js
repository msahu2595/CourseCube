import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, TextInput, View} from 'react-native';

export const CCTextInput = memo(
  ({
    label,
    info,
    required = false,
    error,
    touched,
    editable = true,
    ...rest
  }) => (
    <View style={tw`mb-1`}>
      <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
        {label}
        {required && <Text style={tw`text-red-600`}>*</Text>}
      </Text>
      <TextInput
        editable={editable}
        autoCorrect={false}
        placeholderTextColor={tw.color('gray-400')}
        style={tw.style(
          `min-h-${
            rest?.multiline ? 10 * rest?.numberOfLines : 10
          } border border-gray-300 rounded-lg px-2 text-black ${
            !editable ? 'opacity-50' : ''
          }`,
          {
            textAlignVertical: rest?.multiline ? 'top' : 'center',
          },
        )}
        {...rest}
      />
      {info ? (
        <Text style={tw`text-[10px] text-gray-400 font-avReg p-1`}>{info}</Text>
      ) : null}
      {error && touched ? (
        <Text style={tw`text-sm text-red-600 font-avReg p-1`}>{error}</Text>
      ) : null}
    </View>
  ),
);
