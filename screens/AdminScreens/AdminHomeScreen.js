import {tw} from '@lib';
import {LOGOUT} from '@mutations';
import {Alert} from 'react-native';
import React, {useCallback} from 'react';
import {useMutation} from '@apollo/client';
import auth from '@react-native-firebase/auth';
import {CCNavigationButton} from 'components/Common';
import {loggedUserVar, storage} from 'apollo/client';
import {SafeAreaContainer, LoadingIndicator} from '@components';

const AdminHomeScreen = ({navigation}) => {
  const [logout, {loading}] = useMutation(LOGOUT, {
    onCompleted: data => {
      console.log(data?.logout?.message);
      auth()
        .signOut()
        .then(() => {
          console.log('User signed out!');
          storage.clearAll();
          loggedUserVar(null);
        });
    },
    onError: err => {
      console.log(err);
      auth()
        .signOut()
        .then(() => {
          console.log('User signed out!');
          storage.clearAll();
          loggedUserVar(null);
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
        style={tw`bg-white p-4`}
        statusBarStyle="light-content"
        statusBgColor={tw.color('blue-600')}>
        <CCNavigationButton
          name="Advert"
          onPress={() => navigation.navigate('AdminAdvertListScreen')}
          icon="file-text"
          disabled={loading}
        />
        <CCNavigationButton
          name="Courses"
          onPress={() => navigation.navigate('CourseListTopTabNavigator')}
          icon="file-text"
          disabled={loading}
        />
        <CCNavigationButton
          name="Contents"
          onPress={() => navigation.navigate('ContentListTopTabNavigator')}
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
          name="Media"
          onPress={() => navigation.navigate('MediaListTopTabNavigator')}
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
      </SafeAreaContainer>
      <LoadingIndicator loading={loading} />
    </>
  );
};

export default AdminHomeScreen;
