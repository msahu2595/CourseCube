import React from 'react';
import tw from '@lib/tailwind';
import {Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import COLOR_GRADIENTS from '@utils/color_gradients';

const ShortcutItem = ({index, icon, firstName, lastName, screen}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => (screen ? navigation.navigate(screen) : null)}
      style={tw.style('py-4', 'justify-center', 'items-center', {width: 80})}>
      <LinearGradient
        colors={[COLOR_GRADIENTS[index][50], COLOR_GRADIENTS[index][100]]}
        style={tw.style(
          'shadow-sm',
          'rounded-full',
          'justify-center',
          'items-center',
          {
            height: 54,
            width: 54,
          },
        )}>
        <AntDesign name={icon} color={COLOR_GRADIENTS[index][600]} size={24} />
      </LinearGradient>
      <Text
        style={tw`font-avSemi text-gray-600 text-xs text-center mt-2`}
        numberOfLines={1}>
        {firstName}
      </Text>
      <Text
        style={tw`font-avSemi text-gray-600 text-xs text-center`}
        numberOfLines={1}>
        {lastName}
      </Text>
    </Pressable>
  );
};

export default ShortcutItem;
