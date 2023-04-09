import {gql} from '@apollo/client';

export const ADD_DOCUMENT = gql`
  mutation addDocument($documentInput: DocumentInput!) {
    addDocument(documentInput: $documentInput) {
      code
      success
      message
      token
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
