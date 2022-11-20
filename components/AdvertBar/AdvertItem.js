import {
  View,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import tw from '@lib/tailwind';
import {useNavigation} from '@react-navigation/core';

const AdvertItem = props => {
  const navigation = useNavigation();
  const width = useWindowDimensions().width;
  return (
    <View style={tw.style('px-2', 'rounded-lg', {width})}>
      <Pressable onPress={() => navigation.navigate('AdvertListScreen')}>
        <ImageBackground
          source={{uri: props?.image}}
          resizeMode="cover"
          imageStyle={tw`rounded-lg`}
          style={tw.style('bg-white', 'rounded-lg', 'shadow', {
            height: undefined,
            width: width - 16,
            aspectRatio:
              props?.type === 'SMALL'
                ? 2.5 / 1
                : props?.type === 'MEDIUM'
                ? 16 / 9
                : props?.type === 'LARGE'
                ? 1 / 1
                : 4 / 1,
          })}
        />
      </Pressable>
    </View>
  );
};

export default AdvertItem;
