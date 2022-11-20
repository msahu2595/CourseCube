import React from 'react';
import tw from '@lib/tailwind';
import {CONTENTS} from '@queries';
import {useQuery} from '@apollo/client';
import DocumentItem from './DocumentItem';
import {View, Text, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DocumentBar = props => {
  const {loading: queryLoading, data: queryData} = useQuery(CONTENTS, {
    variables: {filter: {type: 'Document'}},
  });

  const renderItem = ({index, item}) => (
    <DocumentItem index={index} {...item} />
  );

  return (
    <View style={tw`pt-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>
          {props.title}
        </Text>
        <View style={tw`flex-row items-center`}>
          <Text
            style={tw.style('font-avSemi', 'text-gray-600', {fontSize: 10})}>
            SEE ALL
          </Text>
          <Icon name="chevron-right" size={16} color="#52525B" />
        </View>
      </View>
      <FlatList
        horizontal
        data={queryData?.contents?.payload}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={tw`bg-white py-2`}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={tw`w-3`} />}
        ListHeaderComponent={() => <View style={tw`w-4`} />}
        ListFooterComponent={() => <View style={tw`w-4`} />}
      />
    </View>
  );
};

export default DocumentBar;
