import {gql} from '@apollo/client';

export const DELETE_WEBSITE = gql`
  mutation DeleteWebsite($websiteId: ID!) {
    deleteWebsite(websiteId: $websiteId) {
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
