<script setup lang='ts'>
import { User } from '~/composables/types';

const { $z, $veeValidate } = useNuxtApp();
const props = defineProps<{
    users: User[]
}>();

const emit = defineEmits<{
    (event: 'formSent', userUuid: string, role: string): void
}>();

const createUserOptions = (users: User[]) => {
    const usersOptions = users.map((user) => {
        const name = user.firstName + ' ' + user.lastName;
        return {
            value: user.uuid,
            name: name,
            disabled: false,
        };
    });

    usersOptions.unshift({ value: '', name: 'Select user', disabled: true });
    return usersOptions;
}

const users = useState(() => createUserOptions(props.users));

watchEffect(() => {
    users.value = createUserOptions(props.users);
})

const roles = [
    {
        value: '',
        name: 'Select user',
        disabled: true,
    },
    {
        value: 'admin',
        name: 'Admin',
        disabled: false,
    },
    {
        value: 'user',
        name: 'User',
        disabled: false,
    },
];

const { handleSubmit, resetForm } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            userUuid: $z.string().refine((value) => value !== '' && users.value.some(
                (users) => users.value === value,
            ), { message: 'Selected invalid user' }),
            role: $z.string().refine((value) => value !== '' && (roles[1].value === value ||
                roles[2].value === value), { message: 'Selected invalid role' }),
        }),
    ),
});

const userUuid = $veeValidate.useField<string>('userUuid');
userUuid.setValue('');

const role = $veeValidate.useField<string>('role');
role.setValue('');

const onSubmit = handleSubmit(async (): Promise<void> => {
    emit('formSent', userUuid.value.value, role.value.value);
    resetForm();
    userUuid.setValue('');
    role.setValue('');
});

</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"User"' :type='"select"' :field='userUuid' :options='users' />
        <FormInputBase :name='"Role"' :type='"select"' :field='role' :options='roles' />
        <input type='submit' value='Submit' class='btn btn-sm mt-4' />
    </form>
</template>
