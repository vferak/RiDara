import { User } from '~/composables/types';

export const useCurrentUser = () => {
    const currentUser = useState<User|undefined>();

    const getCurrentUser = (): User|undefined => {
        return currentUser.value;
    }

    const setCurrentUser = (user: User): void => {
        currentUser.value = user;
    }

    const clearCurrentUser = (): void => {
        currentUser.value = undefined;
    }

    return {
        getCurrentUser: getCurrentUser,
        setCurrentUser: setCurrentUser,
        clearCurrentUser: clearCurrentUser,
    };
}
