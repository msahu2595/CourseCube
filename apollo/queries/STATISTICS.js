import {gql} from '@apollo/client';

export const STATISTICS = gql`
  query statistics($userId: ID) {
    statistics(userId: $userId) {
      code
      success
      message
      token
      payload {
        __typename
        _id
        videos
        tests
        documents
        articles
      }
    }
  }
`;
