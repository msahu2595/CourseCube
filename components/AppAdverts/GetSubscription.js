import React from 'react';
import tw from '@lib/tailwind';
import {View, Image, Text, TouchableOpacity} from 'react-native';

const GetSubscription = () => {
  return (
    <View style={tw.style('w-full h-48 ')}>
      <View style={tw`flex-1 bg-white mx-2 p-4 shadow rounded-lg`}>
        <Image
          source={require('@images/person_with_laptop.png')}
          resizeMode="contain"
          style={tw.style({
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: undefined,
            height: 176,
            aspectRatio: 1,
            opacity: 1,
          })}
        />
        <Text style={tw`font-avSemi text-lg text-gray-600`}>
          Start your Preparation
        </Text>
        <Text style={tw`font-avReg text-sm text-gray-600 py-2 w-3/5`}>
          Get subscription & unlock full access to all the powerful self study
          features.
        </Text>
        <TouchableOpacity
          style={tw`mt-2 px-3 py-2 bg-green-600 rounded-lg self-start`}>
          <Text style={tw`font-avSemi text-sm text-white`}>
            Get Subscription
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GetSubscription;
