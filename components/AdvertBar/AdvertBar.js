import React from 'react';
import tw from '@lib/tailwind';
import {ADVERTS} from '@queries';
import {View} from 'react-native';
import AdvertItem from './AdvertItem';
import {useQuery} from '@apollo/client';
import {AdvertBarLoader} from 'components/Loaders';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

const AdvertBar = props => {
  const {loading: queryLoading, data: queryData} = useQuery(ADVERTS, {
    variables: {filter: {type: props?.type || 'TINY'}},
  });

  const renderItem = ({item}) => <AdvertItem {...item} />;

  return (
    <View>
      {queryLoading ? (
        <AdvertBarLoader type={props?.type} />
      ) : queryData?.adverts?.payload?.length ? (
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
      ) : null}
    </View>
  );
};

export default AdvertBar;
