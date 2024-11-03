export type User = {
  id: string;
  email: string;
  fullname: string;
  address: {
    country: string;
    city: string;
    street: string;
  };
  version: number;
  updatedAt: string;
  createdAt: string;
};
