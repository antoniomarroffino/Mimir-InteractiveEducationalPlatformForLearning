export const scrollToElement = (elementId: string, options: ScrollIntoViewOptions = { behavior: 'smooth' }) => {
    const element = document.querySelector(elementId);
    element?.scrollIntoView(options);
};