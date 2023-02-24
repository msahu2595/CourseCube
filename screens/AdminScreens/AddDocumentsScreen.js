import {ADD_DOCUMENT} from '@mutations';
import {useMutation} from '@apollo/client';
import {Button, Text, TextInput, View} from 'react-native';
import {SafeAreaContainer} from '@components';
import React, {useState} from 'react';
import tw from 'twrnc';

const AddDocumentsScreen = () => {
  const [title, setTitle] = useState('');
  const [pages, setPages] = useState('');
  const [url, setUrl] = useState('');

  const [addDocument, {data, loading, error}] = useMutation(ADD_DOCUMENT);

  console.log(data, loading, error);

  if (loading) return <Text>'Submitting...'</Text>;
  if (error) return <Text>`Submission error! ${error.message}`</Text>;
  return (
    <SafeAreaContainer>
      <View style={tw`m-1 border p-1`}>
        <Text style={tw`font-bold text-gray-900 text-lg`}>DOCUMENT SCREEN</Text>
        <Text style={tw`mx-2`}>Title :</Text>
        <TextInput
          placeholder="Enter Title"
          onChangeText={setTitle}
          value={title}
          style={tw`border m-2 border-b-black`}
        />
        <Text style={tw`mx-2`}>Pages :</Text>
        <TextInput
          placeholder="Enter Title"
          onChangeText={setPages}
          value={pages}
          style={tw`border m-2 border-b-black`}
        />
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
            addDocument({
              variables: {
                documentInput: {
                  title: 'Physics',
                  pages: 10,
                  url: 'https://www.africau.edu/images/default/sample.pdf',
                },
              },
            })
          }
        />
      </View>
    </SafeAreaContainer>
  );
};

export default AddDocumentsScreen;
