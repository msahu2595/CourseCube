import {tw} from '@lib';
import {CONTENT} from '@queries';
import {LIKE, UNLIKE} from '@mutations';
import {useMutation} from '@apollo/client';
import React, {memo, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';

export const CCLikeButton = memo(
  ({refId, initial = false, refetchQueries = [], children}) => {
    const [liked, setLiked] = useState(initial);

    const [like] = useMutation(LIKE, {
      variables: {refId},
      onCompleted: data => {
        if (!data?.like?.success) {
          setLiked(false);
        }
      },
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
        });
        setLiked(false);
      },
      refetchQueries,
    });

    const [unlike] = useMutation(UNLIKE, {
      variables: {refId},
      onCompleted: data => {
        if (!data?.unlike?.success) {
          setLiked(true);
        }
      },
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
        });
        setLiked(true);
      },
      refetchQueries: [{query: CONTENT, variables: {contentId: refId}}],
    });

    const onPress = () => {
      if (liked) {
        unlike();
        setLiked(false);
      } else {
        like();
        setLiked(true);
      }
    };

    return (
      <TouchableOpacity
        disabled={!refId}
        onPress={onPress}
        style={tw`opacity-${refId ? 100 : 50}`}>
        {children(liked)}
      </TouchableOpacity>
    );
  },
);
