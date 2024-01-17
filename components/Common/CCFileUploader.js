import {tw} from '@lib';
import {showMessage} from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import React, {useState, memo, useCallback} from 'react';
import {fileUploader, fileRemover} from 'lib/fileHandler';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const CCFileUploader = memo(
  ({
    label,
    info,
    required = false,
    error,
    touched,
    disabled = false,
    onChangeFile,
    value,
    prevFile,
    fileProps = {},
  }) => {
    const [loading, setLoading] = useState(false);

    const handleUpload = useCallback(async () => {
      try {
        setLoading(true);
        const file = await DocumentPicker.pickSingle({
          allowMultiSelection: false,
          type: DocumentPicker.types.pdf,
          ...fileProps,
        });
        await new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });
        const result = await fileUploader(file.uri, file.type);
        console.log({result});
        onChangeFile(result.path);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
          icon: 'danger',
        });
      }
    }, [fileProps, onChangeFile]);

    const handleDelete = useCallback(async () => {
      try {
        setLoading(true);
        const result = await fileRemover(value);
        console.log({result});
        onChangeFile('');
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
          icon: 'danger',
        });
      }
    }, [value, onChangeFile]);

    return (
      <View style={tw`mb-1`}>
        <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
          {label}
          {required && <Text style={tw`text-red-600`}>*</Text>}
        </Text>
        {prevFile ? (
          <View style={tw`mb-1 border border-gray-300 rounded-lg`}>
            <Text style={tw`flex-1 text-gray-900 font-avReg text-[12px] pl-1`}>
              Current file:
            </Text>
            <View style={tw`flex-1 flex-row items-center`}>
              <View
                style={tw`h-[96px] w-[96px] bg-gray-600 items-center justify-center m-1`}>
                <FontAwesome
                  name={`file-${prevFile?.split('.')?.[1]}-o`}
                  size={48}
                  color={tw.color('white')}
                />
              </View>
              <Text style={tw`flex-1 text-gray-900 font-avReg`}>
                {prevFile?.split('/')?.[2]}
              </Text>
            </View>
          </View>
        ) : null}
        {!loading && !value ? (
          <TouchableOpacity
            onPress={handleUpload}
            disabled={disabled}
            style={tw`flex-row bg-blue-600 py-2 px-4 items-center justify-center rounded-lg self-start`}>
            <Feather name="upload" size={14} color={tw.color('white')} />
            <Text style={tw`pl-2 text-xs text-white font-avReg`}>Upload</Text>
          </TouchableOpacity>
        ) : (
          <View style={tw`border border-gray-300 rounded-lg`}>
            <Text style={tw`flex-1 text-gray-900 font-avReg text-[12px] pl-1`}>
              Uploaded file:
            </Text>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-1 flex-row items-center`}>
                <View
                  style={tw`h-[96px] w-[96px] bg-gray-600 items-center justify-center m-1`}>
                  {value ? (
                    <FontAwesome
                      name={`file-${value?.split('.')?.[1]}-o`}
                      size={48}
                      color={tw.color('white')}
                    />
                  ) : loading ? (
                    <ActivityIndicator
                      size="large"
                      color={tw.color('blue-600')}
                    />
                  ) : null}
                </View>
                <Text style={tw`flex-1 text-gray-900 font-avReg`}>
                  {value?.split('/')?.[2]}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleDelete}
                disabled={loading || disabled}
                style={tw`bg-blue-600 justify-center py-2 px-2 mx-1 rounded-lg`}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={24}
                  color={tw.color('white')}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {info ? (
          <Text style={tw`text-[10px] text-gray-400 font-avReg p-1`}>
            {info}
          </Text>
        ) : null}
        {error && touched ? (
          <Text style={tw`text-sm text-red-600 font-avReg p-1`}>{error}</Text>
        ) : null}
      </View>
    );
  },
);
