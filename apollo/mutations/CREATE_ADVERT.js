import {gql} from '@apollo/client';

export const CREATE_ADVERT = gql`
  mutation createAdvert($advertInput: AdvertInput!) {
    createAdvert(advertInput: $advertInput) {
      code
      success
      message
      token
      payload {
        _id
        image
        type
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
