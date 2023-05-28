import {
  View,
  Alert,
  Image,
  Linking,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {tw} from '@lib';
import {useGenderImage} from 'hooks';
import {gql, useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import React, {memo, useCallback, useState} from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UPLOAD_IMAGE = gql`
  mutation uploadImage {
    uploadImage {
      code
      success
      message
      token
      payload {
        id
        uploadURL
      }
    }
  }
`;

let image;

export const CCImageUploader = memo(
  ({name, gender, value, onUploadImage, editable = true, size = 108}) => {
    const [loading, setLoading] = useState(false);

    const [uploadImage] = useMutation(UPLOAD_IMAGE, {
      onCompleted: async response => {
        try {
          const {id, uploadURL} = response.uploadImage.payload;
          const file = {
            name: `${name}.jpg`,
            type: image.mime,
            uri:
              Platform.OS === 'android'
                ? image.path
                : image.path.replace('file://', ''),
          };
          const body = new FormData();
          body.append('file', file);
          await fetch(uploadURL, {
            method: 'post',
            body,
          });
          onUploadImage(
            `https://imagedelivery.net/nMSC_wBKsLFA7zWhgLIlhw/${id}/public`,
          );
          setLoading(false);
        } catch (err) {
          setLoading(false);
          showMessage({
            message: err?.message || 'Some unknown error occurred. Try again!!',
            type: 'danger',
            icon: 'danger',
          });
        }
      },
      onError: err => {
        setLoading(false);
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
          icon: 'danger',
        });
      },
    });

    const handleImageUpload = useCallback(async () => {
      try {
        image = await ImageCropPicker.openPicker({
          width: 102,
          height: 102,
          cropping: true,
          cropperCircleOverlay: true,
        });
        setLoading(true);
        uploadImage();
      } catch (error) {
        if (error?.message !== 'User cancelled image selection') {
          if (error?.message === 'User did not grant camera permission.') {
            Alert.alert(
              'Open Settings',
              'Need camera permission to capture image.',
              [
                {text: 'Cancel', style: 'default'},
                {
                  text: 'Go to Settings',
                  style: 'destructive',
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          } else if (
            error?.message === 'User did not grant library permission.'
          ) {
            Alert.alert(
              'Open Settings',
              'Need library permission to select image.',
              [
                {text: 'Cancel', style: 'default'},
                {
                  text: 'Go to Settings',
                  style: 'destructive',
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          } else {
            showMessage({
              message: error?.message,
              type: 'danger',
              icon: 'danger',
            });
          }
        }
      }
    }, [uploadImage]);

    const imageByGender = useGenderImage(gender);

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={handleImageUpload}
        disabled={loading || !editable}
        style={tw`relative w-[${size}px] h-[${size}px]`}>
        <Image
          source={value ? {uri: value} : imageByGender}
          style={tw`rounded-full border border-gray-400 w-[${size - 1}px] h-[${
            size - 1
          }px]`}
        />
        {loading ? (
          <View
            style={tw`absolute inset-0 justify-center bg-black opacity-50 rounded-full`}>
            <ActivityIndicator size="large" color={tw.color('white')} />
          </View>
        ) : editable ? (
          <View style={tw`absolute right-0 bottom-2 bg-white rounded-full`}>
            <MaterialCommunityIcons
              size={15 + size / 12}
              name="pencil-circle"
              color={tw.color('blue-600')}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  },
);
