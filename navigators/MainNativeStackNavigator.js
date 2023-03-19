import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  adminStackGroup,
  authStackGroup,
  tabStackGroup,
  homeStackGroup,
  myProfileStackGroup,
  communityStackGroup,
  contentListStackGroup,
  contentViewStackGroup,
  userMenuStackGroup,
  settingStackGroup,
} from '@navigation_groups';
import {isLoggedInVar} from 'apollo/client';
import {useReactiveVar} from '@apollo/client';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const MainNativeStackNavigator = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const me = useReactiveVar(isLoggedInVar);
  const [user, setUser] = useState();

  console.log({me});
  (async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      console.log('token', value);
    } catch (e) {
      // read error
      console.log('Error...');
    }
  })();

  // Handle user state changes
  function onAuthStateChanged(newUser) {
    setUser(newUser);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <Stack.Navigator>
      {!user ? (
        authStackGroup()
      ) : (
        <React.Fragment>
          {adminStackGroup()}
          {tabStackGroup()}
          {homeStackGroup()}
          {myProfileStackGroup()}
          {communityStackGroup()}
          {contentListStackGroup()}
          {contentViewStackGroup()}
          {userMenuStackGroup()}
          {settingStackGroup()}
        </React.Fragment>
      )}
    </Stack.Navigator>
  );
};

export default MainNativeStackNavigator;

// const MainNativeStackNavigator = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerTintColor: tw.color('black'),
//       }}>
//       <Stack.Screen
//         name="Tab"
//         component={MainBottomTabNavigator}
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Stack.Group>
//         <Stack.Screen
//           name="CourseDetail"
//           component={ContentDetailTopTabNavigator}
//           options={{
//             headerShown: true,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             title: 'Full Syllabus Course',
//             headerStyle: tw`bg-green-200`,
//             headerTitleStyle: tw`font-avSemi`,
//             headerShadowVisible: false,
//           }}
//         />
//         <Stack.Screen
//           name="CourseContent"
//           component={ContentListTopTabNavigator}
//           options={{
//             headerShown: true,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             title: 'प्राचीन काल',
//             headerStyle: tw`bg-green-200`,
//             headerTitleStyle: tw`font-avSemi`,
//             headerShadowVisible: false,
//           }}
//         />
//         <Stack.Screen
//           name="VideoView"
//           component={VideoViewScreen}
//           options={{
//             headerShown: false,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             title: 'Free Classes',
//             headerStyle: tw`bg-sky-200`,
//             headerTitleStyle: tw`font-avSemi`,
//             headerShadowVisible: false,
//             // Fix for react-native-video
//             orientation: 'portrait_up',
//           }}
//         />
//         <Stack.Screen
//           name="TestView"
//           component={TestViewScreen}
//           options={{
//             headerShown: true,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             title: 'CGPSC Test Series',
//             headerStyle: tw`bg-amber-200`,
//             headerTitleStyle: tw`font-avSemi`,
//             headerShadowVisible: false,
//           }}
//         />
//         <Stack.Screen
//           name="PDFView"
//           component={DocumentViewScreen}
//           options={{
//             headerShown: true,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             title: 'CGVYAPAM RI',
//             headerStyle: tw`bg-teal-600`,
//             headerTitleStyle: tw`font-avSemi`,
//             headerShadowVisible: false,
//             headerTintColor: tw.color('white'),
//             headerRight: () => {
//               return (
//                 <>
//                   <TouchableOpacity style={tw`pl-2`}>
//                     <MaterialCommunityIcons
//                       name="bookmark-outline"
//                       size={28}
//                       color={tw.color('white')}
//                     />
//                   </TouchableOpacity>
//                   <TouchableOpacity style={tw`pl-2`}>
//                     <MaterialCommunityIcons
//                       name="share-outline"
//                       size={28}
//                       color={tw.color('white')}
//                     />
//                   </TouchableOpacity>
//                 </>
//               );
//             },
//           }}
//         />
//         <Stack.Screen
//           name="Leaderboard"
//           component={LeaderboardScreen}
//           options={{
//             headerShown: true,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             // title: 'CGPSC Test Series',
//             // headerStyle: tw`bg-red-200`,
//             // headerTitleStyle: tw`font-avSemi`,
//             // headerShadowVisible: false,
//           }}
//         />
//         <Stack.Screen
//           name="Profile"
//           component={ProfileScreen}
//           options={{
//             headerShown: true,
//             headerShadowVisible: false,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             headerTitle: 'Profile',
//             headerStyle: tw`bg-blue-600`,
//             headerTitleStyle: tw`font-avSemi`,
//             headerTintColor: tw.color('white'),
//           }}
//         />
//         <Stack.Screen
//           name="CreatePost"
//           component={CreatePostScreen}
//           options={{
//             headerShown: true,
//             headerShadowVisible: false,
//             animation: 'slide_from_bottom',
//             // Tab Header Props
//             title: 'Create Post',
//             headerStyle: tw`bg-red-600`,
//             headerTitleStyle: tw`font-avSemi`,
//             headerTintColor: tw.color('white'),
//           }}
//         />
//         <Stack.Screen
//           name="ContactUs"
//           component={ContactUsScreen}
//           options={{
//             headerShown: true,
//             headerShadowVisible: false,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             title: 'Contact Us',
//             headerStyle: tw`bg-white`,
//             headerTitleStyle: tw`font-avSemi`,
//             headerTintColor: tw.color('black'),
//           }}
//         />
//         <Stack.Screen
//           name="FollowTopTab"
//           component={FollowListTopTabBar}
//           options={{
//             headerShown: true,
//             headerShadowVisible: false,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             title: 'Bhavesh Gajpal',
//             headerStyle: tw`bg-blue-600`,
//             headerTitleStyle: tw`font-avSemi`,
//             headerTintColor: tw.color('white'),
//           }}
//         />
//         <Stack.Screen
//           name="Search"
//           component={SearchScreen}
//           options={{
//             headerShown: true,
//             headerShadowVisible: false,
//             animation: 'slide_from_right',
//             // Tab Header Props
//             // title: 'Search',
//             // headerStyle: tw`bg-white`,
//             // headerTitleStyle: tw`font-avSemi`,
//             // headerTintColor: tw.color('gray-600'),
//             // header: () => (
//             //   <View style={tw`border bg-white`}>
//             //     <TextInput />
//             //   </View>
//             // ),
//             header: ({navigation}) => (
//               <View style={tw`flex-row bg-white items-center px-4 py-2`}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                   <AntDesign
//                     name="arrowleft"
//                     size={24}
//                     color={tw.color('black')}
//                   />
//                 </TouchableOpacity>
//                 <TextInput
//                   style={tw.style(
//                     'mx-2',
//                     'py-1',
//                     'px-3',
//                     'flex-1',
//                     'font-avReg',
//                     'text-sm',
//                     'text-black',
//                     'rounded',
//                     'border',
//                     'border-black',
//                     {
//                       paddingVertical: 0,
//                     },
//                   )}
//                   returnKeyType="search"
//                   returnKeyLabel="Search"
//                   placeholder="Type search keyword here ..."
//                   placeholderTextColor={tw.color('gray-400')}
//                   onSubmitEditing={() => console.log('Pressed return key !!!')}
//                 />
//                 {/* <TouchableOpacity>
//                       <AntDesign
//                         name="close"
//                         size={24}
//                         color={tw.color('gray-600')}
//                       />
//                     </TouchableOpacity> */}
//               </View>
//             ),
//           }}
//         />
//       </Stack.Group>
//     </Stack.Navigator>
//   );
// };
