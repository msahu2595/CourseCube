import {tw} from '@lib';
import {FETCH_DOWNLOAD_URL} from '@queries';
import {TouchableOpacity} from 'react-native';
import {useApolloClient} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {fileDownloader, getDownload} from 'lib/fileHandler';
import React, {memo, useCallback, useEffect, useState} from 'react';

export const CCDownloadButton = memo(({content, children}) => {
  const client = useApolloClient();
  const navigation = useNavigation();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    setDownloading(true);
    getDownload(content?._id)
      .then(res => {
        console.log({res});
        setDownloaded(res ? true : false);
        setDownloading(false);
      })
      .catch(error => {
        console.log(error);
        setDownloading(false);
      });
  }, [content]);

  const handleNavigate = useCallback(
    ({contentId, contentTitle, contentSubType}) => {
      switch (contentSubType) {
        case 'Video':
          navigation.navigate('DownloadVideoViewScreen', {
            contentId,
            title: contentTitle,
          });
          break;
        case 'Document':
          navigation.navigate('DownloadDocumentViewScreen', {
            contentId,
            title: contentTitle,
          });
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  const onPress = useCallback(async () => {
    try {
      if (downloaded) {
        handleNavigate({
          contentId: content?._id,
          contentTitle: content?.title,
          contentSubType: content?.type,
          contentType: content?.__typename,
        });
      } else {
        switch (content?.type) {
          case 'Video': {
            setDownloading(true);
            const response = await client.query({
              query: FETCH_DOWNLOAD_URL,
              fetchPolicy: 'network-only',
              variables: {videoId: content?.media?._id},
            });
            const urls = response?.data?.fetchDownloadURL?.payload || [];
            console.log('urls', urls.length, urls);
            if (urls.length) {
              // TODO: Add select modal for downloading 360p or 720p
              const updatedContent = {
                ...content,
                media: {...content.media, url: urls[0].url},
              };
              console.log('updatedContent', updatedContent);
              const result = await fileDownloader(updatedContent);
              console.log('fileDownloader', {result});
              setDownloaded(true);
            }
            setDownloading(false);
            break;
          }
          case 'Document': {
            setDownloading(true);
            const result = await fileDownloader(content);
            console.log('fileDownloader', {result});
            setDownloaded(true);
            setDownloading(false);
            break;
          }
          default: {
            break;
          }
        }
      }
    } catch (error) {
      console.log('fileDownloader', error);
      setDownloading(false);
    }
  }, [downloaded, content, client, handleNavigate]);

  return (
    <TouchableOpacity
      disabled={!content || downloading}
      onPress={onPress}
      style={tw`opacity-${!content || downloading ? 50 : 100}`}>
      {children(downloaded)}
    </TouchableOpacity>
  );
});
