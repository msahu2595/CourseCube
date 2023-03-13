import {gql} from '@apollo/client';

export const ADD_CONTENT = gql`
  mutation AddContent($contentInput: ContentInput!) {
    addContent(contentInput: $contentInput) {
      payload {
        _id
        subject
        image
        title
        type
        paid
        description
        validity
        visible
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
