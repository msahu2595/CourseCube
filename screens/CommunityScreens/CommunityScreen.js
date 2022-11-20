import React, {useCallback} from 'react';
import tw from '@lib/tailwind';
import {QUESTIONS} from '@queries';
import {useQuery} from '@apollo/client';
import {View, FlatList} from 'react-native';
import {
  Fab,
  CommunityTagItem,
  CommunityPostItem,
  SafeAreaContainer,
} from '@components';
import COMMUNITY_TAG_DATA from '@utils/community_tag_data.json';

const CommunityScreen = ({navigation}) => {
  const {loading: queryLoading, data: queryData} = useQuery(QUESTIONS, {
    fetchPolicy: 'network-only',
  });

  const handleNavigation = useCallback(() => {
    navigation.navigate('CreatePostScreen');
  }, [navigation]);

  const renderTagItem = ({item, index}) => (
    <CommunityTagItem index={index} tag={item} />
  );

  const renderPostItem = ({item, index}) => (
    <CommunityPostItem index={index} {...item} />
  );

  console.log(queryLoading, queryData);

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('red-600')}
      statusBarStyle="light-content">
      <View>
        <FlatList
          horizontal
          data={COMMUNITY_TAG_DATA}
          renderItem={renderTagItem}
          keyExtractor={item => item}
          style={tw`bg-white`}
          contentContainerStyle={tw`py-2`}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`w-2`} />}
          ListHeaderComponent={() => <View style={tw`w-2`} />}
          ListFooterComponent={() => <View style={tw`w-2`} />}
        />
      </View>
      <FlatList
        data={queryData?.questions?.payload || []}
        renderItem={renderPostItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        ListHeaderComponent={() => <View style={tw`h-2`} />}
        ListFooterComponent={() => <View style={tw`h-2`} />}
      />
      <Fab
        iconName="plus"
        bgColor={tw.color('red-600')}
        onPress={handleNavigation}
      />
    </SafeAreaContainer>
  );
};

export default CommunityScreen;
