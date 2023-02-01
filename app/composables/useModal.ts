export const useModal = (key: string) => {
    const modalState = useState<boolean>(key, () => false);

    const openModal = () => {
        modalState.value = true;
    };

    const closeModal = () => {
        modalState.value = false;
    };

    closeModal();

    return {
        modalState: modalState,
        openModal: openModal,
        closeModal: closeModal,
    };
}
