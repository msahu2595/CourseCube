import {gql} from '@apollo/client';

export const EDIT_WEBSITE = gql`
  mutation EditWebsite($websiteId: ID!, $websiteInput: WebsiteInput!) {
    editWebsite(websiteId: $websiteId, websiteInput: $websiteInput) {
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
