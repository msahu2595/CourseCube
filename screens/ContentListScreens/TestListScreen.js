import tw from '@lib/tailwind';
import {CONTENTS} from '@queries';
import {useQuery} from '@apollo/client';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {TestItem, SafeAreaContainer} from '@components';
import {View, FlatList, RefreshControl, Dimensions} from 'react-native';

const columns = 2;
const width = Dimensions.get('window').width;
const itemWidth = columns
  ? width / columns - ((columns + 1) * 4) / columns
  : null;

const TestListScreen = () => {
  const [search, setSearch] = useState('');

  const {loading, data, refetch, fetchMore} = useQuery(CONTENTS, {
    variables: {filter: {type: 'Test'}},
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
    ({item}) => <TestItem {...item} columns={columns} width={itemWidth} />,
    [],
  );

  return (
    <SafeAreaContainer>
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
        data={data?.contents?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-1 pb-4`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={tw`h-1`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.contents?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default TestListScreen;
