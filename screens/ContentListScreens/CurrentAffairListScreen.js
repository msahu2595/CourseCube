import tw from '@lib/tailwind';
import {ARTICLES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {showMessage} from 'react-native-flash-message';
import {View, FlatList, RefreshControl} from 'react-native';
import {CurrentAffairItem, SafeAreaContainer} from '@components';

const CurrentAffairListScreen = () => {
  const {loading, data, refetch, fetchMore} = useQuery(ARTICLES, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    fetchPolicy: 'cache-and-network',
  });

  const _renderItem = useCallback(
    ({item}) => <CurrentAffairItem {...item} />,
    [],
  );

  return (
    <SafeAreaContainer>
      <FlatList
        bounces={true}
        //
        data={data?.articles?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`py-2 pb-4`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.articles?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default CurrentAffairListScreen;
