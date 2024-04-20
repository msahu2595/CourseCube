/* eslint-disable prettier/prettier */
import { storage } from 'apollo/client';
import config from 'react-native-ultimate-config';
import { Alert, Linking, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import ReactNativeBlobUtil from 'react-native-blob-util';
import ImageCropPicker from 'react-native-image-crop-picker';
import { addDownloadTask, removeDownloadTask } from 'downloaderRef';
import RNEncryptionModule from '@dhairyasharma/react-native-encryption';
import RNBackgroundDownloader from 'react-native-background-downloader';

const initialProps = {
  width: 400,
  height: 400,
  cropping: true,
  cropperCircleOverlay: true,
};

const requestURL = `${__DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
  }/upload`;

export const xhrFileUploader = async (filePath, fileType) => {
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
  try {
    const file = {
      name: 'file',
      type: fileType,
      uri:
        Platform.OS === 'android' ? filePath : filePath.replace('file://', ''),
    };
    const body = new FormData();
    body.append('file', file);
    const headers = { 'Content-Type': 'multipart/form-data' };
    if (storage.getString('token')) {
      headers.authorization = `Bearer ${storage.getString('token')}`;
      headers['refresh-token'] = storage.getString('refresh');
    }
    const result = await fetch(requestURL, {
      body,
      headers,
      method: 'POST',
    }).then(response => {
      //If the response status code is between 200-299, if so
      if (response.ok) {
        return response.json();
      }
      //if not, throw a error
      throw new Error('Network response was not ok');
    });
    return result;
  } catch (error) {
    throw new Error(
      error?.message || 'Some unknown error occurred. Try again!!',
    );
  }
};

export const fileRemover = async filePath => {
  try {
    const headers = { 'Content-Type': 'application/json' };
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
            { text: 'Cancel', style: 'default' },
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
            { text: 'Cancel', style: 'default' },
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
  try {
    const image = await imageSelector(props);
    if (!image?.path || !image?.mime) {
      throw new Error('Invalid image!!');
    }
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
    const result = await fileUploader(image?.path, image?.mime);
    return result;
  } catch (error) {
    throw new Error(
      error?.message || 'Some unknown error occurred. Try again!!',
    );
  }
};

export const fileDownloader = async (item) => {
  return new Promise((resolve, reject) => {
    try {
      let url;
      let fileName;
      if (item.type === 'Video' && item.media.link && item.media.url) {
        url = item.media.url;
        fileName = `${item.media.link.split('/').pop()}.mp4`;
      } else if (item.type === 'Document' && item.media.url) {
        url = `${
          __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
        }/${item.media.url}`;
        fileName = url.split('/').pop();
      }
      if (!url || !fileName) {
        throw new Error('Invalid file url/name!!');
      }
      const fileDest = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/offline/${fileName}`;
      let task = RNBackgroundDownloader.download({
        url: url,
        id: fileName,
        destination: fileDest,
      })
        .begin(expectedBytes => {
          console.log(`Going to download ${expectedBytes} bytes!`);
          addDownloadTask(task);
          showMessage({
            message: 'Download started',
            description:
              'You can check the downloaded progress in the download screen.',
            type: 'success',
          });
          ReactNativeBlobUtil.fs.df().then((stats) => {
            const freeSpace = Platform.OS === 'android' ? stats.internal_free : stats.free;
            console.log(`Free space available: ${freeSpace} bytes`);
            if (freeSpace < expectedBytes) {
              task.stop();
              removeDownloadTask(task.id);
              Alert.alert(
                'Insufficient Storage',
                'Please free up some space to download the file.',
              );
            }
          });
        })
        .done(async () => {
          try {
            console.log('Download is done: ', fileDest);
            removeDownloadTask(task.id);
            const file = await fileEncipher(fileDest, fileName);
            console.log('file', file);
            const result = await addDownload(item, file);
            showMessage({
              message: 'Download completed',
              description: 'You can check the downloaded file in the download screen.',
              type: 'success',
            });
            resolve(result);
          } catch (error) {
            console.log('Download canceled due to error: ', error);
            showMessage({
              message: 'Download canceled',
              description: error?.message || error || 'Some unknown error occurred!!, try again.',
              type: 'danger',
            });
            reject(error?.message || error || 'Some unknown error occurred!!, try again.');
          }
        })
        .error(error => {
          console.log('Download canceled due to error: ', error);
          removeDownloadTask(task.id);
          showMessage({
            message: 'Download canceled',
            description: error?.message || error || 'Some unknown error occurred!!, try again.',
            type: 'danger',
          });
          reject(error?.message || error || 'Some unknown error occurred!!, try again.');
        });
    } catch (error) {
      console.log('Download canceled: ', error);
      showMessage({
        message: 'Download canceled',
        description: error?.message || error || 'Some unknown error occurred!!, try again.',
        type: 'danger',
      });
      reject(error?.message || error || 'Some unknown error occurred!!, try again.');
    }
  });
};

export const getDownloads = async ({ offset = 0, limit = 10, type, search }) => {
  const destination = `${RNBackgroundDownloader.directories.documents}/offline/downloads.json`;
  if (await ReactNativeBlobUtil.fs.exists(destination)) {
    let downloads = await ReactNativeBlobUtil.fs.readFile(destination, 'utf8');
    downloads = JSON.parse(downloads);
    downloads = downloads.slice(offset, offset + limit);
    if (type) {
      downloads = downloads.filter(d => d.type === type);
    }
    if (search) {
      search = search.toLowerCase();
      downloads = downloads.filter(d => d.title.toLowerCase().includes(search));
    }
    return downloads;
  } else {
    return [];
  }
};

export const getDownload = async (id) => {
  const destination = `${RNBackgroundDownloader.directories.documents}/offline/downloads.json`;
  if (await ReactNativeBlobUtil.fs.exists(destination)) {
    const downloads = await ReactNativeBlobUtil.fs.readFile(destination, 'utf8');
    const parsedDownloads = JSON.parse(downloads);
    const download = parsedDownloads.find((downloadItem) => downloadItem._id === id);
    return download;
  } else {
    return null;
  }
};

const addDownload = async (item, file) => {
  try {
    const destination = `${RNBackgroundDownloader.directories.documents}/offline/downloads.json`;
    if (await ReactNativeBlobUtil.fs.exists(destination)) {
      const downloads = await ReactNativeBlobUtil.fs.readFile(destination, 'utf8');
      const parsedDownloads = JSON.parse(downloads);
      const isExist = parsedDownloads.some((download) => download._id === item._id);
      if (!isExist) {
        const obj = { ...item, media: { ...item.media, ...file } };
        await ReactNativeBlobUtil.fs.writeFile(destination, JSON.stringify([...parsedDownloads, obj]), 'utf8');
        return obj;
      }
    } else {
      const obj = { ...item, media: { ...item.media, ...file } };
      await ReactNativeBlobUtil.fs.writeFile(destination, JSON.stringify([obj]), 'utf8');
      return obj;
    }
  } catch (error) {
    console.log('addDownload error', error);
    throw new Error(
      error?.message || error || 'Some unknown error occurred!!, try again.',
    );
  }
};

export const removeDownload = async (id) => {
  try {
    const destination = `${RNBackgroundDownloader.directories.documents}/offline/downloads.json`;
    if (await ReactNativeBlobUtil.fs.exists(destination)) {
      const downloads = await ReactNativeBlobUtil.fs.readFile(destination, 'utf8');
      const parsedDownloads = JSON.parse(downloads);
      const filteredDownloads = parsedDownloads.filter((download) => download._id !== id);
      await ReactNativeBlobUtil.fs.writeFile(destination, JSON.stringify(filteredDownloads), 'utf8');
    }
  } catch (error) {
    console.log('removeDownload error', error);
    throw new Error(
      error?.message || error || 'Some unknown error occurred!!, try again.',
    );
  }
};

export const fileEncipher = async (filePath, fileName) => {
  try {
    console.log({ filePath }, { fileName });
    const encryptFileDir = `${RNBackgroundDownloader.directories.documents}/offline`;
    const encryptFileDest = `${encryptFileDir}/${fileName}`;
    const isDir = await ReactNativeBlobUtil.fs.isDir(encryptFileDir);
    console.log({ isDir });
    if (!isDir) {
      await ReactNativeBlobUtil.fs.mkdir(encryptFileDir);
    }
    const isDest = await ReactNativeBlobUtil.fs.exists(encryptFileDest);
    console.log({ isDest });
    if (isDest) {
      await ReactNativeBlobUtil.fs.unlink(encryptFileDest);
    }
    const res = await RNEncryptionModule.encryptFile(
      filePath,
      encryptFileDest,
      '1234567890123456',
    );
    console.log({ res });
    if (res?.status === 'success') {
      ReactNativeBlobUtil.fs.unlink(filePath).then(() => {
        console.log('File deleted successfully.');
      });
      return { file: encryptFileDest, iv: res?.iv, salt: res?.salt };
    } else {
      throw new Error(res?.error || 'Some unknown error occurred!!, try again.');
    }
  } catch (error) {
    throw new Error(
      error?.message || error || 'Some unknown error occurred!!, try again.',
    );
  }
};

export const fileDecipher = async (filePath, fileName, iv, salt) => {
  try {
    console.log({ filePath }, { fileName });
    const decryptFileDir = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/offline`;
    const decryptFileDest = `${decryptFileDir}/${fileName}`;
    const isDir = await ReactNativeBlobUtil.fs.isDir(decryptFileDir);
    console.log({ isDir });
    if (!isDir) {
      await ReactNativeBlobUtil.fs.mkdir(decryptFileDir);
    }
    const isDest = await ReactNativeBlobUtil.fs.exists(decryptFileDest);
    console.log({ isDest });
    if (isDest) {
      return decryptFileDest;
    }
    const res = await RNEncryptionModule.decryptFile(
      filePath,
      decryptFileDest,
      '1234567890123456',
      iv,
      salt,
    );
    console.log({ res });
    if (res?.status === 'success') {
      return decryptFileDest;
    } else {
      throw new Error(res?.error || 'Some unknown error occurred!!, try again.');
    }
  } catch (error) {
    showMessage({
      message: 'Error occurred while deciphering file',
      description: error?.message || error || 'Some unknown error occurred!!, try again.',
      type: 'danger',
    });
  }
};
