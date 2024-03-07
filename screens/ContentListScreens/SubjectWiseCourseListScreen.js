import tw from '@lib/tailwind';
import {BUNDLES} from '@queries';
import {useQuery} from '@apollo/client';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {SubjectWiseCourseItem, SafeAreaContainer} from '@components';
import {View, Text, FlatList, Dimensions, RefreshControl} from 'react-native';

const columns = 1;
const type = 'SUBJECT_COURSE';
const width = Dimensions.get('window').width;
const itemWidth = columns
  ? width / columns - ((columns + 1) * 8) / columns
  : null;

const SubjectWiseCourseListScreen = () => {
  const [search, setSearch] = useState('');

  const {loading, data, refetch, fetchMore} = useQuery(BUNDLES, {
    variables: {filter: {type}},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const onChangeSearchText = useCallback(
    text => {
      console.log(text);
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
    ({item}) => <SubjectWiseCourseItem {...item} width={itemWidth} />,
    [],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('bg-green-200')}
      statusBarStyle="dark-content">
      <CCSearchInput
        value={search}
        searching={loading}
        onChangeText={onChangeSearchText}
        onClear={clearSearchText}
      />
      <FlatList
        bounces={true}
        numColumns={columns}
        //
        data={data?.bundles?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-2`}
        ItemSeparatorComponent={() => <View style={tw`h-1`} />}
        ListFooterComponent={() => (
          <View style={tw`py-4 items-center`}>
            <Text style={tw`text-xs text-gray-600 font-avSemi`}>
              {loading ? 'Loading...' : "That's all, we have got!!"}
            </Text>
          </View>
        )}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.bundles?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default SubjectWiseCourseListScreen;
