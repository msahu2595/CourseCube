import tw from '@lib/tailwind';
import {STATISTICS} from '@queries';
import React, {useCallback} from 'react';
import {loggedUserVar} from 'apollo/client';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect} from '@react-navigation/native';
import {useLazyQuery, useReactiveVar} from '@apollo/client';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const statistics = [
  {
    name: "Video's",
    icon: 'playcircleo',
    value: 'videos',
    type: 'Watched',
    screen: 'HistoryListScreen',
    params: {headerTitle: 'Watched Videos', subType: 'Video'},
  },
  {
    name: "PDF's",
    icon: 'pdffile1',
    value: 'documents',
    type: 'Read',
    screen: 'HistoryListScreen',
    params: {headerTitle: 'Read PDFs', subType: 'Document'},
  },
  {
    name: "Test's",
    icon: 'form',
    value: 'tests',
    type: 'Attempted',
    screen: 'HistoryListScreen',
    params: {headerTitle: 'Attempted Tests', subType: 'Test'},
  },
  {
    name: "Article's",
    icon: 'profile',
    value: 'articles',
    type: 'Read',
    screen: 'HistoryListScreen',
    params: {headerTitle: 'Read Articles', type: 'Article'},
  },
];

const UserStatistics = ({userId}) => {
  const navigation = useNavigation();

  const loggedUser = useReactiveVar(loggedUserVar);

  const [fetchStatistics, {loading, data}] = useLazyQuery(STATISTICS, {
    variables: userId ? {userId} : {},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    fetchPolicy: 'cache-and-network',
  });

  useFocusEffect(
    useCallback(() => {
      fetchStatistics();
    }, [fetchStatistics]),
  );

  const handleSeeAll = useCallback(() => {
    navigation.navigate('HistoryListScreen', {headerTitle: 'History'});
  }, [navigation]);

  const handleMenuPress = useCallback(
    (screen, params) => {
      navigation.navigate(screen, params);
    },
    [navigation],
  );

  const payload = data?.statistics?.payload || {
    videos: 0,
    tests: 0,
    documents: 0,
    articles: 0,
  };

  return (
    <View style={tw`py-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>Statistics</Text>
        {(!userId || userId === loggedUser?._id) && (
          <TouchableOpacity
            onPress={handleSeeAll}
            style={tw`flex-row items-center`}>
            <Text style={tw`font-avSemi text-gray-600 text-[10px]`}>
              SEE ALL
            </Text>
            <MaterialCommunityIcons
              size={16}
              color="#52525B"
              name="chevron-right"
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={tw`pt-2 flex-row flex-wrap items-center justify-evenly bg-white`}>
        {statistics.map(({name, icon, value, type, screen, params}) => {
          return (
            <TouchableOpacity
              disabled={userId && userId !== loggedUser?._id}
              onPress={() => (screen ? handleMenuPress(screen, params) : null)}
              key={icon}
              style={tw.style(
                'mb-2',
                'flex-row',
                'items-center',
                'justify-around',
                'bg-blue-50',
                'rounded-lg',
                'shadow-sm',
                {width: '44%'},
              )}>
              <View style={tw`flex-row items-center`}>
                <AntDesign name={icon} color={tw.color('blue-600')} size={16} />
                <Text style={tw`pl-2 font-avSemi text-black`}>{name}</Text>
              </View>
              <View style={tw`items-center pl-2 border-l border-gray-300`}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={tw.color('blue-600')}
                    style={tw`py-1`}
                  />
                ) : (
                  <Text style={tw`font-avSemi text-base text-blue-600`}>
                    {payload[value]}
                  </Text>
                )}
                <Text
                  style={tw.style('font-avSemi text-black text-[10px] pb-1')}>
                  {type}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default UserStatistics;
