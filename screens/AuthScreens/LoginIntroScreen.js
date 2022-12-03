import * as React from 'react';
import {
  Text,
  Platform,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {isLoggedInVar, loggedUserVar} from 'apollo/client';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import {useMutation} from '@apollo/client';
import {GOOGLE_LOG_IN} from '@mutations';
import tw from '@lib/tailwind';

GoogleSignin.configure({
  webClientId:
    '712761607011-pen5ucovsnc3pm7uf6hgic9k63s3bq6a.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
});

const multiSet = async ({token, refresh}) => {
  const firstPair = ['token', token];
  const secondPair = ['refresh', refresh];
  try {
    await AsyncStorage.multiSet([firstPair, secondPair]);
    console.log('Done.');
  } catch (e) {
    console.log(e);
  }
};

const LoginIntroScreen = ({navigation}) => {
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

  const [googleLogIn, {loading}] = useMutation(GOOGLE_LOG_IN, {
    onCompleted: data => {
      const {token, refresh, payload} = data?.googleLogIn;
      console.log('Successfully logged in! ==> ', {token, refresh, payload});
      multiSet({token, refresh});
      loggedUserVar(payload);
      isLoggedInVar(true);
      // navigation.navigate('MobileNumberScreen');
    },
    onError: err => {
      console.log(err);
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));
    },
  });

  return (
    <SafeAreaView style={tw`flex-1`}>
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
    </SafeAreaView>
  );
};

export default LoginIntroScreen;
