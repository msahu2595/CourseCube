import {gql} from '@apollo/client';

export const CREATE_HEADLINE = gql`
  mutation createHeadline($headlineInput: HeadlineInput!) {
    createHeadline(headlineInput: $headlineInput) {
      code
      success
      message
      token
      payload {
        _id
        image
        description
        link
        route
        params
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
