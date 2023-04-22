import {gql} from '@apollo/client';

export const BOOKMARK = gql`
  mutation bookmark(
    $refId: ID!
    $type: BookmarkType!
    $subType: BookmarkSubType
  ) {
    bookmark(refId: $refId, type: $type, subType: $subType) {
      code
      success
      message
      token
    }
  }
`;
