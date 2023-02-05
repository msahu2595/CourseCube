import React from 'react';
import tw from '@lib/tailwind';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FollowUs = () => {
  return (
    <View style={tw.style('w-full h-40 ')}>
      <View style={tw`flex-1 bg-white mx-2 px-4 py-2 shadow rounded-lg`}>
        <Image
          source={require('@images/undraw_social_ideas-svg.png')}
          resizeMode="contain"
          style={tw.style(
            'absolute',
            'h-full',
            'bottom-2',
            'top-2',
            'right-2',
            {
              width: undefined,
              aspectRatio: 1,
            },
          )}
        />
        <Text style={tw`font-avSemi text-lg text-gray-600`}>
          You can also Follow us
        </Text>
        <Text style={tw`font-avReg text-sm text-gray-600 py-2 w-3/5`}>
          Get latest news, updates & notification by following us.
        </Text>
        <View style={tw`mt-2 flex-row`}>
          <TouchableOpacity
            style={tw.style(
              'mr-2',
              'rounded-lg',
              'items-center',
              'justify-center',
              {
                width: 36,
                height: 36,
                backgroundColor: '#DC2626',
              },
            )}>
            <MaterialCommunityIcons
              name="youtube"
              color={tw.color('white')}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style(
              'mr-2',
              'rounded-lg',
              'items-center',
              'justify-center',
              {
                width: 36,
                height: 36,
                backgroundColor: '#0088cc',
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
              'rounded-lg',
              'items-center',
              'justify-center',
              {
                width: 36,
                height: 36,
                backgroundColor: '#4267B2',
              },
            )}>
            <MaterialCommunityIcons
              name="facebook"
              color={tw.color('white')}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style(
              'mr-2',
              'rounded-lg',
              'items-center',
              'justify-center',
              {
                width: 36,
                height: 36,
                backgroundColor: '#1DA1F2',
              },
            )}>
            <MaterialCommunityIcons
              name="twitter"
              color={tw.color('white')}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style(
              'mr-2',
              'rounded-lg',
              'items-center',
              'justify-center',
              {
                width: 36,
                height: 36,
                backgroundColor: '#E1306C',
              },
            )}>
            <MaterialCommunityIcons
              name="instagram"
              color={tw.color('white')}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FollowUs;
