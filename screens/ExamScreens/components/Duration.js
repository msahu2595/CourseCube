import dayjs from 'dayjs';
import {Text, View} from 'react-native';
import React, {forwardRef, memo, useEffect, useState} from 'react';

const Duration = memo(
  forwardRef(({duration, onTimeUp, containerStyle, textStyle}, timer) => {
    const [time, setTime] = useState(dayjs.duration(duration).asMilliseconds());

    useEffect(() => {
      if (time <= 0) {
        onTimeUp();
      }
    }, [time, onTimeUp]);

    useEffect(() => {
      timer.current = setInterval(() => {
        setTime(prev => {
          if (prev - 1000 > 0) {
            return prev - 1000;
          } else {
            clearInterval(timer.current);
            return 0;
          }
        });
      }, 1000);
      return () => {
        clearInterval(timer.current);
      };
    }, [timer]);

    return (
      <View style={containerStyle}>
        <Text style={textStyle}>
          {new Date(time).toISOString().slice(11, 19)}
        </Text>
      </View>
    );
  }),
);

export default Duration;
