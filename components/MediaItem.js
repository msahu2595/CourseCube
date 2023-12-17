import {tw} from '@lib';
import React, {memo} from 'react';
import MenuOptionItem from './MenuOptionItem';
import config from 'react-native-ultimate-config';
import {Dimensions, ImageBackground, Text, View} from 'react-native';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const urlRegex = /^http(s)?:\/\/.*/g;
const width = Dimensions.get('window').width;

const MediaItem = memo(({image, label, title, options}) => (
  <ImageBackground
    source={{
      uri: urlRegex.test(image)
        ? image
        : `${
            __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
          }/${image}`,
    }}
    resizeMode="cover"
    style={tw.style('justify-between bg-gray-600', {
      width: width / 2 - 6,
      aspectRatio: 16 / 9,
    })}>
    <View style={tw`justify-between flex-row`}>
      <Text style={tw`text-[10px] text-white p-1 bg-black bg-opacity-75`}>
        {label}
      </Text>
      {options ? (
        <Menu>
          <MenuTrigger style={tw`bg-black bg-opacity-75`}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={tw.color('white')}
            />
          </MenuTrigger>
          <MenuOptions style={tw`py-2`}>
            {options?.map(option => (
              <MenuOptionItem {...option} />
            ))}
          </MenuOptions>
        </Menu>
      ) : null}
    </View>
    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      style={tw`bg-black bg-opacity-75 text-[10px] px-1 py-2 text-white`}>
      {title}
    </Text>
  </ImageBackground>
));

export default MediaItem;
