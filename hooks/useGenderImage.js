import {useReactiveVar} from '@apollo/client';
import {loggedUserVar} from 'apollo/client';

export const useGenderImage = gender => {
  const user = useReactiveVar(loggedUserVar);

  switch (gender || user?.gender) {
    case 'MALE':
      return require('@images/person-male.png');
    case 'FEMALE':
      return require('@images/person-female.png');
    case 'UNKNOWN':
      return require('@images/person-neutral.png');
    default:
      return require('@images/person-neutral.png');
  }
};
