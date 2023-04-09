import * as React from 'react';
import {
  Text,
  Platform,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoadingIndicator, SafeAreaContainer} from '@components';
import messaging from '@react-native-firebase/messaging';
import {loggedUserVar, storage} from 'apollo/client';
import auth from '@react-native-firebase/auth';
import {useMutation} from '@apollo/client';
import {GOOGLE_LOG_IN} from '@mutations';
import tw from '@lib/tailwind';

GoogleSignin.configure({
  webClientId:
    '712761607011-pen5ucovsnc3pm7uf6hgic9k63s3bq6a.apps.googleusercontent.com',
});

const LoginIntroScreen = () => {
  const [googleLogIn, {loading}] = useMutation(GOOGLE_LOG_IN, {
    onCompleted: data => {
      storage.set('user', JSON.stringify(data?.googleLogIn?.payload));
      loggedUserVar(data?.googleLogIn?.payload);
    },
    onError: err => {
      console.log(err);
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));
    },
  });

  const signIn = async () => {
    try {
      const FCMToken =
        Platform.OS === 'ios' ? '' : await messaging().getToken();
      const {idToken} = await GoogleSignin.signIn();
      console.log('{idToken, FCMToken} ==> ', {idToken, FCMToken});
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      console.log('User signed in! ==> ', googleCredential);
      googleLogIn({
        variables: {idToken, acceptTnC: true, FCMToken},
      });
    } catch (error) {
      console.log('GoogleSignin.signIn() error ==> ', error);
    }
  };

  return (
    <>
      <SafeAreaContainer
        statusBgColor="#1A368D"
        statusBarStyle="dark-content"
        containerStyle={tw`bg-[#1A368D]`}>
        <StatusBar backgroundColor="#1b368d" />
        <ImageBackground
          source={require('@images/LoginBackground.png')}
          resizeMode="cover"
          style={tw`flex-1 justify-end p-4`}>
          <Text style={tw`text-white text-3xl leading-10 font-avBold`}>
            Lakshya with BHAVESH GAJPAL
          </Text>
          <Text style={tw`text-white font-avReg text-base mt-2`}>
            Planting the seeds of knowledge.
          </Text>
          <Text style={tw`text-white font-avReg text-xs mb-4 mt-2`}>
            CGPSC/CGVYAPAM/SSC/BANKING/RAILWAYS
          </Text>
          <TouchableOpacity
            disabled={loading}
            onPress={signIn}
            style={tw`bg-green-500 justify-center items-center p-3 rounded-lg`}>
            <Text style={tw`text-white font-avBold text-base`}>
              Login with Google
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </SafeAreaContainer>
      <LoadingIndicator loading={loading} />
    </>
  );
};

export default LoginIntroScreen;
