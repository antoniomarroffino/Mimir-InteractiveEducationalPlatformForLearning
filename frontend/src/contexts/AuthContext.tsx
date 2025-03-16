import { createContext } from 'react';
import { UserWithoutCoursesDTO } from '@dti-isin/backend-api-client';

type AuthContextType = {
    user: UserWithoutCoursesDTO | null;
    token: string | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isLoading: false,
    login: () => {},
    logout: () => {},
    hasRole: () => false,
});