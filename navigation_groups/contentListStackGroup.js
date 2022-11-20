import React from 'react';
import tw from '@lib/tailwind'; //Tailwind Imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AdvertListScreen,
  HistoryListScreen,
  FullSyllabusCourseListScreen,
  VideoListScreen,
  TestListScreen,
  DocumentListScreen,
  NotificationListScreen,
  SubjectWiseCourseListScreen,
  PrepareExamListScreen,
  CurrentAffairListScreen,
  DownloadListScreen,
  WebsiteListScreen,
  PostListScreen,
} from '@screens';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const contentListStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerStyle: tw`bg-white`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('black'),
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="AdvertListScreen"
        component={AdvertListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Advertisements',
        })}
      />
      <Stack.Screen
        name="HistoryListScreen"
        component={HistoryListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'History',
        })}
      />
      <Stack.Screen
        name="FullSyllabusCourseListScreen"
        component={FullSyllabusCourseListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Full Syllabus Courses',
        })}
      />
      <Stack.Screen
        name="VideoListScreen"
        component={VideoListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Videos',
        })}
      />
      <Stack.Screen
        name="TestListScreen"
        component={TestListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Tests',
        })}
      />
      <Stack.Screen
        name="DocumentListScreen"
        component={DocumentListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Documents',
        })}
      />
      <Stack.Screen
        name="SubjectWiseCourseListScreen"
        component={SubjectWiseCourseListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Subject Wise Courses',
        })}
      />
      <Stack.Screen
        name="NotificationListScreen"
        component={NotificationListScreen}
        options={({route}) => ({
          headerShown: true,
          headerStyle: tw`bg-gray-300`,
          headerTitle: route?.params?.headerTitle || 'Notifications',
        })}
      />
      <Stack.Screen
        name="PrepareExamListScreen"
        component={PrepareExamListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Prepare Exams',
        })}
      />
      <Stack.Screen
        name="CurrentAffairListScreen"
        component={CurrentAffairListScreen}
        options={({route}) => ({
          headerShown: true,
          headerStyle: tw`bg-gray-300`,
          headerTitle: route?.params?.headerTitle || 'Currents Affairs',
        })}
      />
      <Stack.Screen
        name="DownloadListScreen"
        component={DownloadListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Downloads',
        })}
      />
      <Stack.Screen
        name="WebsiteListScreen"
        component={WebsiteListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Websites',
        })}
      />
      <Stack.Screen
        name="PostListScreen"
        component={PostListScreen}
        options={({route}) => ({
          headerTitle: route?.params?.headerTitle || 'Posts',
        })}
      />
    </Stack.Group>
  );
};

export default contentListStackGroup;
