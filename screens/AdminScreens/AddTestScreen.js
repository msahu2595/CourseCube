import {useMutation} from '@apollo/client';
import {SafeAreaContainer} from '@components';
import {tw} from '@lib';
import {ADD_TEST} from '@mutations';
import React, {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';

const AddTestScreen = () => {
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');
  const [title, setTitle] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [negativeMark, setNegativeMarks] = useState('');

  const [addTest, {loading, error}] = useMutation(ADD_TEST, {
    onCompleted: data => {
      console.log('addTest ==> ', data);
      showMessage({
        message: 'Test Added Successfully.',
        type: 'success',
      });
    },
  });

  if (loading) return <Text>'Submitting...'</Text>;

  if (error) return <Text>`Submission error! ${error.message}`</Text>;

  return (
    <SafeAreaContainer>
      <View style={tw`border p-2 m-1`}>
        <Text style={tw`font-bold text-gray-900 text-lg`}>Test Screen</Text>
        <View>
          <Text style={tw`mx-2`}>Title :</Text>
          <TextInput
            placeholder="Enter Title"
            onChangeText={setTitle}
            value={title}
            style={tw`border m-2 border-b-black`}
          />
          <Text style={tw`mx-2`}>Duration :</Text>
          <TextInput
            placeholder="Enter Duration"
            onChangeText={setDuration}
            value={duration}
            style={tw`border m-2 border-b-black`}
          />
          <Text style={tw`mx-2`}>Instruction :</Text>
          <TextInput
            placeholder="Enter Instruction"
            onChangeText={setInstructions}
            value={instructions}
            style={tw`border m-2 border-b-black`}
          />
          <Text style={tw`mx-2`}>Total Marks :</Text>
          <TextInput
            placeholder="Enter Total Marks"
            onChangeText={setTotalMarks}
            value={totalMarks}
            keyboardType="numeric"
            style={tw`border m-2 border-b-black`}
          />
          <Text style={tw`mx-2`}>Negative Mark :</Text>
          <TextInput
            placeholder="Enter negativeMark"
            onChangeText={setNegativeMarks}
            value={negativeMark}
            keyboardType="numeric"
            style={tw`border m-2 border-b-black`}
          />
        </View>
        <Button
          title="Submit"
          onPress={() =>
            addTest({
              variables: {
                testInput: {
                  duration: duration,
                  instructions: instructions,
                  negativeMark: negativeMark,
                  title: title,
                  totalMarks: totalMarks,
                },
              },
            })
          }
        />
      </View>
    </SafeAreaContainer>
  );
};

export default AddTestScreen;
