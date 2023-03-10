import {gql} from '@apollo/client';

export const CREATE_ADVERT = gql`
  mutation CreateAdvert($advertInput: AdvertInput!) {
    createAdvert(advertInput: $advertInput) {
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
