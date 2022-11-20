import {gql} from '@apollo/client';
import {CORE_BOOKMARK_FIELDS} from '@fragments';

export const UNBOOKMARK = gql`
  ${CORE_BOOKMARK_FIELDS}
  mutation unbookmark($refId: ID!, $type: BookmarkType!) {
    unbookmark(refId: $refId, type: $type) {
      code
      success
      message
      token
      payload {
        ...CoreBookmarkFields
      }
    }
  }
`;
