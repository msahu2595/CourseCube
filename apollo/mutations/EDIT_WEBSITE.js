import {gql} from '@apollo/client';

export const EDIT_WEBSITE = gql`
  mutation editWebsite($websiteId: ID!, $websiteInput: WebsiteInput!) {
    editWebsite(websiteId: $websiteId, websiteInput: $websiteInput) {
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
