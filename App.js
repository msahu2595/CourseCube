import React, {useState, useEffect} from 'react';
import {View, Text, Button, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from './lib/tailwind';

const myIcon = <Icon name="rocket" size={30} color="#900" />;

GoogleSignin.configure({
  webClientId:
    '712761607011-pen5ucovsnc3pm7uf6hgic9k63s3bq6a.apps.googleusercontent.com',
});

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  function logout() {
    return auth().signOut();
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <SafeAreaView>
        <View style={tw`pt-6 bg-red-100`}>
          <Text style={tw`font-popBold text-lg`}>Login</Text>
          <Button
            title="Google Sign-In"
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log('Signed in with Google!'),
              )
            }
          />
          {myIcon}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Welcome {user.email}</Text>
        <Button
          title="Sign Out"
          onPress={() =>
            logout().then(() => console.log('Signed out with Google!'))
          }
        />
      </View>
    </SafeAreaView>
  );
}

export default App;
