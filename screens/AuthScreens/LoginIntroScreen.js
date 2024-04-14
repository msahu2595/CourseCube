import {
  Text,
  View,
  Image,
  Platform,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import tw from '@lib/tailwind';
import React, {memo} from 'react';
import {GOOGLE_LOG_IN} from '@mutations';
import {useMutation} from '@apollo/client';
import {LoadingIndicator} from '@components';
import {
  statusCodes,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import {showMessage} from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import {loggedUserVar, FCMTokenVar, storage} from 'apollo/client';

GoogleSignin.configure({
  webClientId:
    '712761607011-pen5ucovsnc3pm7uf6hgic9k63s3bq6a.apps.googleusercontent.com',
});

const LoginIntroScreen = () => {
  const [googleLogIn, {loading: googleLogInLoading}] = useMutation(
    GOOGLE_LOG_IN,
    {
      onCompleted: data => {
        storage.set('user', JSON.stringify(data?.googleLogIn?.payload));
        loggedUserVar(data?.googleLogIn?.payload);
        if (data?.googleLogIn?.payload?.role === 'ADMIN') {
          messaging().subscribeToTopic('admin');
        }
      },
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
          icon: 'danger',
        });
      },
    },
  );

  const handleGoogleSignIn = async () => {
    try {
      if (await GoogleSignin.hasPlayServices()) {
        const {idToken} = await GoogleSignin.signIn();
        const FCMToken = Platform.OS === 'ios' ? '' : FCMTokenVar();
        googleLogIn({
          variables: {
            idToken,
            FCMToken,
            platform: Platform.OS,
            acceptTnC: true,
          },
        });
      }
    } catch (error) {
      let message =
        error?.message || 'Some unknown error occurred. Try again!!';
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        return;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        message = 'Google signin is in progress already';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        message = 'Play services not available or outdated in your mobile.';
      }
      showMessage({message, type: 'danger', icon: 'danger'});
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#185366" />
      <ImageBackground
        source={require('@images/LoginBackground.jpg')}
        resizeMode="cover"
        style={tw`flex-1 justify-end p-4 ios:pb-8`}>
        <Text style={tw`text-white text-3xl leading-10 font-avBold`}>
          Lakshya PSC Academy
        </Text>
        <Text style={tw`text-white font-avReg text-base mt-2`}>
          Planting the seeds of knowledge.
        </Text>
        <Text style={tw`text-white font-avReg text-xs mb-4 mt-2`}>
          CGPSC/CGVYAPAM/SSC/BANKING/RAILWAYS
        </Text>
        <View style={tw`flex-row justify-between`}>
          <LoginButton
            onPress={handleGoogleSignIn}
            imageStyle={tw`h-8 w-8`}
            imageSource={require('@images/google-48.png')}
            disabled={googleLogInLoading}
          />
        </View>
      </ImageBackground>
      <LoadingIndicator loading={googleLogInLoading} />
    </>
  );
};

export default LoginIntroScreen;

const LoginButton = memo(({onPress, imageSource, imageStyle, disabled}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={tw`py-1 flex-1 flex-row bg-gray-100 justify-center items-center rounded-lg shadow-lg`}>
    <Text style={tw`text-gray-600 font-avSemi`}>Login with</Text>
    <Image
      source={imageSource}
      style={tw.style('h-8 w-8 ml-2', {...imageStyle})}
    />
  </TouchableOpacity>
));
