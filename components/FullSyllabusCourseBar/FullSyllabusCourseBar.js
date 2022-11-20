import tw from '@lib/tailwind';
import {BUNDLES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import FullSyllabusCourseItem from './FullSyllabusCourseItem';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FullSyllabusCourseBar = props => {
  const navigation = useNavigation();

  const {loading: queryLoading, data: queryData} = useQuery(BUNDLES, {
    variables: {filter: {type: 'FULL_COURSE'}},
  });

  const handleSeeAll = useCallback(() => {
    navigation.navigate('FullSyllabusCourseListScreen');
  }, [navigation]);

  const renderItem = useCallback(
    ({index, item}) => <FullSyllabusCourseItem index={index} {...item} />,
    [],
  );

  return (
    <View style={tw`py-3 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>
          {props.title}
        </Text>
        <TouchableOpacity
          onPress={handleSeeAll}
          style={tw`flex-row items-center`}>
          <Text
            style={tw.style('font-avSemi', 'text-gray-600', {fontSize: 10})}>
            SEE ALL
          </Text>
          <Icon name="chevron-right" size={16} color="#52525B" />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        renderItem={renderItem}
        keyExtractor={item => item._id}
        data={queryData?.bundles?.payload}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={tw`w-3`} />}
        ListHeaderComponent={() => <View style={tw`w-4`} />}
        ListFooterComponent={() => <View style={tw`w-4`} />}
        contentContainerStyle={tw`py-2`}
      />
    </View>
  );
};

export default FullSyllabusCourseBar;
