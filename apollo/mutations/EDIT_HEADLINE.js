import {gql} from '@apollo/client';

export const EDIT_HEADLINE = gql`
  mutation editHeadline($headlineId: ID!, $headlineInput: HeadlineInput!) {
    editHeadline(headlineId: $headlineId, headlineInput: $headlineInput) {
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
