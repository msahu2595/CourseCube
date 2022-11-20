import {gql} from '@apollo/client';
import {CORE_BOOKMARK_FIELDS} from '@fragments';

export const BOOKMARK = gql`
  ${CORE_BOOKMARK_FIELDS}
  mutation bookmark($refId: ID!, $type: BookmarkType!) {
    bookmark(refId: $refId, type: $type) {
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
