import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import ContentItem from 'components/ContentItem';
import {useNavigation} from '@react-navigation/core';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, FlatList, Pressable, RefreshControl} from 'react-native';

const HISTORY = gql`
  query history($limit: Int, $offset: Int, $filter: HistoryFilterInput) {
    history(limit: $limit, offset: $offset, filter: $filter) {
      code
      success
      message
      token
      limit
      offset
      filter {
        userId
        type
        subType
      }
      payload {
        __typename
        _id
        ref {
          ... on BundleContent {
            __typename
            _id
            subject
            image
            title
            type
          }
          ... on Content {
            __typename
            _id
            subject
            title
            image
            type
          }
          ... on Article {
            __typename
            _id
            subject
            image
            title
          }
        }
        type
        subType
        visible
        createdAt
        updatedAt
      }
    }
  }
`;

const horizontal = true;

const HistoryBar = props => {
  const navigation = useNavigation();

  const [fetchHistory, {loading, data, refetch, fetchMore}] = useLazyQuery(
    HISTORY,
    {
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
        });
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory]),
  );

  const handleNavigation = useCallback(() => {
    navigation.navigate('HistoryListScreen', {headerTitle: 'History'});
  }, [navigation]);

  const handlePress = useCallback(
    ({contentId, contentTitle, contentType, contentSubType}) => {
      switch (contentType) {
        case 'Content':
          switch (contentSubType) {
            case 'Video':
              navigation.navigate('VideoViewScreen', {contentId});
              break;
            case 'Test':
              navigation.navigate('TestViewScreen', {
                contentId,
                title: contentTitle,
              });
              break;
            case 'Document':
              navigation.navigate('DocumentViewScreen', {
                contentId,
                title: contentTitle,
              });
              break;
            default:
              break;
          }
          break;
        case 'BundleContent':
          switch (contentSubType) {
            case 'Video':
              navigation.navigate('CourseVideoViewScreen', {
                bundleContentId: contentId,
              });
              break;
            case 'Test':
              navigation.navigate('CourseTestViewScreen', {
                bundleContentId: contentId,
                title: contentTitle,
              });
              break;
            case 'Document':
              navigation.navigate('CourseDocumentViewScreen', {
                bundleContentId: contentId,
                title: contentTitle,
              });
              break;
            default:
              break;
          }
          break;
        case 'Article':
          navigation.navigate('CurrentAffairViewScreen', {
            articleId: contentId,
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
    ({item}) => (
      <ContentItem
        {...item?.ref}
        createdAt={item?.createdAt}
        horizontal={horizontal}
        onPress={handlePress}
      />
    ),
    [handlePress],
  );

  if (!data?.history?.payload?.length) {
    return null;
  }

  return (
    <View style={tw`py-2 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>
          {props.title}
        </Text>
        <Pressable onPress={handleNavigation} style={tw`flex-row items-center`}>
          <Text
            style={tw.style('font-avSemi', 'text-gray-600', {fontSize: 10})}>
            SEE ALL
          </Text>
          <Icon name="chevron-right" size={16} color="#52525B" />
        </Pressable>
      </View>
      <FlatList
        bounces={true}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        //
        data={data?.history?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`bg-white pt-2`}
        ItemSeparatorComponent={() => <View style={tw`w-3`} />}
        ListHeaderComponent={() => <View style={tw`w-4`} />}
        ListFooterComponent={() => <View style={tw`w-4`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.history?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </View>
  );
};

export default HistoryBar;
