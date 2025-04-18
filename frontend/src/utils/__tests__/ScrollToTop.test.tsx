import {describe, expect, it, vi, Mock} from 'vitest';
import {render} from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import ScrollToTop from "../ScrollToTop.tsx";

vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(() => ({ pathname: '/' })),
}));

const scrollToMock = vi.fn();
window.scrollTo = scrollToMock;

describe('ScrollToTop Component', () => {
    it('should scroll to top on initial render', () => {
        render(<ScrollToTop />);

        expect(scrollToMock).toHaveBeenCalledTimes(1);
        expect(scrollToMock).toHaveBeenCalledWith({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });

    it('should scroll to top when pathname changes', async () => {
        const { rerender } = render(<ScrollToTop />);

        (useLocation as Mock).mockImplementationOnce(() => ({
            pathname: '/new-route'
        }));

        rerender(<ScrollToTop />);

        expect(scrollToMock).toHaveBeenCalledTimes(2);
        expect(scrollToMock).toHaveBeenNthCalledWith(2, {
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });

    it('should not scroll when pathname remains the same', () => {
        const { rerender } = render(<ScrollToTop />);
        rerender(<ScrollToTop />);

        expect(scrollToMock).toHaveBeenCalledTimes(1);
    });

    it('should return null', () => {
        const { container } = render(<ScrollToTop />);
        expect(container.firstChild).toBeNull();
    });
});