import {tw} from '@lib';
import React from 'react';
import {Text, View} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';

const CCRadio = ({label, required = false, ...rest}) => {
  return (
    <View style={tw`mb-1`}>
      <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
        {label}
        {required && <Text style={tw`text-red-600`}>*</Text>}
      </Text>
      <View style={tw` `}>
        <RadioForm formHorizontal={true} initial={0} {...rest} />
      </View>
    </View>
  );
};

export default CCRadio;
