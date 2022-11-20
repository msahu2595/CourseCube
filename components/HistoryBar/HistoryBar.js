import React from 'react';
import tw from '@lib/tailwind';
import {View, Text, FlatList, Pressable} from 'react-native';
import HistoryItem from './HistoryItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HISTORY_BAR_DATA from '@utils/history_bar_data.json';
import {useNavigation} from '@react-navigation/core';

const HistoryBar = props => {
  const navigation = useNavigation();
  const renderItem = ({index, item}) => <HistoryItem index={index} {...item} />;

  if (!HISTORY_BAR_DATA?.length) {
    return null;
  }

  return (
    <View style={tw`py-2 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>
          {props.title}
        </Text>
        <Pressable
          onPress={() => navigation.navigate('HistoryListScreen')}
          style={tw`flex-row items-center`}>
          <Text
            style={tw.style('font-avSemi', 'text-gray-600', {fontSize: 10})}>
            SEE ALL
          </Text>
          <Icon name="chevron-right" size={16} color="#52525B" />
        </Pressable>
      </View>
      <FlatList
        horizontal
        data={HISTORY_BAR_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`bg-white pt-2`}
        ItemSeparatorComponent={() => <View style={tw`w-3`} />}
        ListHeaderComponent={() => <View style={tw`w-4`} />}
        ListFooterComponent={() => <View style={tw`w-4`} />}
      />
    </View>
  );
};

export default HistoryBar;
