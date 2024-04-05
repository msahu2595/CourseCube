import {tw} from '@lib';
import {NOTIFICATIONS} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {NotificationItem, SafeAreaContainer} from '@components';

const NotificationScreen = ({route}) => {
  const {loading, data, refetch, fetchMore} = useQuery(NOTIFICATIONS, {
    variables: {filter: {type: route.params?.type || 'USER'}},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    fetchPolicy: 'cache-and-network',
  });

  const _renderItem = useCallback(
    ({item}) => <NotificationItem {...item} />,
    [],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color(route.params?.themeColor || 'blue-600')}
      statusBarStyle="light-content">
      <FlatList
        bounces={true}
        //
        data={data?.notifications?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.notifications?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default NotificationScreen;
