import {gql} from '@apollo/client';

export const DOCUMENTS = gql`
  query Documents {
    documents {
      code
      success
      message
      token
      offset
      limit
      search
      filter {
        enable
      }
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
