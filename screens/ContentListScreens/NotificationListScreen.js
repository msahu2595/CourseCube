import tw from '@lib/tailwind';
import {HEADLINES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NotificationItem, SafeAreaContainer} from '@components';

const NotificationListScreen = () => {
  const {loading: queryLoading, data: queryData} = useQuery(HEADLINES);

  const renderItem = useCallback(
    ({item, index}) => <NotificationItem index={index} {...item} />,
    [],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('gray-300')}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.5, 1]}
        colors={[
          tw.color('gray-300'),
          tw.color('gray-200'),
          tw.color('gray-100'),
        ]}
        style={tw`flex-1`}>
        <FlatList
          data={queryData?.headlines?.payload || []}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          // contentContainerStyle={tw`bg-white`}
          // ItemSeparatorComponent={() => <View style={tw`h-3`} />}
          ListHeaderComponent={() => <View style={tw`h-2`} />}
          ListFooterComponent={() => <View style={tw`h-2`} />}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default NotificationListScreen;
