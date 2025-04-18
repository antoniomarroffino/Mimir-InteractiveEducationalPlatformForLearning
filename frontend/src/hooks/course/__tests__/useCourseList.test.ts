import {describe, expect, it, Mock, vi} from 'vitest';
import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import {useCourseList} from "../useCourseList.ts";
import {CourseListContext, CourseListContextType} from "../../../contexts/course/CourseListContext.ts";
import {CourseDTO} from "@dti-isin/backend-api-client";

vi.mock('react', () => ({
    ...vi.importActual('react'),
    useContext: vi.fn(),
    createContext: vi.fn(),
}));

describe('useCourseList', () => {
    const mockCourses: CourseDTO[] = [
        { id: '1', name: 'Course 1' },
        { id: '2', name: 'Course 2' }
    ];

    const mockContextValue: CourseListContextType = {
        teacherCourses: mockCourses,
        allCourses: mockCourses,
        isLoadingTeacherCourses: false,
        isLoadingAllCourses: false,
        errorTeacherCourses: null,
        errorAllCourses: null,
        fetchTeacherCourses: vi.fn().mockResolvedValue(undefined),
        fetchAllCourses: vi.fn().mockResolvedValue(undefined)
    };

    it('should throw error when context is undefined', () => {
        (useContext as Mock).mockReturnValue(undefined);

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useCourseList())).toThrowError(
            'useCourseList must be used within a CourseListProvider'
        );

        consoleError.mockRestore();
    });

    it('should return context when available', () => {
        (useContext as Mock).mockReturnValue(mockContextValue);

        const { result } = renderHook(() => useCourseList());

        expect(result.current).toMatchObject(mockContextValue);
        expect(useContext).toHaveBeenCalledWith(CourseListContext);
    });

    it('should maintain referential equality between renders', () => {
        (useContext as Mock).mockReturnValue(mockContextValue);

        const { result, rerender } = renderHook(() => useCourseList());
        const firstResult = result.current;

        rerender();

        expect(result.current).toBe(firstResult);
    });
});