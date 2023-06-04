import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {Text, View, TouchableOpacity} from 'react-native';

const menu = [
  {name: 'My Courses', icon: 'book-open', screen: 'MyCoursesScreen'},
  {name: 'Downloads', icon: 'download', screen: 'DownloadListTopTabNavigator'},
  {name: 'Bookmarks', icon: 'bookmark', screen: 'BookmarkListTopTabNavigator'},
  {name: 'Payments', icon: 'credit-card', screen: 'PaymentsScreen'},
  {name: 'Settings', icon: 'settings', screen: 'SettingsScreen'},
  {name: 'Help & Support', icon: 'headphones', screen: 'HelpSupportScreen'},
];

const UserMenu = () => {
  const navigation = useNavigation();

  const handleMenuPress = useCallback(
    screen => {
      navigation.navigate(screen);
    },
    [navigation],
  );

  return (
    <View style={tw`py-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>Menu</Text>
      </View>
      <View
        style={tw`pt-2 flex-row flex-wrap items-center justify-evenly bg-white`}>
        {menu.map(({name, icon, screen}) => {
          return (
            <TouchableOpacity
              onPress={() => (screen ? handleMenuPress(screen) : null)}
              key={icon}
              style={tw.style(
                'mb-2',
                'py-4',
                'px-2',
                'flex-row',
                'items-center',
                'justify-center',
                'bg-blue-50',
                'rounded-lg',
                'shadow-sm',
                {width: '44%'},
              )}>
              <Feather
                size={16}
                name={icon}
                style={tw`px-2`}
                color={tw.color('blue-600')}
              />
              <Text
                numberOfLines={1}
                style={tw`flex-1 text-center font-avSemi text-black`}>
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default UserMenu;
