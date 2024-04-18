import React from 'react';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {InfoScreen, SyllabusScreen, FAQScreen} from '@screens';
import {SafeAreaContainer} from '@components';

const Tab = createMaterialTopTabNavigator();

const CourseDetailTopTabNavigator = props => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color(
        `${props.route.params?.themeColor || 'green'}-200`,
      )}
      statusBarStyle="dark-content">
      <Tab.Navigator
        backBehavior="none"
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: false,
          tabBarStyle: tw`bg-${props.route.params?.themeColor || 'green'}-200`,
          tabBarItemStyle: tw`px-0`,
          tabBarLabelStyle: tw`font-avSemi text-xs`,
          tabBarIndicatorStyle: tw`bg-${
            props.route.params?.themeColor || 'green'
          }-500`,
        }}>
        <Tab.Screen
          name="CourseInfoScreen"
          component={InfoScreen}
          options={{title: 'Info'}}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            themeColor: props.route.params?.themeColor,
          }}
        />
        {props.route.params?.bundleType === 'PLAYLIST_COURSE' ? (
          <Tab.Screen
            name="CourseSyllabusScreen"
            component={View}
            options={{title: 'Contents'}}
            initialParams={{
              bundleId: props.route.params?.bundleId,
              themeColor: props.route.params?.themeColor,
            }}
            listeners={({navigation, route}) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate(
                  'CourseContentListTopTabNavigator',
                  route.params,
                );
              },
            })}
          />
        ) : (
          <Tab.Screen
            name="CourseSyllabusScreen"
            component={SyllabusScreen}
            options={{title: 'Syllabus'}}
            initialParams={{
              bundleId: props.route.params?.bundleId,
              themeColor: props.route.params?.themeColor,
            }}
          />
        )}
        <Tab.Screen
          name="CourseFAQScreen"
          component={FAQScreen}
          options={{title: 'FAQ'}}
          initialParams={{
            bundleId: props.route.params?.bundleId,
            themeColor: props.route.params?.themeColor,
          }}
        />
      </Tab.Navigator>
    </SafeAreaContainer>
  );
};

export default CourseDetailTopTabNavigator;
