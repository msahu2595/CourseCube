import {tw} from '@lib';
import {TEST} from '@queries';
import {useQuery} from '@apollo/client';
import {SafeAreaContainer} from '@components';
import {CCSearchInput} from 'components/Common';
import React, {useCallback, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {Alert, FlatList, RefreshControl, Text, View} from 'react-native';

const AdminTestQuestionListScreen = ({route: {params}}) => {
  const [search, setSearch] = useState('');

  const {loading, data, refetch} = useQuery(TEST, {
    variables: {testId: params?.testId},
    onCompleted: ({test}) => {
      if (!test?.payload?.questions.length) {
        Alert.alert('Alert', 'No questions are added into this test.');
      }
    },
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

  const Item = useCallback(
    ({item}) => (
      <View>
        <Text>{item.question}</Text>
      </View>
    ),
    [],
  );

  console.log(data?.test?.payload);

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
        //
        data={data?.test?.payload?.questions}
        keyExtractor={item => item._id}
        renderItem={({item}) => <Item {...item} />}
        //
        contentContainerStyle={tw`px-1`}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
    </SafeAreaContainer>
  );
};

export default AdminTestQuestionListScreen;
