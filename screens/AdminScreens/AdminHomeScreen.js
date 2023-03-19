import {tw} from '@lib';
import {LOGOUT} from '@mutations';
import {Alert} from 'react-native';
import React, {useCallback} from 'react';
import {CCButton} from 'components/Common';
import {useMutation} from '@apollo/client';
import auth from '@react-native-firebase/auth';
import {SafeAreaContainer, LoadingIndicator} from '@components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminHomeScreen = ({navigation}) => {
  const [logout, {loading}] = useMutation(LOGOUT, {
    onCompleted: data => {
      console.log(data?.logout?.message);
      auth()
        .signOut()
        .then(() => {
          console.log('User signed out!');
          AsyncStorage.multiRemove(['token', 'refresh']);
        });
    },
    onError: err => {
      console.log(err);
      auth()
        .signOut()
        .then(() => {
          console.log('User signed out!');
          AsyncStorage.multiRemove(['token', 'refresh']);
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
      <SafeAreaContainer style={tw`py-1`}>
        <CCButton
          label="Advert"
          onPress={null}
          style={tw`mx-2 my-1 bg-blue-500`}
        />
        <CCButton
          label="Courses"
          onPress={null}
          style={tw`mx-2 my-1 bg-blue-500`}
        />
        <CCButton
          label="Contents"
          onPress={null}
          style={tw`mx-2 my-1 bg-blue-500`}
        />
        <CCButton
          label="Headlines"
          onPress={null}
          style={tw`mx-2 my-1 bg-blue-500`}
        />
        <CCButton
          label="Articles"
          onPress={() => navigation.navigate('AdminArticleListScreen')}
          style={tw`mx-2 my-1 bg-blue-500`}
        />
        <CCButton
          label="Websites"
          onPress={() => navigation.navigate('AdminWebsiteListScreen')}
          style={tw`mx-2 my-1 bg-blue-500`}
        />
        <CCButton
          label="Media"
          style={tw`mx-2 my-1 bg-blue-500`}
          onPress={() => navigation.navigate('MediaListTopTabNavigator')}
        />
        <CCButton
          label="Logout"
          onPress={handleLogout}
          style={tw`mx-2 my-1 bg-red-500`}
        />
      </SafeAreaContainer>
      <LoadingIndicator loading={loading} />
    </>
  );
};

export default AdminHomeScreen;
