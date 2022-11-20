import {View, Text, Button, StyleSheet, Dimensions, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from '../lib/tailwind';
// import Pdf from 'react-native-pdf';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import TreeView from 'react-native-animated-tree-view';

const colors = ['tomato', 'thistle', 'skyblue', 'teal'];

const data = [
  {
    name: 'Cheese',
    value: 'cheese-value',
  },
  {
    name: 'Cheese',
    value: 'cheese-value',
    items: [
      {
        name: 'Spicy',
        value: 'spicy-value',
      },
      {
        name: 'Cheese',
        value: 'cheese-value',
        items: [
          {
            name: 'Spicy',
            value: 'spicy-value',
          },
          {
            name: 'Spicy',
            value: 'spicy-value',
          },
        ],
      },
    ],
  },
];

// const source = {
//   uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
//   cache: true,
// };

const myIcon = <Icon name="rocket" size={30} color="#900" />;

GoogleSignin.configure({
  webClientId:
    '712761607011-pen5ucovsnc3pm7uf6hgic9k63s3bq6a.apps.googleusercontent.com',
});

const HomeScreen = () => {
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
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={tw`pt-6 bg-red-100`}>
          <Text style={tw`font-popBold text-lg text-black`}>Login</Text>
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
        <Button
          onPress={() => {
            /* HERE IS WHERE WE'RE GOING TO SHOW OUR FIRST MESSAGE */
            showMessage({
              message: 'My message title',
              description: 'My message description',
              type: 'default',
              backgroundColor: 'yellow', // background color
              color: '#606060', // text color
            });
          }}
          title="Request Details"
          color="#841584"
        />
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.linearGradient}>
          <Text style={styles.buttonText}>Sign in with Facebook</Text>
        </LinearGradient>
        <Menu>
          <MenuTrigger text="Select action" />
          <MenuOptions>
            <MenuOption onSelect={() => alert(`Save`)} text="Save" />
            <MenuOption onSelect={() => alert(`Delete`)}>
              <Text style={{color: 'red'}}>Delete</Text>
            </MenuOption>
            <MenuOption
              onSelect={() => alert(`Not called`)}
              disabled={true}
              text="Disabled"
            />
          </MenuOptions>
        </Menu>
        <Image
          source={require('../assets/images/files.png')}
          style={{width: 20, height: 20}}
        />
        <View style={styles.container}>
          <SwiperFlatList
            autoplay
            autoplayDelay={2}
            autoplayLoop
            index={2}
            showPagination
            data={colors}
            renderItem={({item}) => (
              <View style={[styles.child, {backgroundColor: item}]}>
                <Text style={styles.text}>{item}</Text>
              </View>
            )}
          />
        </View>
        <TreeView
          data={data}
          containerStyle={tw`px-4 py-2`}
          listContainerStyle={tw``}
          leftImage={require('../assets/images/files.png')}
          rightImage={require('../assets/images/chevron-down.png')}
          leftImageStyle={tw.style({
            width: 20,
            height: 20,
            tintColor: tw.color('green-700'),
          })}
          rightImageStyle={tw.style({
            width: 15,
            height: 15,
            tintColor: tw.color('green-700'),
          })}
          textStyle={tw`pl-2 font-avReg text-base text-gray-900`}
        />
        {/* <View style={styles.container}>
                    <Pdf
                      source={source}
                      onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                      }}
                      onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page}`);
                      }}
                      onError={error => {
                        console.log(error);
                      }}
                      onPressLink={uri => {
                        console.log(`Link pressed: ${uri}`);
                      }}
                      style={styles.pdf}
                    />
                </View> */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
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
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  child: {width: Dimensions.get('window').width, justifyContent: 'center'},
  text: {fontSize: Dimensions.get('window').width * 0.5, textAlign: 'center'},
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginTop: 25,
//   },
//   pdf: {
//     flex: 1,
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
//   },
// });
