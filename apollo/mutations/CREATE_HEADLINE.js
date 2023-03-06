import {gql} from '@apollo/client';

export const ADD_HEADLINE = gql`
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
