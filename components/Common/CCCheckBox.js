import {tw} from '@lib';
import React from 'react';
import {Text, View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const CCCheckBox = ({label, required, ...rest}) => {
  return (
    <View style={tw`mb-1`}>
      <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
        {label}
        {required && <Text style={tw`text-red-600`}>*</Text>}
      </Text>

      <BouncyCheckbox
        size={25}
        fillColor="blue"
        unfillColor="#FFFFFF"
        text="Course is free"
        {...rest}
      />
    </View>
  );
};

export default CCCheckBox;
