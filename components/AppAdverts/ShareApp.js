import React from 'react';
import tw from '@lib/tailwind';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ShareApp = () => {
  return (
    <View style={tw.style('w-full h-40 ')}>
      <View style={tw`flex-1 bg-white mx-2 px-4 py-2 shadow rounded-lg`}>
        <Image
          source={require('@images/undraw_share_link-svg.png')}
          resizeMode="contain"
          style={tw.style('absolute', 'h-4/5', 'right-0', 'top-4', 'bottom-4', {
            width: undefined,
            aspectRatio: 16 / 9,
          })}
        />
        <Text style={tw`font-avSemi text-lg text-gray-600`}>Share the App</Text>
        <Text style={tw`font-avReg text-sm text-gray-600 py-2 w-3/5`}>
          Let your friends know how much you enjoy this app.
        </Text>
        <View style={tw`mt-2 flex-row`}>
          <TouchableOpacity
            style={tw.style(
              'mr-2',
              'rounded-lg',
              'bg-green-500',
              'items-center',
              'justify-center',
              {
                width: 40,
                height: 36,
              },
            )}>
            <MaterialCommunityIcons
              name="whatsapp"
              color={tw.color('white')}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style(
              'mr-2',
              'bg-sky-500',
              'rounded-lg',
              'items-center',
              'justify-center',
              {
                width: 40,
                height: 36,
              },
            )}>
            <FontAwesome5Pro
              name="telegram-plane"
              color={tw.color('white')}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style(
              'mr-2',
              'bg-blue-500',
              'rounded-lg',
              'items-center',
              'justify-center',
              {
                width: 40,
                height: 36,
              },
            )}>
            <MaterialCommunityIcons
              name="link-variant"
              color={tw.color('white')}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ShareApp;
