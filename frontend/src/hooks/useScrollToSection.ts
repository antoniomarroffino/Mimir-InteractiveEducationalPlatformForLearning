import { useCallback } from 'react';
import { scrollToElement } from '../utils/scrollUtils';

export const useScrollToSection = () => {
    const scrollToSection = useCallback((sectionId: string) => {
        scrollToElement(`#${sectionId}`);
    }, []);

    return scrollToSection;
};