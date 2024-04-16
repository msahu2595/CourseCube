import React, {memo, useCallback, useMemo, useState} from 'react';
import {youtubePlayerRef} from 'playerRef';
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
import YoutubePlayer from 'react-native-youtube-iframe';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import Orientation, {useLockListener} from 'react-native-orientation-locker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const YoutubeVideoPlayer = memo(props => {
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
    const arr = props?.link?.split('https://youtu.be/');
    return arr[1];
  }, [props?.link]);

  useFocusEffect(
    useCallback(() => {
      let interval = setInterval(() => {
        youtubePlayerRef.current?.getCurrentTime().then(gotCurrentTime => {
          setCurrentTime(gotCurrentTime);
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }, []),
  );

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
    console.log('VideoPlayer Error:', error);
  }, []);

  const onStateChange = useCallback(state => {
    switch (state) {
      case 'unstarted':
        youtubePlayerRef.current?.getDuration().then(getDuration => {
          setDuration(getDuration);
        });
        youtubePlayerRef.current?.getPlaybackRate().then(getPlaybackRate => {
          setRate(getPlaybackRate);
        });
        youtubePlayerRef.current
          ?.getAvailablePlaybackRates()
          .then(getAvailablePlaybackRates => {
            setPlaybackRates(getAvailablePlaybackRates);
          });
        break;
      case 'video cue':
        break;
      case 'buffering':
        break;
      case 'playing':
        setIsLoading(false);
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
    setIsLoading(true);
    youtubePlayerRef.current?.seekTo(e);
  }, []);

  const onSeekingVideo = useCallback(e => {
    // console.log('onSeekingVideo', e);
  }, []);

  const onRewindVideo = useCallback(() => {
    setIsLoading(true);
    youtubePlayerRef.current?.seekTo(currentTime - 10);
  }, [currentTime]);

  const onForwardVideo = useCallback(() => {
    setIsLoading(true);
    youtubePlayerRef.current?.seekTo(currentTime + 10);
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
          ref={youtubePlayerRef}
          key={`Player-${playerKey}`}
          width={width < height ? width : (height * 16) / 9}
          height={height < width ? height : (width * 9) / 16}
          videoId={videoId}
          mute={mute}
          playbackRate={rate}
          forceAndroidAutoplay={true}
          play={playerState > 0 ? false : true}
          onError={onError}
          onReady={props?.onVideoStart}
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

export default YoutubeVideoPlayer;
