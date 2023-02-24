import {gql} from '@apollo/client';

export const DOCUMENTS = gql`
  query ExampleQuery {
    user {
      code
    }
    documents {
      payload {
        _id
        title
        thumbnail
        url
        pages
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
