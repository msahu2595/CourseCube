import {gql} from '@apollo/client';

export const NOTIFICATIONS = gql`
  query notifications(
    $offset: Int
    $limit: Int
    $filter: NotificationsFilterInput
  ) {
    notifications(offset: $offset, limit: $limit, filter: $filter) {
      code
      success
      message
      token
      offset
      limit
      filter {
        type
        read
      }
      payload {
        _id
        userId
        title
        body
        icon
        type
        alert
        route
        params
        read
        createdAt
        updatedAt
      }
    }
  }
`;
