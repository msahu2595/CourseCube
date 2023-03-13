import {gql} from '@apollo/client';

export const ADD_DOCUMENT = gql`
  mutation AddDocument($documentInput: DocumentInput!) {
    addDocument(documentInput: $documentInput) {
      payload {
        _id
        title
        url
        pages
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
