import {tw} from '@lib';
import React from 'react';
import {
  AdminHomeScreen,
  AdminAdvertListScreen,
  AdminHeadlineListScreen,
  AdminArticleListScreen,
  AdminWebsiteListScreen,
  AdminUserListScreen,
  AdminTestQuestionListScreen,
  AdminCourseSyllabusScreen,
} from '@screens';
import {
  AdminMediaListTopTabNavigator,
  AdminCourseListTopTabNavigator,
  AdminContentListTopTabNavigator,
  AdminCourseContentListTopTabNavigator,
} from '@navigators';
import {AdminHomeHeader} from 'components/Headers';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

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
        name="AdminCourseListTopTabNavigator"
        component={AdminCourseListTopTabNavigator}
        options={{
          headerTitle: 'Courses',
        }}
      />
      <Stack.Screen
        name="AdminContentListTopTabNavigator"
        component={AdminContentListTopTabNavigator}
        options={{
          headerTitle: 'Contents',
        }}
      />
      <Stack.Screen
        name="AdminMediaListTopTabNavigator"
        component={AdminMediaListTopTabNavigator}
        options={{
          headerTitle: 'Media',
        }}
      />
      <Stack.Screen
        name="AdminUserListScreen"
        component={AdminUserListScreen}
        options={{
          headerTitle: 'Users',
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
      <Stack.Screen
        name="AdminCourseContentListTopTabNavigator"
        component={AdminCourseContentListTopTabNavigator}
        options={{
          headerTitle: 'Course Contents',
        }}
      />
    </Stack.Group>
  );
};

export default adminStackGroup;

const adminHomeScreenOptions = props => ({
  headerTitle: 'Admin Dashboard',
  headerRight: () => <AdminHomeHeader {...props} />,
});
