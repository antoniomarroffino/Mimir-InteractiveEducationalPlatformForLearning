import {describe, expect, it, Mock, vi} from 'vitest';
import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import {useCourseCRUD} from "../useCourseCRUD.ts";
import {CourseCRUDContext} from "../../../contexts/course/CourseCRUDContext.ts";

vi.mock('react', () => ({
    ...vi.importActual('react'),
    useContext: vi.fn(),
    createContext: vi.fn(),
}));

describe('useCourseCRUD', () => {
    const mockContextValue = {
        createCourse: vi.fn(),
        updateCourse: vi.fn(),
        assignCourse: vi.fn(),
        leftCourse: vi.fn(),
        deleteCourse: vi.fn(),
        isCreatingCourse: false,
        isUpdatingCourse: false,
        isAssigningCourse: false,
        isLeftCourse: false,
        isDeletingCourse: false,
        errorCreateCourse: null,
        errorUpdateCourse: null,
        errorAssignCourse: null,
        errorLeftCourse: null,
        errorDeleteCourse: null,
    };

    it('should throw error when context is undefined', () => {
        (useContext as Mock).mockReturnValue(undefined);

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useCourseCRUD())).toThrowError(
            'useCourseCRUD must be used within a CourseCRUDProvider'
        );

        consoleError.mockRestore();
    });

    it('should return context when available', () => {
        (useContext as Mock).mockReturnValue(mockContextValue);

        const { result } = renderHook(() => useCourseCRUD());

        expect(result.current).toMatchObject(mockContextValue);
        expect(useContext).toHaveBeenCalledWith(CourseCRUDContext);
    });

    it('should maintain referential equality between renders', () => {
        (useContext as Mock).mockReturnValue(mockContextValue);

        const { result, rerender } = renderHook(() => useCourseCRUD());
        const firstResult = result.current;

        rerender();

        expect(result.current).toBe(firstResult);
    });
});