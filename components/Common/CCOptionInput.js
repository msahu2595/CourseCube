import {tw, uuid} from '@lib';
import React, {memo, useCallback, useState} from 'react';
import {TextInput, TouchableOpacity, View, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const srNo = 'ABCDEF';

export const CCOptionInput = memo(
  ({
    label,
    info,
    required = false,
    error,
    touched,
    editable = true,
    disabled = false,
    options,
    setOptions,
    answerIndex,
    setAnswerIndex,
  }) => {
    const handleAnswerIndex = useCallback(
      index => {
        if (answerIndex !== index) {
          setAnswerIndex(index);
        }
      },
      [answerIndex, setAnswerIndex],
    );

    const resetAnswerIndex = useCallback(
      index => {
        if (answerIndex === index) {
          setAnswerIndex(answerIndex ? index - 1 : 0);
        }
      },
      [answerIndex, setAnswerIndex],
    );

    const handleAddOption = useCallback(() => {
      setOptions([...options, {id: uuid(), option: ''}]);
    }, [options, setOptions]);

    const handleUpdateOption = useCallback(
      (value, index) => {
        const updatedOptions = [...options];
        updatedOptions[index].option = value;
        setOptions(updatedOptions);
      },
      [options, setOptions],
    );

    const handleDeleteOption = useCallback(
      index => {
        const filteredOptions = [...options];
        filteredOptions.splice(index, 1);
        setOptions(filteredOptions);
        resetAnswerIndex(index);
      },
      [options, setOptions, resetAnswerIndex],
    );

    return (
      <View style={tw`mb-1`}>
        <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
          {label}
          {required && <Text style={tw`text-red-600`}>*</Text>}
        </Text>
        <View style={tw``}>
          {options.map(({id, option}, optionIndex) => (
            <OptionInput
              key={id}
              option={option}
              options={options?.length || 0}
              setOption={handleUpdateOption}
              setAnswer={handleAnswerIndex}
              deleteOption={handleDeleteOption}
              index={optionIndex}
              answerIndex={answerIndex}
              editable={editable}
              disabled={disabled}
              touched={touched}
              error={error?.[optionIndex]?.option}
            />
          ))}
          {editable && options.length < 6 && (
            <TouchableOpacity disabled={disabled} onPress={handleAddOption}>
              <Text style={tw`font-avSemi text-sm text-blue-600 py-2 px-6`}>
                ADD ANOTHER OPTION
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {info ? (
          <Text style={tw`text-[10px] text-gray-400 font-avReg p-1`}>
            {info}
          </Text>
        ) : null}
      </View>
    );
  },
);

const OptionInput = memo(
  ({
    option,
    options,
    setOption,
    setAnswer,
    deleteOption,
    index,
    answerIndex,
    editable,
    disabled,
    touched,
    error,
  }) => {
    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState(option);
    return (
      <>
        <View
          style={tw.style(
            `my-1 py-3 pl-4 pr-2 flex-1 border flex-row rounded-lg items-center border-gray-300 ${
              answerIndex === index ? 'bg-green-100' : ''
            }`,
          )}>
          <TouchableOpacity
            disabled={disabled}
            onPress={() => setAnswer(index)}
            style={tw.style(
              `h-5 w-5 shadow-md bg-white rounded-full ${
                answerIndex === index ? 'bg-green-600' : ''
              }`,
            )}
          />
          <TextInput
            multiline
            editable={edit}
            autoCorrect={false}
            placeholderTextColor={tw.color('gray-400')}
            placeholder={`Option ${srNo[index]} goes here.`}
            style={tw.style(
              'flex-1 text-black font-avReg text-sm ml-2',
              {width: '100%', paddingVertical: 0},
              disabled && 'opacity-50',
            )}
            value={value}
            onChangeText={setValue}
          />
          {editable && (
            <>
              {edit ? (
                <>
                  <TouchableOpacity
                    disabled={disabled}
                    style={tw`p-1 rounded bg-white shadow-md`}
                    onPress={() => {
                      setEdit(false);
                      setOption(value, index);
                    }}>
                    <MaterialCommunityIcons
                      name="check"
                      size={24}
                      color={tw.color('green-600')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={disabled}
                    style={tw`p-1 rounded bg-white shadow-md ml-2`}
                    onPress={() => {
                      setEdit(false);
                      setValue(option);
                    }}>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={tw.color('red-600')}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    disabled={disabled}
                    style={tw`p-1 rounded bg-white shadow-md`}
                    onPress={() => {
                      setEdit(true);
                    }}>
                    <MaterialCommunityIcons
                      name="pencil-outline"
                      size={24}
                      color={tw.color('blue-600')}
                    />
                  </TouchableOpacity>
                  {options > 2 && (
                    <TouchableOpacity
                      disabled={disabled}
                      style={tw`p-1 rounded bg-white shadow-md ml-2`}
                      onPress={() => {
                        deleteOption(index);
                      }}>
                      <MaterialCommunityIcons
                        name="delete-outline"
                        size={24}
                        color={tw.color('red-600')}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}
        </View>
        {error && touched ? (
          <Text style={tw`text-sm text-red-600 font-avReg p-1`}>{error}</Text>
        ) : null}
      </>
    );
  },
);
