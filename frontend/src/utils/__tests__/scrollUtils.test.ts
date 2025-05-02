import { describe, it, expect, vi } from "vitest";
import { scrollToElement } from "../scrollUtils";

describe('scrollToElement utility', () => {
    it('should call scrollIntoView on the element with default options', () => {
        const mockScroll = vi.fn();
        const mockElement = { scrollIntoView: mockScroll };

        vi.spyOn(document, 'querySelector').mockReturnValueOnce(mockElement as unknown as Element);

        scrollToElement('#test');

        expect(document.querySelector).toHaveBeenCalledWith('#test');
        expect(mockScroll).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should call scrollIntoView with custom options', () => {
        const mockScroll = vi.fn();
        const mockElement = { scrollIntoView: mockScroll };

        vi.spyOn(document, 'querySelector').mockReturnValueOnce(mockElement as unknown as Element);

        const customOptions: ScrollIntoViewOptions = { behavior: 'auto', block: 'center' };
        scrollToElement('#custom', customOptions);

        expect(document.querySelector).toHaveBeenCalledWith('#custom');
        expect(mockScroll).toHaveBeenCalledWith(customOptions);
    });

    it('should do nothing if the element is not found', () => {
        vi.spyOn(document, 'querySelector').mockReturnValueOnce(null);

        expect(() => scrollToElement('#nonexistent')).not.toThrow();
        expect(document.querySelector).toHaveBeenCalledWith('#nonexistent');
    });
});
