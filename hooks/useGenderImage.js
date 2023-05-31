export const useGenderImage = gender => {
  switch (gender) {
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
