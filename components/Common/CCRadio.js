import {tw} from '@lib';
import {Text, View} from 'react-native';
import React, {memo, useMemo} from 'react';
import RadioForm from 'react-native-simple-radio-button';

export const CCRadio = memo(
  ({
    label,
    required = false,
    radio_props,
    value,
    horizontal = true,
    error,
    touched,
    ...rest
  }) => {
    const initial = useMemo(
      () => radio_props.findIndex(obj => obj.value === value),
      [radio_props, value],
    );

    return (
      <View style={tw`mb-1`}>
        {console.log(value)}
        <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
          {label}
          {required && <Text style={tw`text-red-600`}>*</Text>}
        </Text>
        <View style={tw`my-1`}>
          <RadioForm
            formHorizontal={horizontal}
            buttonColor={tw.color('blue-600')}
            selectedButtonColor={tw.color('blue-600')}
            radio_props={radio_props}
            initial={initial}
            {...rest}
          />
        </View>
        {error && touched ? (
          <Text style={tw`text-sm text-red-600 font-avReg p-1`}>{error}</Text>
        ) : null}
      </View>
    );
  },
);
