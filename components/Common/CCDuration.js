import {tw} from '@lib';
import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {TimePicker} from 'react-native-simple-time-picker';

export const CCDuration = memo(
  ({label, required = false, error, touched, ...rest}) => (
    <View style={tw`mb-1`}>
      <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
        {label}
        {required && <Text style={tw`text-red-600`}>*</Text>}
      </Text>
      <View style={tw`border border-gray-300 rounded-lg`}>
        <TimePicker
          maxHours={5}
          minutesInterval={5}
          hoursUnit="Hours"
          minutesUnit="Minutes"
          textColor={tw.color('black')}
          {...rest}
        />
      </View>
      {error && touched ? (
        <Text style={tw`text-sm text-red-600 font-avReg p-1`}>{error}</Text>
      ) : null}
    </View>
  ),
);
