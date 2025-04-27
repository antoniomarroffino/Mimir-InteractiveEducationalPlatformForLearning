import { useCallback } from 'react';
import { scrollToElement as defaultScrollToElement } from '../../utils/scrollUtils.ts';

export const useScrollToSection = (customScrollToElement = defaultScrollToElement) => {
    return useCallback((sectionId: string) => {
        customScrollToElement(`#${sectionId}`);
    }, [customScrollToElement]);
};
