import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useScrollToSection } from '../useScrollToSection';

describe('useScrollToSection', () => {
    it('should call scrollToElement with correct selector', () => {
        const mockScrollToElement = vi.fn();

        const { result } = renderHook(() => useScrollToSection(mockScrollToElement));

        result.current('section-id');

        expect(mockScrollToElement).toHaveBeenCalledWith('#section-id');
    });
});
