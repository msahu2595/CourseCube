import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useQuery} from '@apollo/client';
import playerRef from 'playerRef';
import {CONTENT} from '@queries';
import {tw} from '@lib';
import {
  Text,
  View,
  Platform,
  StatusBar,
  ToastAndroid,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import Orientation, {useLockListener} from 'react-native-orientation-locker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const VideoPlayer = ({contentId}) => {
  const {width, height} = useWindowDimensions();

  const {loading: queryLoading, data: queryData} = useQuery(CONTENT, {
    variables: {contentId},
  });

  const data = queryData?.content?.payload || {};

  return (
    <>
      {queryLoading ? (
        <View
          style={tw.style('bg-black', {
            width: width < height ? width : (height * 16) / 9,
            height: height < width ? height : (width * 9) / 16,
          })}
        />
      ) : (
        <Player link={data?.media?.link} />
      )}
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color('indigo-200'),
          tw.color('indigo-50'),
          tw.color('white'),
        ]}>
        <View style={tw`px-4 py-2`}>
          <Text
            style={tw`font-avSemi text-base text-gray-600`}
            numberOfLines={2}>
            {data?.title}
          </Text>
          <Text style={tw`font-avReg text-xs text-amber-600`} numberOfLines={1}>
            #CGPSE #ACS #SSC #Mains
          </Text>
          <Text
            style={tw.style('font-avReg', 'text-gray-600', 'text-sm', {
              fontSize: 10,
            })}
            numberOfLines={1}>
            {data?.media?.time} Mins | 50k Watched | 223 Likes
          </Text>
        </View>
        <View
          style={tw`flex-row justify-around border-t border-b border-gray-100 px-2`}>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign name="like1" size={20} color={tw.color('blue-600')} />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', 'text-blue-600', {
                fontSize: 10,
              })}>
              Likes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign name="sharealt" size={20} color={tw.color('blue-600')} />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', 'text-blue-600', {
                fontSize: 10,
              })}>
              Share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign
              name="questioncircleo"
              size={20}
              color={tw.color('blue-600')}
            />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', 'text-blue-600', {
                fontSize: 10,
              })}>
              Doubts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign name="download" size={20} color={tw.color('blue-600')} />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', 'text-blue-600', {
                fontSize: 10,
              })}>
              Download
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign name="message1" size={20} color={tw.color('blue-600')} />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', 'text-blue-600', {
                fontSize: 10,
              })}>
              Live
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
};

export default VideoPlayer;

const Player = memo(({link}) => {
  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();

  const [rate, setRate] = useState(1);
  const [mute, setMute] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playerKey, setPlayerKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRates, setPlaybackRates] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);

  const videoId = useMemo(() => {
    const arr = link?.split('https://youtu.be/');
    return arr[1];
  }, [link]);

  useEffect(() => {
    let interval = setInterval(() => {
      playerRef.current?.getCurrentTime().then(gotCurrentTime => {
        setCurrentTime(gotCurrentTime);
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useLockListener(orientation => {
    switch (orientation) {
      case 'PORTRAIT':
        setIsFullScreen(false);
        break;
      case 'LANDSCAPE-LEFT':
        setIsFullScreen(true);
        break;
      default:
        return;
    }
  });

  const onGoBack = useCallback(() => {
    if (isFullScreen) {
      Orientation.lockToPortrait();
    } else {
      navigation.goBack();
    }
  }, [isFullScreen, navigation]);

  // Youtube player callbacks

  const onError = useCallback(error => {
    console.log('onError', error);
  }, []);

  const onReady = useCallback(event => {
    // console.log('onReady', event);
  }, []);

  const onStateChange = useCallback(state => {
    switch (state) {
      case 'unstarted':
        playerRef.current?.getDuration().then(getDuration => {
          setDuration(getDuration);
        });
        playerRef.current?.getPlaybackRate().then(getPlaybackRate => {
          setRate(getPlaybackRate);
        });
        playerRef.current
          ?.getAvailablePlaybackRates()
          .then(getAvailablePlaybackRates => {
            setPlaybackRates(getAvailablePlaybackRates);
          });
        break;
      case 'video cue':
        break;
      case 'buffering':
        setIsLoading(false);
        break;
      case 'playing':
        setPlayerState(PLAYER_STATES.PLAYING);
        break;
      case 'paused':
        setPlayerState(PLAYER_STATES.PAUSED);
        break;
      case 'ended':
        setPlayerState(PLAYER_STATES.ENDED);
        break;
      default:
        break;
    }
  }, []);

  const onFullScreenChange = useCallback(status => {
    // console.log('onFullScreenChange', status);
  }, []);

  const onPlaybackRateChange = useCallback(playbackRate => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(`${playbackRate}x`, ToastAndroid.SHORT);
    }
  }, []);

  const onPlaybackQualityChange = useCallback(quality => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(
        `Video quality changed: ${quality?.toUpperCase()} `,
        ToastAndroid.SHORT,
      );
    }
  }, []);

  // Media controller actions

  const onPausePlayVideo = useCallback(e => {
    setPlayerState(e);
  }, []);

  const onReplayVideo = useCallback(() => {
    setPlayerKey(prev => prev + 1);
    setPlayerState(PLAYER_STATES.PLAYING);
  }, []);

  const onSeekVideo = useCallback(e => {
    playerRef.current?.seekTo(e);
    setIsLoading(true);
  }, []);

  const onSeekingVideo = useCallback(e => {
    // console.log('onSeekingVideo', e);
  }, []);

  const onRewindVideo = useCallback(() => {
    playerRef.current?.seekTo(currentTime - 10);
    setIsLoading(true);
  }, [currentTime]);

  const onForwardVideo = useCallback(() => {
    playerRef.current?.seekTo(currentTime + 10);
    setIsLoading(true);
  }, [currentTime]);

  const onToggleMute = useCallback(() => {
    setMute(prev => !prev);
  }, []);

  const onToggleSpeedVideo = useCallback(() => {
    if (Array.isArray(playbackRates)) {
      const availableRates = playbackRates.length;
      if (availableRates > 1) {
        const rateIndex = playbackRates.findIndex(r => r === rate);
        if (availableRates - 1 === rateIndex) {
          setRate(playbackRates[0]);
        } else {
          setRate(playbackRates[rateIndex + 1]);
        }
      }
    }
  }, [rate, playbackRates]);

  const toggleFullScreen = useCallback(
    e => {
      switch (isFullScreen) {
        case true:
          Orientation.lockToPortrait();
          break;
        case false:
          Orientation.lockToLandscapeLeft();
          break;
        default:
          return;
      }
    },
    [isFullScreen],
  );

  return (
    <View>
      <StatusBar hidden={true} />
      <View style={tw`self-center`} pointerEvents="none">
        <YoutubePlayer
          ref={playerRef}
          key={`Player-${playerKey}`}
          width={width < height ? width : (height * 16) / 9}
          height={height < width ? height : (width * 9) / 16}
          videoId={videoId}
          mute={mute}
          playbackRate={rate}
          forceAndroidAutoplay={true}
          play={playerState > 0 ? false : true}
          onError={onError}
          onReady={onReady}
          onChangeState={onStateChange}
          onFullScreenChange={onFullScreenChange}
          onPlaybackRateChange={onPlaybackRateChange}
          onPlaybackQualityChange={onPlaybackQualityChange}
          initialPlayerParams={{
            loop: true,
            controls: false,
            preventFullScreen: true,
            iv_load_policy: 3,
            modestbranding: true,
            rel: false,
          }}
        />
      </View>
      <MediaControls
        duration={duration}
        fadeOutDelay={3000}
        isFullScreen={isFullScreen}
        isLoading={isLoading}
        mainColor={tw.color('gray-400')}
        onFullScreen={toggleFullScreen}
        onPaused={onPausePlayVideo}
        onReplay={onReplayVideo}
        onSeek={onSeekVideo}
        onSeeking={onSeekingVideo}
        playerState={playerState}
        progress={currentTime}
        showOnStart={true}>
        <MediaControls.Toolbar>
          <View
            style={tw.style('flex-1', {
              height: '200%',
            })}>
            <View style={tw`h-2/4 flex-row justify-between`}>
              <TouchableOpacity onPress={onGoBack}>
                <AntDesign
                  name="arrowleft"
                  size={24}
                  color={tw.color('gray-300')}
                />
              </TouchableOpacity>
              <View style={tw`flex-row self-start`}>
                <TouchableOpacity
                  onPress={onToggleSpeedVideo}
                  disabled={isLoading || playbackRates.length < 2}
                  style={tw`m-1 px-1 min-w-8 h-8 items-center justify-center bg-gray-300 rounded shadow`}>
                  <Text style={tw`font-avSemi text-sm text-gray-600`}>
                    {rate}x
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onToggleMute}
                  disabled={isLoading}
                  style={tw`m-1 w-8 h-8 items-center justify-center ${
                    mute ? 'bg-blue-600' : 'bg-gray-300'
                  } rounded shadow`}>
                  <MaterialCommunityIcons
                    name="volume-mute"
                    size={22}
                    color={mute ? tw.color('white') : tw.color('gray-600')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={tw`h-2/4 flex-row justify-around items-center`}>
              <TouchableOpacity onPress={onRewindVideo} disabled={isLoading}>
                <MaterialCommunityIcons
                  name="rewind-10"
                  size={32}
                  color={tw.color('gray-300')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onForwardVideo} disabled={isLoading}>
                <MaterialCommunityIcons
                  name="fast-forward-10"
                  size={32}
                  color={tw.color('gray-300')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </MediaControls.Toolbar>
      </MediaControls>
    </View>
  );
});
