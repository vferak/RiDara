export const useTitle = () => {
    const createTitle = (title: string): string => {
        return `RiDara | ${title}`;
    }

    return {
        createTitle: createTitle,
    };
}
