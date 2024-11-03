import { User } from "../types/entities";

export const displayInitials = (user: User) => {
  const splitedUser = user.fullname.split(" ");

  if (splitedUser.length > 1) {
    return `${splitedUser[0][0]}${splitedUser[1][0]}`;
  } else {
    return `${splitedUser[0][0]}${splitedUser[0][1]}`;
  }
};
