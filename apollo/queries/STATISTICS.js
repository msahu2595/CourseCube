import {gql} from '@apollo/client';

export const STATISTICS = gql`
  query statistics {
    statistics {
      code
      success
      message
      payload {
        __typename
        _id
        videos
        tests
        documents
        questions
      }
    }
  }
`;
