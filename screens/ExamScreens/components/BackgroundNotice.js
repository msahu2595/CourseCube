import dayjs from 'dayjs';
import {Alert, AppState} from 'react-native';
import {forwardRef, memo, useEffect, useRef} from 'react';

const BackgroundNotice = memo(
  forwardRef((props, appStateListener) => {
    const backgroundTimes = useRef(0);
    const activeTimestamp = useRef(null);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
      appStateListener.current = AppState.addEventListener(
        'change',
        nextAppState => {
          console.log('===========appStateListener=============');
          switch (nextAppState) {
            case 'background':
              console.log('App is in BACKGROUND state.');
              if (!activeTimestamp.current && appState.current === 'active') {
                appState.current = 'background';
                activeTimestamp.current = dayjs();
              }
              break;
            case 'active':
              console.log('App is in ACTIVE state.');
              if (
                activeTimestamp.current &&
                appState.current === 'background'
              ) {
                appState.current = 'active';
                backgroundTimes.current += 1;
                const timeDifference = dayjs().diff(
                  activeTimestamp.current,
                  'second',
                );
                console.log('timeDifference ==> ', timeDifference);
                activeTimestamp.current = null;
                if (timeDifference > 30) {
                  Alert.alert(
                    'Disqualify',
                    'As per our exam rule, We are disqualify yor from this exam as you are in background for more than 30 second. Please take care on your next exam.',
                    [{text: 'Ok', onPress: props?.exitExam}],
                  );
                } else {
                  if (backgroundTimes.current < 3) {
                    Alert.alert(
                      'Warning',
                      `This is ${
                        backgroundTimes.current < 2 ? '1st' : 'last'
                      } warning, if you minimize the app while exam is in progress we can disqualify yor from this exam.`,
                    );
                  } else {
                    Alert.alert(
                      'Disqualify',
                      'As per our exam rule, We are disqualify yor from this exam as you had minimized app more than 2 times while exam is in progress.',
                      [{text: 'Ok', onPress: props?.exitExam}],
                    );
                  }
                }
              }
              break;
            default:
              break;
          }
          console.log('===========appStateListener=============');
        },
      );
      return () => {
        appStateListener.current?.remove();
      };
    }, [appStateListener, props?.exitExam]);

    return null;
  }),
);

export default BackgroundNotice;
