import tw from '@lib/tailwind';
import {getDownloads} from 'lib/fileHandler';
import {CCSearchInput} from 'components/Common';
import {showMessage} from 'react-native-flash-message';
import {DownloadItem, SafeAreaContainer} from '@components';
import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, FlatList, RefreshControl} from 'react-native';

const DownloadVideoListScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const fetchDownloads = useCallback(filter => {
    setLoading(true);
    getDownloads({type: 'Video', ...filter})
      .then(res => {
        setData(prevData =>
          prevData.length === filter?.offset ? prevData.concat(res) : res,
        );
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
        });
      });
  }, []);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const onChangeSearchText = useCallback(
    text => {
      setSearch(text);
      if (text.length > 2) {
        fetchDownloads({search: text});
      } else {
        fetchDownloads();
      }
    },
    [fetchDownloads],
  );

  const clearSearchText = useCallback(() => {
    setSearch('');
    fetchDownloads();
  }, [fetchDownloads]);

  const handleNavigate = useCallback(
    ({contentId, contentTitle, contentSubType}) => {
      switch (contentSubType) {
        case 'Video':
          navigation.navigate('DownloadVideoViewScreen', {
            contentId,
            title: contentTitle,
          });
          break;
        case 'Document':
          navigation.navigate('DownloadDocumentViewScreen', {
            contentId,
            title: contentTitle,
          });
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  const _renderItem = useCallback(
    ({item}) => {
      return (
        <DownloadItem
          {...item}
          createdAt={item?.createdAt}
          onPress={handleNavigate}
        />
      );
    },
    [handleNavigate],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="dark-content">
      <CCSearchInput
        value={search}
        searching={loading}
        onChangeText={onChangeSearchText}
        onClear={clearSearchText}
      />
      <FlatList
        bounces={true}
        //
        data={data}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`p-2 pb-4`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        ListEmptyComponent={
          loading
            ? null
            : () => (
                <Text style={tw`font-avReg text-[14px] text-black text-center`}>
                  Nothing to show yet.
                </Text>
              )
        }
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDownloads} />
        }
        onEndReached={() => {
          fetchDownloads({
            offset: data?.length,
            limit: 10,
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default DownloadVideoListScreen;
