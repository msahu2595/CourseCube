import {gql} from '@apollo/client';

export const ADD_DOCUMENT = gql`
  mutation AddDocument($documentInput: DocumentInput!) {
    addDocument(documentInput: $documentInput) {
      payload {
        _id
        title
        thumbnail
        pages
        enable
        createdAt
        updatedAt
        url
      }
    }
  }
`;
