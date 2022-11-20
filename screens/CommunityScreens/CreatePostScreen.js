import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import tw from '@lib/tailwind';
import {useMutation} from '@apollo/client';
import {CREATE_QUESTION} from '@mutations';
import React, {useCallback, useState} from 'react';
import {FocusAwareStatusBar, Fab} from '@components';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const srNo = 'ABCDEFGH';

const CreatePostScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [poll, setPoll] = useState(false);
  const [options, setOptions] = useState(['', '']);
  const [answerIndex, setAnswerIndex] = useState(0);

  const [createQuestion, {loading}] = useMutation(CREATE_QUESTION, {
    onCompleted: data => {
      console.log('createQuestion ==> ', data);
    },
    onError: error => {
      console.log('createQuestion ==> ', error);
    },
  });

  const handleSubmit = useCallback(() => {
    const questionInput = {
      title,
      description,
    };
    if (image) {
      questionInput.image = image;
    }
    if (poll) {
      questionInput.options = options;
      questionInput.answerIndex = answerIndex;
    }
    console.log(questionInput);
    createQuestion({variables: {questionInput}});
  }, [title, description, image, poll, options, answerIndex, createQuestion]);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <FocusAwareStatusBar
        backgroundColor={tw.color('red-600')}
        barStyle="light-content"
      />
      <ScrollView style={tw`bg-white`} contentContainerStyle={tw`p-3`}>
        <TextInput
          multiline
          numberOfLines={3}
          autoFocus={true}
          textAlignVertical="top"
          style={tw`px-3 text-gray-600 font-avReg text-sm border border-gray-300 rounded-lg`}
          placeholder="Question's title will goes here. (Required)"
          placeholderTextColor={tw.color('gray-400')}
          onChangeText={setTitle}
          value={title}
        />
        <TextInput
          multiline
          autoFocus={true}
          textAlignVertical="top"
          style={tw.style(
            'text-gray-600',
            'font-avReg',
            'text-sm',
            'px-3',
            'my-2',
            'border',
            'rounded-lg',
            'border-gray-300',
            {minHeight: 164},
          )}
          placeholder={`Question's description goes here. (Optional)\n\n(Note: The question should be related to competitive exams only.)`}
          placeholderTextColor={tw.color('gray-400')}
          onChangeText={setDescription}
          value={description}
        />
        {image && (
          <View>
            <Image
              source={{
                uri: image,
              }}
              resizeMode="contain"
              style={tw.style({
                width: '100%',
                height: undefined,
                aspectRatio: 16 / 9,
              })}
            />
            <Fab
              bgColor={tw.color('red-600')}
              iconSize={20}
              iconName="close"
              style={tw`w-8 h-8 top-2`}
              onPress={() => setImage(null)}
            />
          </View>
        )}
        {poll && (
          <View style={tw`py-1`}>
            {options.map((option, optionIndex) => (
              <View
                key={`OPTION_${optionIndex}`}
                style={tw.style(
                  'my-1',
                  'py-3',
                  'pl-4',
                  'pr-2',
                  'flex-1',
                  'flex-row',
                  'items-center',
                  'bg-gray-100',
                  'rounded-lg',
                  {
                    'bg-green-100': answerIndex === optionIndex,
                  },
                )}>
                <TouchableOpacity
                  onPress={() => setAnswerIndex(optionIndex)}
                  style={tw.style(
                    'h-5',
                    'w-5',
                    'rounded-full',
                    'shadow',
                    'bg-white',
                    {
                      'bg-green-600': answerIndex === optionIndex,
                    },
                  )}
                />
                <TextInput
                  style={tw.style(
                    'flex-1',
                    'text-gray-600',
                    'font-avReg',
                    'text-sm',
                    'ml-2',
                    {
                      width: '100%',
                      paddingVertical: 0,
                    },
                  )}
                  multiline
                  placeholder={`Option ${srNo[optionIndex]} goes here.`}
                  placeholderTextColor={tw.color('gray-400')}
                  value={option}
                  onChangeText={text =>
                    setOptions(prevState => {
                      const updatedOptions = [...prevState];
                      updatedOptions[optionIndex] = text;
                      return updatedOptions;
                    })
                  }
                />
                {options.length > 2 && (
                  <TouchableOpacity
                    onPress={() =>
                      options.length > 2
                        ? setOptions(prevState => {
                            const filteredOptions = [...prevState];
                            filteredOptions.splice(optionIndex, 1);
                            return filteredOptions;
                          })
                        : null
                    }>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={tw.color('gray-600')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {options.length < 5 && (
              <TouchableOpacity
                onPress={() =>
                  options.length < 5
                    ? setOptions(prevState => [...prevState, ''])
                    : null
                }>
                <Text style={tw`font-avSemi text-sm text-red-600 py-2 px-6`}>
                  ADD ANOTHER OPTION
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      <View style={tw`mt-1 flex-row items-center justify-between bg-white`}>
        <View style={tw`px-4 flex-row`}>
          <TouchableOpacity
            onPress={() =>
              setImage(
                'https://drive.google.com/uc?export=download&id=1DyNTGuJCb_8YLNchV0cPiFRMDH5HiVf_',
              )
            }
            style={tw`flex-row items-center pr-4 py-1`}>
            <MaterialCommunityIcons
              name="image"
              size={24}
              color={tw.color('red-600')}
            />
            <Text style={tw`font-avSemi text-base text-gray-600 pl-2`}>
              Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPoll(prevState => !prevState)}
            style={tw`flex-row items-center pr-4 py-1`}>
            <MaterialCommunityIcons
              name="poll-box"
              size={24}
              color={tw.color('red-600')}
            />
            <Text style={tw`font-avSemi text-base text-gray-600 pl-2`}>
              Poll
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={loading}
          onPress={handleSubmit}
          style={tw`py-3 px-4 flex-row items-center bg-red-600 shadow`}>
          <MaterialCommunityIcons
            name="check"
            size={24}
            color={tw.color('white')}
          />
          <Text style={tw`font-avSemi text-base text-white pl-2`}>Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
