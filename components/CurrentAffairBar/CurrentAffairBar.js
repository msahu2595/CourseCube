import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, TouchableOpacity} from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import React, {useCallback} from 'react';
import tw from '@lib/tailwind';
import {ARTICLES} from '@queries';
import {useQuery} from '@apollo/client';
import CurrentAffairItem from './CurrentAffairItem';
import {useNavigation} from '@react-navigation/native';

const CurrentAffairBar = props => {
  const navigation = useNavigation();

  const {loading: queryLoading, data: queryData} = useQuery(ARTICLES);

  const handleSeeAll = useCallback(() => {
    navigation.navigate('CurrentAffairListScreen');
  }, [navigation]);

  const renderItem = useCallback(
    ({item}) => <CurrentAffairItem {...item} />,
    [],
  );

  return (
    <View style={tw`py-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
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
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color="#52525B"
          />
        </TouchableOpacity>
      </View>
      <SwiperFlatList
        index={0}
        autoplay
        autoplayLoop
        autoplayDelay={10}
        data={queryData?.articles?.payload || []}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={tw`mt-2`}
      />
    </View>
  );
};

export default CurrentAffairBar;
