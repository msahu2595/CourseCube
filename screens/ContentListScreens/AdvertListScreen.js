import tw from '@lib/tailwind';
import {ADVERTS} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {showMessage} from 'react-native-flash-message';
import {AdvertItem, SafeAreaContainer} from '@components';
import LinearGradient from 'react-native-linear-gradient';
import {View, FlatList, RefreshControl} from 'react-native';

const AdvertListScreen = () => {
  const {loading, data, refetch, fetchMore} = useQuery(ADVERTS, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  const _renderItem = useCallback(({item}) => <AdvertItem {...item} />, []);

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('white')}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.5, 1]}
        colors={[tw.color('white'), tw.color('white'), tw.color('white')]}
        style={tw`flex-1`}>
        <FlatList
          bounces={true}
          //
          data={data?.adverts?.payload}
          keyExtractor={item => item._id}
          renderItem={_renderItem}
          //
          ListHeaderComponent={() => <View style={tw`h-3`} />}
          ListFooterComponent={() => <View style={tw`h-8`} />}
          ItemSeparatorComponent={() => <View style={tw`h-3`} />}
          //
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
          onEndReached={() => {
            fetchMore({
              variables: {
                offset: data?.adverts?.payload.length,
                limit: 10,
              },
            });
          }}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default AdvertListScreen;
