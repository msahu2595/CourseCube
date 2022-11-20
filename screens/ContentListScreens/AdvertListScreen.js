import tw from '@lib/tailwind';
import {ADVERTS} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import {AdvertItem, SafeAreaContainer} from '@components';
import LinearGradient from 'react-native-linear-gradient';

const AdvertListScreen = () => {
  const {loading: queryLoading, data: queryData} = useQuery(ADVERTS);

  const renderItem = useCallback(({item}) => <AdvertItem {...item} />, []);

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('white')}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.5, 1]}
        colors={[tw.color('white'), tw.color('white'), tw.color('white')]}
        style={tw`flex-1`}>
        <FlatList
          renderItem={renderItem}
          keyExtractor={item => item._id}
          data={queryData?.adverts?.payload || []}
          ListHeaderComponent={() => <View style={tw`h-3`} />}
          ListFooterComponent={() => <View style={tw`h-8`} />}
          ItemSeparatorComponent={() => <View style={tw`h-3`} />}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default AdvertListScreen;
