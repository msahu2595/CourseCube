import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {gql, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {FollowItem, SafeAreaContainer} from '@components';
import {View, FlatList, Text, RefreshControl} from 'react-native';

const FOLLOWER_LIST = gql`
  query followerList($limit: Int, $offset: Int, $userId: ID) {
    followerList(limit: $limit, offset: $offset, userId: $userId) {
      code
      success
      message
      token
      limit
      offset
      payload {
        _id
        follower {
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

const FollowerListScreen = ({route}) => {
  const {loading, data, refetch, fetchMore} = useQuery(FOLLOWER_LIST, {
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
    ({item}) => <FollowItem {...item?.follower} />,
    [],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <FlatList
        bounces={true}
        //
        data={data?.followerList?.payload}
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
                  No one started following you yet.
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
              offset: data?.followerList?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default FollowerListScreen;
