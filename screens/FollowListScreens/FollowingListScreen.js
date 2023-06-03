import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {gql, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {FollowItem, SafeAreaContainer} from '@components';
import {View, FlatList, Text, RefreshControl} from 'react-native';

const FOLLOWING_LIST = gql`
  query followingList($userId: ID, $limit: Int, $offset: Int) {
    followingList(userId: $userId, limit: $limit, offset: $offset) {
      code
      success
      message
      token
      limit
      offset
      payload {
        __typename
        _id
        following {
          __typename
          _id
          fullName
          gender
          picture
          followers
          activities
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const FollowingListScreen = ({route}) => {
  const {loading, data, refetch, fetchMore} = useQuery(FOLLOWING_LIST, {
    variables: route?.params?.userId ? {userId: route?.params?.userId} : {},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    fetchPolicy: 'cache-and-network',
  });

  const _renderItem = useCallback(
    ({item}) => <FollowItem {...item?.following} />,
    [],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <FlatList
        bounces={true}
        //
        data={data?.followingList?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`bg-white py-2`}
        ListHeaderComponent={() => <View style={tw`h-2`} />}
        ListFooterComponent={() => <View style={tw`h-2`} />}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        ListEmptyComponent={
          loading
            ? null
            : () => (
                <Text style={tw`font-avReg text-[14px] text-black text-center`}>
                  You are not started following anyone yet.
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
              offset: data?.followingList?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default FollowingListScreen;
