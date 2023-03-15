import {gql} from '@apollo/client';

export const ADD_WEBSITE = gql`
  mutation AddWebsite($websiteInput: WebsiteInput!) {
    addWebsite(websiteInput: $websiteInput) {
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
