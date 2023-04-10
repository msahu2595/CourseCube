import tw from '@lib/tailwind';
import {ARTICLES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import {CurrentAffairItem, SafeAreaContainer} from '@components';

const CurrentAffairListScreen = () => {
  const {loading: queryLoading, data: queryData} = useQuery(ARTICLES);

  const renderItem = useCallback(
    ({item}) => <CurrentAffairItem {...item} />,
    [],
  );

  return (
    <SafeAreaContainer>
      <FlatList
        data={queryData?.articles?.payload || []}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={tw`py-2`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
      />
    </SafeAreaContainer>
  );
};

export default CurrentAffairListScreen;
