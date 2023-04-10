import {gql} from '@apollo/client';

export const DELETE_WEBSITE = gql`
  mutation deleteWebsite($websiteId: ID!) {
    deleteWebsite(websiteId: $websiteId) {
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
