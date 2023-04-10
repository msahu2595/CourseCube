import tw from '@lib/tailwind';
import {ARTICLES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import CurrentAffairItem from './CurrentAffairItem';
import {useNavigation} from '@react-navigation/native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CurrentAffairBar = ({title}) => {
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
      <SwiperFlatList
        index={0}
        autoplay
        autoplayLoop
        autoplayDelay={10}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={tw`py-2`}
        data={queryData?.articles?.payload || []}
      />
    </View>
  );
};

export default CurrentAffairBar;
