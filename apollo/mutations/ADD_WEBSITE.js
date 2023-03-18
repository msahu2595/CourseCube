import {gql} from '@apollo/client';

export const ADD_WEBSITE = gql`
  mutation addWebsite($websiteInput: WebsiteInput!) {
    addWebsite(websiteInput: $websiteInput) {
      code
      success
      message
      token
      payload {
        _id
        name
        link
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
