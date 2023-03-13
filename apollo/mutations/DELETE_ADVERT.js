import {gql} from '@apollo/client';

export const DELETE_ADVERT = gql`
  mutation deleteAdvert($advertId: ID!) {
    deleteAdvert(advertId: $advertId) {
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
