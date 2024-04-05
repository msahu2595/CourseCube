import tw from '@lib/tailwind';
import {HEADLINES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {showMessage} from 'react-native-flash-message';
import {View, FlatList, RefreshControl} from 'react-native';
import {HeadlineItem, SafeAreaContainer} from '@components';

const HeadlineListScreen = () => {
  const {loading, data, refetch, fetchMore} = useQuery(HEADLINES, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    fetchPolicy: 'cache-and-network',
  });

  const _renderItem = useCallback(({item}) => <HeadlineItem {...item} />, []);

  return (
    <SafeAreaContainer>
      <FlatList
        bounces={true}
        //
        data={data?.headlines?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`py-2`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.headlines?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default HeadlineListScreen;
