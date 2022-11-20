import React from 'react';
import tw from '@lib/tailwind';
import {View, Text, Image, TouchableOpacity} from 'react-native';
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
              'px-2',
              'py-2',
              'rounded-lg',
              'self-start',
              {backgroundColor: '#DC2626'},
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
              'px-2',
              'py-2',
              'rounded-lg',
              'self-start',
              {backgroundColor: '#0088cc'},
            )}>
            <MaterialCommunityIcons
              name="telegram"
              color={tw.color('white')}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style(
              'mr-2',
              'px-2',
              'py-2',
              'rounded-lg',
              'self-start',
              {backgroundColor: '#4267B2'},
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
              'px-2',
              'py-2',
              'rounded-lg',
              'self-start',
              {backgroundColor: '#1DA1F2'},
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
              'px-2',
              'py-2',
              'rounded-lg',
              'self-start',
              {backgroundColor: '#E1306C'},
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
