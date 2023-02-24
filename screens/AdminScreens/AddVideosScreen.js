import {ADD_VIDEOS} from '@mutations';
import {useMutation} from '@apollo/client';
import {Button, Text, TextInput, View} from 'react-native';
import {SafeAreaContainer} from '@components';
import React, {useState} from 'react';
import tw from 'twrnc';
import {showMessage} from 'react-native-flash-message';

const AddVideosScreen = () => {
  const [url, setUrl] = useState('');

  const [addVideo, {data, loading, error}] = useMutation(ADD_VIDEOS, {
    onCompleted: data => {
      console.log(' ==> addVideo', data);
      showMessage({
        message: 'Videos Added Successfully.',
        type: 'success',
      });
    },
  });

  console.log(data, loading, error);

  if (loading) return <Text>'Submitting...'</Text>;
  if (error) return <Text>`Submission error! ${error.message}`</Text>;
  return (
    <SafeAreaContainer>
      <View style={tw`m-1 border p-1`}>
        <Text style={tw`font-bold text-gray-900 text-lg`}>VIDEOS SCREEN</Text>
        <Text style={tw`mx-2`}>Url :</Text>
        <TextInput
          placeholder="Enter Title"
          onChangeText={setUrl}
          value={url}
          style={tw`border m-2 border-b-black`}
        />
        <Button
          title="Submit"
          onPress={() =>
            addVideo({
              variables: {
                videoLink: 'https://www.africau.edu/images/default/sample.pdf',
              },
            })
          }
        />
      </View>
    </SafeAreaContainer>
  );
};

export default AddVideosScreen;
