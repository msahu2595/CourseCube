import tw from '@lib/tailwind';
import {CONTENTS} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ContentItem, SafeAreaContainer} from '@components';

const VideoListScreen = ({navigation, route}) => {
  const {loading: queryLoading, data: queryData} = useQuery(CONTENTS, {
    variables: {filter: {type: 'Video'}},
  });

  const handlePress = useCallback(
    contentId => {
      navigation?.navigate('VideoViewScreen', {contentId});
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({index, item}) => (
      <ContentItem
        index={index}
        color="indigo"
        {...item}
        handlePress={handlePress}
      />
    ),
    [handlePress],
  );

  console.log(queryLoading, queryData);

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('green-200')}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color('green-200'),
          tw.color('green-50'),
          tw.color('white'),
        ]}
        style={tw`flex-1`}>
        <FlatList
          data={queryData?.contents?.payload || []}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          // contentContainerStyle={tw`bg-white`}
          ItemSeparatorComponent={() => <View style={tw`h-3`} />}
          ListHeaderComponent={() => <View style={tw`h-4`} />}
          ListFooterComponent={() => <View style={tw`h-4`} />}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default VideoListScreen;
