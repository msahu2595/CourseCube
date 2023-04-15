import {gql} from '@apollo/client';

export const BOOKMARK = gql`
  mutation bookmark($refId: ID!, $type: BookmarkType!) {
    bookmark(refId: $refId, type: $type) {
      code
      success
      message
      token
    }
  }
`;
