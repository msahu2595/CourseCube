import React from 'react';
import tw from '@lib/tailwind';
import {ADVERTS} from '@queries';
import AdvertItem from './AdvertItem';
import {useQuery} from '@apollo/client';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

const AdvertBar = props => {
  const {loading: queryLoading, data: queryData} = useQuery(ADVERTS, {
    variables: {filter: {type: props?.type || 'TINY'}},
  });

  const renderItem = ({item}) => <AdvertItem {...item} />;

  if (queryData?.adverts?.payload?.length) {
    return (
      <SwiperFlatList
        index={0}
        autoplay
        autoplayLoop
        showPagination
        autoplayDelay={10}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        data={queryData?.adverts?.payload}
        paginationStyle={tw`items-end`}
        paginationStyleItemActive={tw`h-2 w-2`}
        paginationStyleItemInactive={tw`h-2 w-2`}
        contentContainerStyle={props?.containerStyle || tw`py-2`}
      />
    );
  }

  return null;
};

export default AdvertBar;
