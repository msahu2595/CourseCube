import {gql} from '@apollo/client';

export const ADD_NOTIFICATION = gql`
Mutation($headlineInput: HeadlineInput!) {
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
}`;
