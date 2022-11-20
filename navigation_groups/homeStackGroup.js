import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {View, TouchableOpacity, TextInput} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SearchScreen, PrepareExamScreen} from '@screens';
// Icon Import
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const homeStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerStyle: tw`bg-white`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('black'),
      }}>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={searchScreenOptions}
      />
      <Stack.Screen
        name="PrepareExamScreen"
        component={PrepareExamScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Prepare Exam',
          animation: 'slide_from_right',
        })}
      />
    </Stack.Group>
  );
};

export default homeStackGroup;

const searchScreenOptions = {
  animation: 'slide_from_bottom',
  header: ({navigation}) => (
    <View style={tw`h-14 px-4 flex-row bg-emerald-600 items-center`}>
      <View style={tw`flex-1 flex-row items-center bg-white rounded-lg shadow`}>
        <MaterialCommunityIcons
          name="magnify"
          size={28}
          color={tw.color('emerald-600')}
          style={tw`px-2`}
        />
        <TextInput
          style={tw.style(
            'py-1',
            'flex-1',
            'font-avReg',
            'text-base',
            'text-black',
            'rounded',
            {
              paddingVertical: 0,
            },
          )}
          returnKeyType="search"
          returnKeyLabel="Search"
          placeholder="Type search keyword here ..."
          placeholderTextColor={tw.color('gray-400')}
          onSubmitEditing={() => console.log('Pressed return key !!!')}
        />
      </View>
      <TouchableOpacity
        style={tw`pl-2`}
        onPress={() => navigation.goBack()}
        hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
        <MaterialCommunityIcons
          name="close"
          size={28}
          color={tw.color('white')}
        />
      </TouchableOpacity>
    </View>
  ),
};

//   header: ({navigation}) => (
//     <View style={tw`h-14 px-4 flex-row bg-white items-center`}>
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <AntDesign name="arrowleft" size={24} color={tw.color('black')} />
//       </TouchableOpacity>
//       <TextInput
//         style={tw.style(
//           'mx-2',
//           'py-1',
//           'px-3',
//           'flex-1',
//           'font-avReg',
//           'text-sm',
//           'text-black',
//           'rounded',
//           'border',
//           'border-black',
//           {
//             paddingVertical: 0,
//           },
//         )}
//         returnKeyType="search"
//         returnKeyLabel="Search"
//         placeholder="Type search keyword here ..."
//         placeholderTextColor={tw.color('gray-400')}
//         onSubmitEditing={() => console.log('Pressed return key !!!')}
//       />
//       <TouchableOpacity>
//         <AntDesign name="close" size={24} color={tw.color('gray-600')} />
//       </TouchableOpacity>
//     </View>
//   ),
