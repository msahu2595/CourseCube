import tw from '@lib/tailwind';
import {CONTENTS} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import DocumentItem from './DocumentItem';
import {useNavigation} from '@react-navigation/native';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DocumentBar = ({title = 'Documents', filter = {}}) => {
  const navigation = useNavigation();

  const {loading, data: queryData} = useQuery(CONTENTS, {
    variables: {filter: {type: 'Document', ...filter}},
  });

  const handleSeeAll = useCallback(() => {
    navigation.navigate('DocumentListScreen');
  }, [navigation]);

  const renderItem = useCallback(({item}) => <DocumentItem {...item} />, []);

  return (
    <View style={tw`pt-4 pb-2 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>{title}</Text>
        <TouchableOpacity
          onPress={handleSeeAll}
          style={tw`flex-row items-center`}>
          <Text style={tw`font-avSemi text-gray-600 text-[10px]`}>SEE ALL</Text>
          <MaterialCommunityIcons
            size={16}
            color="#52525B"
            name="chevron-right"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        renderItem={renderItem}
        keyExtractor={item => item._id}
        data={queryData?.contents?.payload}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`bg-white py-2`}
        ListHeaderComponent={() => <View style={tw`w-2`} />}
        ListFooterComponent={() => <View style={tw`w-2`} />}
        ItemSeparatorComponent={() => <View style={tw`w-2`} />}
      />
    </View>
  );
};

export default DocumentBar;
