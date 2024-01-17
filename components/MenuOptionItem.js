import {tw} from '@lib';
import React, {memo} from 'react';
import {Text} from 'react-native';
import {MenuOption} from 'react-native-popup-menu';

const MenuOptionItem = memo(({label, onSelect, danger, positive, disabled}) => {
  return (
    <MenuOption
      style={tw.style('px-4 py-2', disabled && 'opacity-50')}
      onSelect={onSelect}
      disabled={disabled}>
      <Text
        style={tw`font-avSemi ${
          danger ? 'text-red-600' : positive ? 'text-blue-600' : 'text-gray-600'
        }`}>
        {label}
      </Text>
    </MenuOption>
  );
});

export default MenuOptionItem;
