import {gql} from '@apollo/client';

export const CORE_BOOKMARK_FIELDS = gql`
  fragment CoreBookmarkFields on Bookmark {
    __typename
    _id
    user {
      __typename
      _id
    }
    refId
    type
    active
    createdAt
    updatedAt
  }
`;
