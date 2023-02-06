import tw from '@lib/tailwind';
import {CONTENTS} from '@queries';
import VideoItem from './VideoItem';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const VideoBar = ({title = 'Videos', filter = {}}) => {
  const navigation = useNavigation();

  const {loading: queryLoading, data: queryData} = useQuery(CONTENTS, {
    variables: {filter: {type: 'Video'}},
  });

  const handleSeeAll = useCallback(() => {
    navigation.navigate('VideoListScreen');
  }, [navigation]);

  const renderItem = ({index, item}) => <VideoItem index={index} {...item} />;

  return (
    <View style={tw`pt-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>{title}</Text>
        <TouchableOpacity
          onPress={handleSeeAll}
          style={tw`flex-row items-center`}>
          <Text
            style={tw.style('font-avSemi', 'text-gray-600', {fontSize: 10})}>
            SEE ALL
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color="#52525B"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={queryData?.contents?.payload}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`bg-white py-2`}
        ItemSeparatorComponent={() => <View style={tw`w-3`} />}
        ListHeaderComponent={() => <View style={tw`w-4`} />}
        ListFooterComponent={() => <View style={tw`w-4`} />}
      />
    </View>
  );
};

export default VideoBar;
