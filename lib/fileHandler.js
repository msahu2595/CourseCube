import {storage} from 'apollo/client';
import config from 'react-native-ultimate-config';
import {Alert, Linking, Platform} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';

const initialProps = {
  width: 102,
  height: 102,
  cropping: true,
  cropperCircleOverlay: true,
};

const requestURL = `${
  __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
}/upload`;

export const xhrFileUploader = async (filePath, fileType) => {
  console.log('I am xhr file uploader!');
  return new Promise((response, reject) => {
    try {
      const file = {
        name: 'file',
        type: fileType,
        uri:
          Platform.OS === 'android'
            ? filePath
            : filePath.replace('file://', ''),
      };
      const data = new FormData();
      data.append('file', file, 'Under-100KB.jpg');

      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.withCredentials = true;
      xhr.open('POST', requestURL);
      xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      if (storage.getString('token')) {
        xhr.setRequestHeader(
          'Authorization',
          `Bearer ${storage.getString('token')}`,
        );
        xhr.setRequestHeader('refresh-token', storage.getString('refresh'));
      }

      xhr.upload.addEventListener('progress', e => {
        const newProgress = Math.floor((e.loaded / e.total) * 100);
        console.log('progress: ', newProgress);
      });

      xhr.addEventListener('load', () => {
        console.log('load: ', xhr.response);
        response(xhr.response);
      });

      xhr.addEventListener('error', () => {
        console.log('error: ', xhr.response);
        reject(xhr.response?.message || 'Some error occurred!!');
      });

      xhr.addEventListener('abort', () => {
        console.log('abort: ', xhr.response);
        reject(xhr.response?.message || 'Uploading aborted!!');
      });

      xhr.send(data);
    } catch (error) {
      throw new Error(
        error?.message || 'Some unknown error occurred. Try again!!',
      );
    }
  });
};

export const fileUploader = async (filePath, fileType) => {
  console.log('I am file uploader!');
  try {
    const file = {
      name: 'file',
      type: fileType,
      uri:
        Platform.OS === 'android' ? filePath : filePath.replace('file://', ''),
    };
    const body = new FormData();
    body.append('file', file);
    const headers = {'Content-Type': 'multipart/form-data'};
    if (storage.getString('token')) {
      headers.authorization = `Bearer ${storage.getString('token')}`;
      headers['refresh-token'] = storage.getString('refresh');
    }
    const result = await fetch(requestURL, {
      body,
      headers,
      method: 'POST',
    }).then(response => response.json());
    return result;
  } catch (error) {
    throw new Error(
      error?.message || 'Some unknown error occurred. Try again!!',
    );
  }
};

export const fileRemover = async filePath => {
  console.log('I am file remover!');
  try {
    const headers = {'Content-Type': 'application/json'};
    if (storage.getString('token')) {
      headers.authorization = `Bearer ${storage.getString('token')}`;
      headers['refresh-token'] = storage.getString('refresh');
    }
    const result = await fetch(requestURL, {
      body: JSON.stringify({
        file: filePath,
      }),
      headers,
      method: 'DELETE',
    }).then(response => response.json());
    return result;
  } catch (error) {
    throw new Error(
      error?.message || 'Some unknown error occurred. Try again!!',
    );
  }
};

export const imageSelector = async (props = initialProps) => {
  console.log('I am image selector!');
  try {
    const image = await ImageCropPicker.openPicker(props);
    return image;
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
      } else if (error?.message === 'User did not grant library permission.') {
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
        throw new Error(
          error?.message || 'Some unknown error occurred. Try again!!',
        );
      }
    }
  }
};

export const imageUploader = async props => {
  console.log('I am image uploader!');
  try {
    const image = await imageSelector(props);
    if (!image?.path || !image?.mime) {
      throw new Error('Invalid image!!');
    }
    const result = await fileUploader(image?.path, image?.mime);
    return result;
  } catch (error) {
    throw new Error(
      error?.message || 'Some unknown error occurred. Try again!!',
    );
  }
};
