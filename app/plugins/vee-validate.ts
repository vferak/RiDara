import { useForm, useField } from 'vee-validate';
import { toFormValidator, toFieldValidator } from '@vee-validate/zod';

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            veeValidate: {
                useForm: useForm,
                useField: useField,
                toFormValidator: toFormValidator,
                toFieldValidator: toFieldValidator
            }
        }
    };
});
