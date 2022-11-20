import React, {useState} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const MobileNumberScreen = () => {
  const navigation = useNavigation();

  const [code, setCode] = useState('654321');

  const [confirm, setConfirm] = useState(null);

  // Handle the verify phone button press
  async function verifyPhoneNumber(phoneNumber) {
    console.log('Clicked Verify phone number');
    const confirmation = await auth().verifyPhoneNumber(phoneNumber);
    console.log(confirmation);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      console.log('credential ==> ', credential);
      let userData = await auth().currentUser.linkWithCredential(credential);
      console.log(userData);
      navigation.navigate('Tab');
    } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log('Account linking error');
      }
    }
  }

  return (
    <View>
      <Text>MobileNumberScreen</Text>
      <Button
        title="Verify Phone Number"
        onPress={() => verifyPhoneNumber('+919109620808')}
      />
      <TextInput value={code} onChangeText={text => setCode(text)} />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
    </View>
  );
};

export default MobileNumberScreen;
