import {tw} from '@lib';
import {LOGOUT} from '@mutations';
import React, {useCallback} from 'react';
import {Alert, ScrollView} from 'react-native';
import {loggedUserVar, storage} from 'apollo/client';
import {showMessage} from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import {useMutation, useReactiveVar} from '@apollo/client';
import {CCNavigationButton, CCText} from 'components/Common';
import {SafeAreaContainer, LoadingIndicator} from '@components';

const AdminHomeScreen = ({navigation}) => {
  const loggedUser = useReactiveVar(loggedUserVar);

  const [logout, {loading}] = useMutation(LOGOUT, {
    onCompleted: data => {
      console.log(data?.logout?.message);
      if (loggedUser?.role === 'ADMIN') {
        messaging().unsubscribeFromTopic('admin');
      }
      loggedUserVar(null);
      storage.clearAll();
    },
    onError: err => {
      console.log(err);
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure, you want to logout?', [
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  }, [logout]);

  return (
    <>
      <SafeAreaContainer
        statusBarStyle="light-content"
        statusBgColor={tw.color('blue-600')}>
        <ScrollView
          bounces={false}
          style={tw`bg-white`}
          contentContainerStyle={tw`p-4`}
          showsVerticalScrollIndicator={false}>
          <CCNavigationButton
            name="Advert"
            onPress={() => navigation.navigate('AdminAdvertListScreen')}
            icon="file-text"
            disabled={loading}
          />
          <CCNavigationButton
            name="Headlines"
            onPress={() => navigation.navigate('AdminHeadlineListScreen')}
            icon="file-text"
            disabled={loading}
          />
          <CCNavigationButton
            name="Articles"
            onPress={() => navigation.navigate('AdminArticleListScreen')}
            icon="file-text"
            disabled={loading}
          />
          <CCNavigationButton
            name="Websites"
            onPress={() => navigation.navigate('AdminWebsiteListScreen')}
            icon="file-text"
            disabled={loading}
          />
          <CCNavigationButton
            name="Courses"
            onPress={() =>
              navigation.navigate('AdminCourseListTopTabNavigator')
            }
            icon="file-text"
            disabled={loading}
          />
          <CCNavigationButton
            name="Contents"
            onPress={() =>
              navigation.navigate('AdminContentListTopTabNavigator')
            }
            icon="file-text"
            disabled={loading}
          />
          <CCNavigationButton
            name="Media"
            onPress={() => navigation.navigate('AdminMediaListTopTabNavigator')}
            icon="file-text"
            disabled={loading}
          />
          <CCNavigationButton
            name="Users"
            onPress={() => navigation.navigate('AdminUserListScreen')}
            icon="file-text"
            disabled={loading}
          />
          <CCNavigationButton
            name="Logout"
            onPress={handleLogout}
            icon="log-out"
            disabled={loading}
          />
          <CCNavigationButton
            name="Login as a User"
            onPress={() => navigation.navigate('MainBottomTabNavigator')}
            icon="repeat"
            disabled={loading}
          />
          {__DEV__ && <CCText style={tw`items-center`} content="[DEV]" />}
        </ScrollView>
      </SafeAreaContainer>
      <LoadingIndicator loading={loading} />
    </>
  );
};

export default AdminHomeScreen;
