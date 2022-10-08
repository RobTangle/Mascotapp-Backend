import { Pet } from "./petTypes";
import { IReview } from "./reviewTypes";
import { ITransaction } from "./transactionTypes";

export interface IUserAttributes {
  id: string;
  email: string;
  name: string;
  city: string | undefined;
  contact: string | undefined;
  image: string | undefined;
  isDonator: string | undefined;
  isAdopter: number | undefined;
  gaveUpForAdoption: number | undefined;
  foundAPet: number | undefined;
  gotAPetBack: number | undefined;
  points: number | undefined;
  endpoints: Text;
  linkToDonate: string | undefined;
  isBanned: string | undefined;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

export interface INewUser {
  id: string;
  email: string;
  name: string;
  contact?: string;
  city?: string;
  image?: string;
  linkToDonate?: string;
}

export interface ISomeUserInfo {
  name: string | undefined;
  city: string | undefined;
  image: string | undefined;
  contact: string | undefined;
  isDonator: string | undefined;
  isAdopter: number | undefined;
  gaveUpForAdoption: number | undefined;
  foundAPet: number | undefined;
  gotAPetBack: number | undefined;
  points: number | undefined;
  linkToDonate: string | undefined;
  endpoints: Text;
  isBanned: string | undefined;
  isAdmin?: boolean;
}

export interface IMultipleUserInfo {
  userProps: ISomeUserInfo;
  reviews: IReview[];
  transactions: ITransaction[];
  posts: Pet[];
}

export interface IContactInfoOfOwner {
  name: string | undefined;
  email: string | undefined;
  city: string | undefined;
  image: string | undefined;
  contact: string | undefined;
  isDonator: string | undefined;
  linkToDonate: string | undefined;
  reviews: any;
}
