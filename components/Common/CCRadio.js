import {tw} from '@lib';
import React, {memo, useMemo} from 'react';
import {Text, View} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';

export const CCRadio = memo(
  ({label, required = false, value, error, touched, radio_props, ...rest}) => {
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
            formHorizontal={true}
            initial={initial}
            buttonColor={tw.color('blue-600')}
            selectedButtonColor={tw.color('blue-600')}
            radio_props={radio_props}
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
