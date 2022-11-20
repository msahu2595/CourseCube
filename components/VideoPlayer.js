import {View, Text} from 'react-native';
import React from 'react';

const VideoPlayer = () => {
  return (
    <View>
      <Text>VideoPlayer</Text>
    </View>
  );
};

export default VideoPlayer;

// import React, {useCallback, useRef, useState} from 'react';
// import {useNavigation} from '@react-navigation/core';
// import {
//   View,
//   Text,
//   useWindowDimensions,
//   TouchableOpacity,
//   StatusBar,
//   ActivityIndicator,
// } from 'react-native';
// import tw from '@lib/tailwind';
// import Video from 'react-native-video';
// import {useQuery} from '@apollo/client';
// import Orientation, {
//   useOrientationChange,
// } from 'react-native-orientation-locker';
// import {FETCH_DOWNLOAD_URL} from '@queries';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const VideoPlayer = ({videoId}) => {
//   const width = useWindowDimensions().width;
//   const [urls, setUrls] = useState(null);

//   const {loading: queryLoading} = useQuery(FETCH_DOWNLOAD_URL, {
//     variables: {videoId},
//     onCompleted: res => {
//       console.log(res);
//       setUrls(res.fetchDownloadURL.payload);
//     },
//     onError: err => {
//       console.log(err);
//     },
//     fetchPolicy: 'network-only',
//   });

//   console.log(queryLoading, urls);

//   if (!videoId || !urls) {
//     return (
//       <View
//         style={tw.style('justify-center', {
//           width: width,
//           height: undefined,
//           aspectRatio: 16 / 9,
//         })}>
//         <ActivityIndicator size="large" color="#FFF" />
//       </View>
//     );
//   }

//   return <VideoPlayerView urls={urls} />;
// };

// const VideoPlayerView = ({urls}) => {
//   const currentTimeRef = useRef(null);
//   const videoPlayerRef = useRef();
//   const navigation = useNavigation();
//   const width = useWindowDimensions().width;
//   const height = useWindowDimensions().height;
//   useOrientationChange(orientation => {
//     // Handle orientation change
//     // console.log('useOrientationChange', orientation);
//     switch (orientation) {
//       case 'PORTRAIT':
//         // console.log('dismissFullscreenPlayer');
//         videoPlayerRef.current.dismissFullscreenPlayer();
//         break;
//       case 'PORTRAIT-UPSIDEDOWN':
//         // console.log('dismissFullscreenPlayer');
//         videoPlayerRef.current.dismissFullscreenPlayer();
//         break;
//       case 'LANDSCAPE-LEFT':
//         // console.log('presentFullscreenPlayer');
//         videoPlayerRef.current.presentFullscreenPlayer();
//         break;
//       case 'LANDSCAPE-RIGHT':
//         // console.log('presentFullscreenPlayer');
//         videoPlayerRef.current.presentFullscreenPlayer();
//         break;
//       default:
//         return;
//     }
//   });

//   // Go Back Screen
//   const onGoBack = useCallback(() => {
//     navigation.goBack();
//   }, [navigation]);

//   // States for Video Player
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [rate, setRate] = useState(1);
//   const [quality, setQuality] = useState(0);
//   const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   // Callback from Video Player
//   const onLoadVideo = useCallback(e => {
//     console.log('onLoadVideo', e);
//     setCurrentTime(e.currentTime);
//     setDuration(e.duration);
//   }, []);
//   const onError = useCallback(e => {
//     console.log('onError', e);
//   }, []);
//   const onReadyVideo = useCallback(
//     e => {
//       console.log('onReady', e);
//       setIsLoading(false);
//       if (currentTimeRef.current) {
//         videoPlayerRef.current.seek(currentTimeRef.current);
//       }
//       currentTimeRef.current = null;
//       if (isFullScreen) {
//         Orientation.lockToLandscape();
//       }
//     },
//     [isFullScreen],
//   );
//   const onBufferVideo = useCallback(e => {
//     console.log('onBufferVideo', e);
//     setIsLoading(true);
//   }, []);
//   const onProgressVideo = useCallback(e => {
//     // console.log('onProgressVideo', e);
//     setCurrentTime(e.currentTime);
//   }, []);
//   const onEndVideo = useCallback(e => {
//     // console.log('endVideo', e);
//     setPlayerState(2);
//   }, []);
//   const onFullscreenPlayerDidPresent = useCallback(e => {
//     // console.log('onFullscreenPlayerDidPresent', e);
//     setIsFullScreen(true);
//   }, []);
//   const onFullscreenPlayerDidDismiss = useCallback(e => {
//     // console.log('onFullscreenPlayerDidDismiss', e);
//     setIsFullScreen(false);
//   }, []);

//   // Actions on Video Player
//   const onPausePlayVideo = useCallback(e => {
//     // console.log('pauseVideo', e);
//     setPlayerState(e);
//   }, []);
//   const onRewindVideo = useCallback(
//     e => {
//       // console.log('onRewindVideo', e);
//       videoPlayerRef.current.seek(currentTime - 10);
//     },
//     [currentTime],
//   );
//   const onForwardVideo = useCallback(
//     e => {
//       // console.log('onForwardVideo', e);
//       videoPlayerRef.current.seek(currentTime + 10);
//     },
//     [currentTime],
//   );
//   const onSeekVideo = useCallback(e => {
//     // console.log('onSeekVideo', e);
//     videoPlayerRef.current.seek(e);
//     setIsLoading(true);
//   }, []);
//   const onSeekingVideo = useCallback(e => {
//     // console.log('onSeekVideo', e);
//     setCurrentTime(e);
//   }, []);
//   const onToggleSpeedVideo = useCallback(() => {
//     console.log('onToggleSpeedVideo', rate);
//     switch (rate) {
//       case 0.75:
//         console.log('rate', 0.75);
//         setRate(1);
//         break;
//       case 1:
//         console.log('rate', 1);
//         setRate(1.25);
//         break;
//       case 1.25:
//         console.log('rate', 1.25);
//         setRate(1.5);
//         break;
//       case 1.5:
//         console.log('rate', 1.5);
//         setRate(1.75);
//         break;
//       case 1.75:
//         console.log('rate', 1.75);
//         setRate(2);
//         break;
//       case 2:
//         console.log('rate', 2);
//         setRate(0.75);
//         break;
//       default:
//         return;
//     }
//   }, [rate]);
//   const onToggleQualityVideo = useCallback(() => {
//     console.log('quality', quality);
//     currentTimeRef.current = currentTime;
//     setIsLoading(true);
//     switch (quality) {
//       case 0:
//         console.log('360 ==>', 720);
//         setQuality(1);
//         break;
//       case 1:
//         console.log('720 ==>', 360);
//         setQuality(0);
//         break;
//       default:
//         return;
//     }
//   }, [quality, currentTime]);
//   const toggleFullScreen = useCallback(
//     e => {
//       // console.log('toggleFullScreen', isFullScreen);
//       switch (isFullScreen) {
//         case true:
//           // console.log('lockToPortrait');
//           Orientation.lockToPortrait();
//           break;
//         case false:
//           // console.log('lockToLandscape');
//           Orientation.lockToLandscape();
//           break;
//         default:
//           return;
//       }
//     },
//     [isFullScreen],
//   );

//   return (
//     <>
//       <StatusBar
//         hidden={isFullScreen}
//         backgroundColor={tw.color('indigo-200')}
//         barStyle="dark-content"
//       />
//       <View
//         style={tw.style('self-center', {
//           width: isFullScreen ? undefined : width,
//           height: isFullScreen ? height : undefined,
//           aspectRatio: 16 / 9,
//         })}>
//         <Video
//           ref={videoPlayerRef}
//           key={quality}
//           source={{
//             uri: urls[quality]?.url,
//           }}
//           repeat={true}
//           controls={false}
//           resizeMode="cover"
//           progressUpdateInterval={1000}
//           rate={rate}
//           paused={playerState === 1}
//           onLoad={onLoadVideo}
//           onError={onError}
//           onReadyForDisplay={onReadyVideo}
//           onBuffer={onBufferVideo}
//           onProgress={onProgressVideo}
//           onEnd={onEndVideo}
//           onFullscreenPlayerDidPresent={onFullscreenPlayerDidPresent}
//           onFullscreenPlayerDidDismiss={onFullscreenPlayerDidDismiss}
//           pictureInPicture={false}
//           playInBackground={false}
//           bufferConfig={{
//             minBufferMs: 15000,
//             maxBufferMs: 50000,
//             bufferForPlaybackMs: 1000,
//             bufferForPlaybackAfterRebufferMs: 5000,
//           }}
//           style={tw`absolute inset-0`}
//         />
//         <MediaControls
//           duration={duration}
//           progress={currentTime}
//           isFullScreen={isFullScreen}
//           onFullScreen={toggleFullScreen}
//           playerState={playerState}
//           isLoading={isLoading}
//           onPaused={onPausePlayVideo}
//           onSeek={onSeekVideo}
//           onSeeking={onSeekingVideo}
//           mainColor={tw.color('gray-400')}>
//           <MediaControls.Toolbar>
//             <View
//               style={tw.style('flex-1', {
//                 height: '200%',
//               })}>
//               <View style={tw`h-2/4 flex-row justify-between`}>
//                 <TouchableOpacity onPress={onGoBack}>
//                   <AntDesign
//                     name="arrowleft"
//                     size={24}
//                     color={tw.color('gray-300')}
//                   />
//                 </TouchableOpacity>
//                 <View style={tw`flex-row self-start`}>
//                   <TouchableOpacity
//                     onPress={onToggleSpeedVideo}
//                     style={tw`m-1 py-1 px-2 bg-gray-300 rounded shadow`}>
//                     <Text style={tw`font-avSemi text-xs text-gray-600`}>
//                       {rate}x
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={onToggleQualityVideo}
//                     style={tw`m-1 py-1 px-2 bg-gray-300 rounded shadow`}>
//                     <Text style={tw`font-avSemi text-xs text-gray-600`}>
//                       {quality ? '720' : '360'}p
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               <View style={tw`h-2/4 flex-row justify-around items-center`}>
//                 <TouchableOpacity onPress={onRewindVideo}>
//                   <MaterialCommunityIcons
//                     name="rewind-10"
//                     size={32}
//                     color={tw.color('gray-300')}
//                   />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={onForwardVideo}>
//                   <MaterialCommunityIcons
//                     name="fast-forward-10"
//                     size={32}
//                     color={tw.color('gray-300')}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </MediaControls.Toolbar>
//         </MediaControls>
//       </View>
//     </>
//   );
// };

// export default VideoPlayer;
