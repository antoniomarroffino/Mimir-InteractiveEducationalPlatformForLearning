import { createContext } from "react";
import {
  Role,
  UserWithoutCoursesDTO,
} from "../backend/target/backend-api-client/index.ts";

export type AuthContextType = {
  user: UserWithoutCoursesDTO | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
};

/*export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
});*/

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
