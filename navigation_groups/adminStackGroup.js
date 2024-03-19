import {tw} from '@lib';
import React from 'react';
import {
  AdminHomeScreen,
  AdminAdvertListScreen,
  AdminHeadlineListScreen,
  AdminArticleListScreen,
  AdminWebsiteListScreen,
  AdminTestQuestionListScreen,
  AdminCourseSyllabusScreen,
} from '@screens';
import {
  MediaListTopTabNavigator,
  CourseListTopTabNavigator,
  ContentListTopTabNavigator,
} from '@navigators';
import {TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();

const adminStackGroup = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: tw`bg-blue-600`,
        headerTitleStyle: tw`font-avSemi`,
        headerTintColor: tw.color('white'),
      }}>
      <Stack.Screen
        name="AdminHomeScreen"
        component={AdminHomeScreen}
        options={adminHomeScreenOptions}
      />
      <Stack.Screen
        name="AdminAdvertListScreen"
        component={AdminAdvertListScreen}
        options={{
          headerTitle: 'Adverts',
        }}
      />
      <Stack.Screen
        name="AdminHeadlineListScreen"
        component={AdminHeadlineListScreen}
        options={{
          headerTitle: 'Headlines',
        }}
      />
      <Stack.Screen
        name="AdminArticleListScreen"
        component={AdminArticleListScreen}
        options={{
          headerTitle: 'Articles',
        }}
      />
      <Stack.Screen
        name="AdminWebsiteListScreen"
        component={AdminWebsiteListScreen}
        options={{
          headerTitle: 'Websites',
        }}
      />
      <Stack.Screen
        name="CourseListTopTabNavigator"
        component={CourseListTopTabNavigator}
        options={{
          headerTitle: 'Courses',
        }}
      />
      <Stack.Screen
        name="ContentListTopTabNavigator"
        component={ContentListTopTabNavigator}
        options={{
          headerTitle: 'Contents',
        }}
      />
      <Stack.Screen
        name="MediaListTopTabNavigator"
        component={MediaListTopTabNavigator}
        options={{
          headerTitle: 'Media',
        }}
      />
      <Stack.Screen
        name="AdminTestQuestionListScreen"
        component={AdminTestQuestionListScreen}
        options={{
          headerTitle: 'Test Questions',
        }}
      />
      <Stack.Screen
        name="AdminCourseSyllabusScreen"
        component={AdminCourseSyllabusScreen}
        options={{
          headerTitle: 'Course Syllabus',
        }}
      />
    </Stack.Group>
  );
};

export default adminStackGroup;

const adminHomeScreenOptions = ({navigation}) => ({
  headerTitle: 'Admin Dashboard',
  headerRight: () => (
    <TouchableOpacity
      style={tw`pr-3`}
      onPress={() => navigation.navigate('MyNotificationScreen')}
      hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
      <MaterialCommunityIcons name="bell" size={28} color={tw.color('white')} />
    </TouchableOpacity>
  ),
});
