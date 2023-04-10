import tw from '@lib/tailwind';
import {HEADLINES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import NotificationItem from './NotificationItem';
import {useNavigation} from '@react-navigation/native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {NotificationItemLoader} from 'components/Loaders';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationBar = ({title}) => {
  const navigation = useNavigation();

  const {loading: queryLoading, data: queryData} = useQuery(HEADLINES);

  const handleSeeAll = useCallback(() => {
    navigation.navigate('NotificationListScreen');
  }, [navigation]);

  const renderItem = useCallback(
    ({item}) => <NotificationItem {...item} />,
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
      {queryLoading ? (
        <NotificationItemLoader />
      ) : (
        <SwiperFlatList
          index={0}
          autoplay
          autoplayLoop
          autoplayDelay={10}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={tw`py-2`}
          data={queryData?.headlines?.payload || []}
        />
      )}
    </View>
  );
};

export default NotificationBar;
