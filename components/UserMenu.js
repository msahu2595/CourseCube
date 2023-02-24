import React, {useCallback} from 'react';
import tw from '@lib/tailwind';
// import {gql, useQuery, useReactiveVar} from '@apollo/client';
import {Text, View, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
// import {loggedUserVar} from 'apollo/client';

const menu = [
  {name: 'My Courses', icon: 'book-open', screen: ''},
  {name: 'Downloads', icon: 'download', screen: 'AddVideosScreen'},
  {name: 'Bookmarks', icon: 'bookmark', screen: 'AddDocumentScreen'},
  {name: 'Payments', icon: 'credit-card', screen: 'AddTestScreen'},
  {name: 'Settings', icon: 'settings', screen: 'SettingsScreen'},
  {name: 'Help & Support', icon: 'headphones', screen: ''},
];

// const IS_LOGGED_IN = gql`
//   query IsUserLoggedIn {
//     me @client
//   }
// `;

const UserMenu = () => {
  // const {data} = useQuery(IS_LOGGED_IN);

  // const me = useReactiveVar(loggedUserVar);

  // console.log({data, me});

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
              onPress={() => handleMenuPress(screen)}
              key={icon}
              style={tw.style(
                'mb-2',
                'p-4',
                'flex-row',
                'items-center',
                'justify-center',
                'bg-blue-50',
                'rounded-lg',
                'shadow-sm',
                {width: '44%'},
              )}>
              <Feather
                name={icon}
                color={tw.color('blue-600')}
                size={16}
                style={tw`px-2`}
              />
              <Text style={tw`flex-1 text-center font-avSemi text-black`}>
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
