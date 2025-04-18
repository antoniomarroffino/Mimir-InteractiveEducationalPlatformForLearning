import { createContext } from "react";
import { Role, UserWithoutCoursesDTO } from "@dti-isin/backend-api-client";

export type AdminContextType = {
  isLoading: boolean;
  promoteUser: (email: string, newRole: Role) => void;
  error: Error | null;
  teachers: UserWithoutCoursesDTO[];
  isLoadingTeachers: boolean;
  errorTeachers: Error | null;
  fetchAllTeachers: () => Promise<void>;
};

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined
);
