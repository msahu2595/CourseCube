import React from 'react';
import tw from '@lib/tailwind';
import openWebURL from 'utils/openWebURL';
import {WHATSAPP_NUMBER} from 'utils/constants';
import {View, Text, Image, TouchableOpacity} from 'react-native';

const GetCallFromUs = () => {
  return (
    <View style={tw.style('w-full h-40 ')}>
      <View style={tw`flex-1 bg-white mx-2 px-4 py-2 shadow rounded-lg`}>
        <Image
          source={require('@images/undraw_get_a_call.png')}
          resizeMode="contain"
          style={tw.style('absolute', 'h-full', 'bottom-2', 'top-2', {
            width: undefined,
            aspectRatio: 1,
            right: -16,
          })}
        />
        <Text style={tw`font-avSemi text-lg text-gray-600`}>
          Have questions ?
        </Text>
        <Text style={tw`font-avReg text-sm text-gray-600 py-2 w-3/5`}>
          Get answers of all your questions over a phone call.
        </Text>
        <View style={tw`mt-2 flex-row`}>
          <TouchableOpacity
            onPress={() =>
              openWebURL(
                `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=Hi`,
                false,
              )
            }
            style={tw.style('px-4', 'py-2', 'rounded-lg', 'self-start', {
              backgroundColor: tw.color('green-600'),
            })}>
            <Text style={tw`font-avSemi text-xs text-white`}>
              Get a call from us
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GetCallFromUs;
