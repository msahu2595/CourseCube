import React from 'react';
import tw from '@lib/tailwind';
import {View, FlatList} from 'react-native';
import {ContentItem, SafeAreaContainer} from '@components';
import LinearGradient from 'react-native-linear-gradient';
import DOWNLOAD_CONTENT_DATA from '@utils/download_content_data.json';

const DownloadListScreen = () => {
  const renderItem = ({index, item}) => <ContentItem index={index} {...item} />;
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
          data={DOWNLOAD_CONTENT_DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          // contentContainerStyle={tw`bg-white`}
          ItemSeparatorComponent={() => <View style={tw`h-3`} />}
          ListHeaderComponent={() => <View style={tw`h-4`} />}
          ListFooterComponent={() => <View style={tw`h-4`} />}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default DownloadListScreen;
