import tw from '@lib/tailwind';
import {useQuery} from '@apollo/client';
import {BUNDLE_CONTENTS} from '@queries';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import {View, FlatList, RefreshControl} from 'react-native';
import {SafeAreaContainer, CourseContentItem} from '@components';

const CourseDocumentListScreen = ({route}) => {
  const [search, setSearch] = useState('');

  const {loading, data, refetch, fetchMore} = useQuery(BUNDLE_CONTENTS, {
    variables: {
      bundleId: route.params?.bundleId,
      filter: {subjectId: route.params?.subjectId || null, type: 'Document'},
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    fetchPolicy: 'cache-and-network',
  });

  const onChangeSearchText = useCallback(
    text => {
      setSearch(text);
      if (text.length > 2) {
        refetch({search: text});
      } else {
        refetch({search: ''});
      }
    },
    [refetch],
  );

  const clearSearchText = useCallback(() => {
    setSearch('');
    refetch({search: ''});
  }, [refetch]);

  const _renderItem = useCallback(
    ({item}) => <CourseContentItem {...item} />,
    [],
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
        <CCSearchInput
          value={search}
          searching={loading}
          onChangeText={onChangeSearchText}
          onClear={clearSearchText}
        />
        <FlatList
          bounces={true}
          //
          data={data?.bundleContents?.payload}
          keyExtractor={item => item._id}
          renderItem={_renderItem}
          //
          contentContainerStyle={tw`px-1 pb-4`}
          ItemSeparatorComponent={() => <View style={tw`h-1`} />}
          //
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
          onEndReached={() => {
            fetchMore({
              variables: {
                offset: data?.bundleContents?.payload.length,
                limit: 10,
              },
            });
          }}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default CourseDocumentListScreen;
