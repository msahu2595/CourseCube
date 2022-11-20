import tw from '@lib/tailwind';
import {BUNDLES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FullSyllabusCourseItem, SafeAreaContainer} from '@components';

const FullSyllabusCourseListScreen = () => {
  const {loading: queryLoading, data: queryData} = useQuery(BUNDLES, {
    variables: {filter: {type: 'FULL_COURSE'}},
  });

  const renderItem = useCallback(
    ({index, item}) => <FullSyllabusCourseItem index={index} {...item} />,
    [],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('white')}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.5, 1]}
        colors={[tw.color('white'), tw.color('white'), tw.color('white')]}
        style={tw`flex-1`}>
        <FlatList
          data={queryData?.bundles?.payload || []}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={tw`bg-white items-center`}
          ItemSeparatorComponent={() => <View style={tw`h-3`} />}
          ListHeaderComponent={() => <View style={tw`h-3`} />}
          ListFooterComponent={() => <View style={tw`h-8`} />}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default FullSyllabusCourseListScreen;
