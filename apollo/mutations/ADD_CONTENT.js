import {gql} from '@apollo/client';

export const ADD_CONTENT = gql`
  mutation AddContent($contentInput: ContentInput!) {
    addContent(contentInput: $contentInput) {
      payload {
        image
        enable
        createdAt
        title
      }
    }
  }
`;
