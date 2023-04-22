import {CONTENT} from '@queries';
import {useMutation} from '@apollo/client';
import React, {memo, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {BOOKMARK, UNBOOKMARK} from '@mutations';
import {showMessage} from 'react-native-flash-message';

export const CCBookmarkButton = memo(
  ({refId, type, subType, initial = false, children}) => {
    const [bookmarked, setBookmarked] = useState(initial);

    const [bookmark] = useMutation(BOOKMARK, {
      onCompleted: data => {
        console.log(data);
        if (!data?.bookmark?.success) {
          setBookmarked(false);
        }
      },
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
          icon: 'danger',
        });
        setBookmarked(false);
      },
      refetchQueries: [{query: CONTENT, variables: {contentId: refId}}],
    });

    const [unbookmark] = useMutation(UNBOOKMARK, {
      variables: {refId},
      onCompleted: data => {
        console.log(data);
        if (!data?.unbookmark?.success) {
          setBookmarked(true);
        }
      },
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
          icon: 'danger',
        });
        setBookmarked(true);
      },
      refetchQueries: [{query: CONTENT, variables: {contentId: refId}}],
    });

    const onPress = () => {
      if (bookmarked) {
        unbookmark();
        setBookmarked(false);
      } else {
        const variables = {refId, type};
        if (subType) {
          variables.subType = subType;
        }
        bookmark({variables});
        setBookmarked(true);
      }
    };

    return (
      <TouchableOpacity disabled={!refId} onPress={onPress}>
        {children(bookmarked)}
      </TouchableOpacity>
    );
  },
);
