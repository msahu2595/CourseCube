import React from 'react';
import tw from '@lib/tailwind';
import {View, FlatList} from 'react-native';
import ShortcutItem from './ShortcutItem';
import SHORTCUT_BAR_DATA from '@utils/shortcut_bar_data.json';

const ShortcutBar = props => {
  const renderItem = ({item, index}) => (
    <ShortcutItem index={index} {...item} />
  );
  return (
    <FlatList
      horizontal
      data={SHORTCUT_BAR_DATA}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={tw`bg-white`}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={tw`w-2`} />}
      ListHeaderComponent={() => <View style={tw`w-4`} />}
      ListFooterComponent={() => <View style={tw`w-4`} />}
    />
  );
};

export default ShortcutBar;
