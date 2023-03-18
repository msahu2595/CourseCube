import {tw} from '@lib';
import React, {memo} from 'react';
import MenuOptionItem from './MenuOptionItem';
import {Dimensions, ImageBackground, Text, View} from 'react-native';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const width = Dimensions.get('window').width;

const MediaItem = memo(
  ({image, label, title, handleCreateContent, handleEdit, handleDelete}) => (
    <ImageBackground
      source={{
        uri: image,
      }}
      resizeMode="cover"
      style={tw.style('justify-between bg-gray-600', {
        width: width / 2 - 8,
        aspectRatio: 16 / 9,
      })}>
      <View style={tw`justify-between flex-row`}>
        <Text style={tw`text-xs text-white p-1 bg-black bg-opacity-75`}>
          {label}
        </Text>
        <Menu>
          <MenuTrigger style={tw`bg-black bg-opacity-75`}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={tw.color('white')}
            />
          </MenuTrigger>
          <MenuOptions style={tw`py-2`}>
            <MenuOptionItem
              positive
              label="Create content"
              onSelect={handleCreateContent}
            />
            <MenuOptionItem label="Edit" onSelect={handleEdit} />
            <MenuOptionItem danger label="Delete" onSelect={handleDelete} />
          </MenuOptions>
        </Menu>
      </View>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={tw`bg-black bg-opacity-75 text-xs px-1 py-2 text-white`}>
        {title}
      </Text>
    </ImageBackground>
  ),
);

export default MediaItem;
