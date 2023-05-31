import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {gql, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {LeaderboardItem, SafeAreaContainer} from '@components';
import {View, FlatList, Text, RefreshControl} from 'react-native';

const WEEKLY_LEADERBOARD = gql`
  query weeklyLeaderboard($limit: Int, $offset: Int) {
    weeklyLeaderboard(limit: $limit, offset: $offset) {
      code
      success
      message
      token
      limit
      offset
      payload {
        __typename
        _id
        fullName
        gender
        picture
        followers
        activities
      }
    }
  }
`;

const LeaderboardScreen = () => {
  const {loading, data, refetch, fetchMore} = useQuery(WEEKLY_LEADERBOARD, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const _renderItem = useCallback(
    ({item, index}) => <LeaderboardItem index={index} {...item} />,
    [],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <FlatList
        bounces={true}
        //
        data={data?.weeklyLeaderboard?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        ListHeaderComponent={() => <View style={tw`h-2`} />}
        ListFooterComponent={() => <View style={tw`h-2`} />}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        ListEmptyComponent={
          loading
            ? null
            : () => (
                <Text style={tw`font-avReg text-[14px] text-black text-center`}>
                  Nothing to show yet.
                </Text>
              )
        }
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.weeklyLeaderboard?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default LeaderboardScreen;
