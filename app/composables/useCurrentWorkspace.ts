import { Workspace } from '~/composables/types';
import { useWorkspace } from '~/composables/useWorkspace';
import { Ref } from 'vue';

export const useCurrentWorkspace = () => {
    const { getWorkspace } = useWorkspace();

    const currentWorkspaceUuid = useCookie<string>('workspace-uuid');
    const currentWorkspace = useState<Workspace|undefined>();

    const getCurrentWorkspace = async (): Promise<Ref<Workspace|undefined>> => {
        if (!currentWorkspaceUuid.value) {
            return currentWorkspace;
        }

        const { data: workspace } = await getWorkspace(currentWorkspaceUuid.value!);
        currentWorkspace.value = workspace.value!;

        return currentWorkspace;
    }

    const setCurrentWorkspace = (workspaceUuid: string): void => {
        currentWorkspaceUuid.value = workspaceUuid;
    }

    const clearCurrentWorkspace = (): void => {
        currentWorkspaceUuid.value = null;
        currentWorkspace.value = undefined;
    }

    return {
        getCurrentWorkspace: getCurrentWorkspace,
        setCurrentWorkspace: setCurrentWorkspace,
        clearCurrentWorkspace: clearCurrentWorkspace,
    };
}
