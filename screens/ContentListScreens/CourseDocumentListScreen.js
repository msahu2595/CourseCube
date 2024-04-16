import tw from '@lib/tailwind';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {BUNDLE_CONTENTS} from '@queries';
import {View, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ContentItem, SafeAreaContainer} from '@components';

const CourseDocumentListScreen = ({navigation, route}) => {
  const {loading: queryLoading, data: queryData} = useQuery(BUNDLE_CONTENTS, {
    variables: {
      bundleId: route.params.bundleId,
      filter: {subjectId: route.params.subjectId, type: 'Document'},
    },
  });

  const handlePress = useCallback(
    ({contentId, contentTitle}) => {
      navigation?.navigate('CourseDocumentViewScreen', {
        bundleContentId: contentId,
        title: contentTitle,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({index, item}) => (
      <ContentItem
        index={index}
        color={'teal'}
        {...item}
        onPress={handlePress}
      />
    ),
    [handlePress],
  );

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
          data={queryData?.bundleContents?.payload || []}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={tw`px-2`}
          ItemSeparatorComponent={() => <View style={tw`h-2`} />}
          ListHeaderComponent={() => <View style={tw`h-2`} />}
          ListFooterComponent={() => <View style={tw`h-4`} />}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default CourseDocumentListScreen;
