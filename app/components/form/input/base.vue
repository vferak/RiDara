<script setup lang='ts'>
import { FieldContext } from 'vee-validate';

type SelectOption = {
    name: string,
    value: string,
    disabled?: boolean,
}

const props = defineProps<{
    name: string,
    field: FieldContext,
    type: string,
    options?: SelectOption[],
}>();

const value = props.field.value;
const meta = props.field.meta;
const errorMessage = props.field.errorMessage;

const isValid = computed<boolean>(
    () => (meta.validated && meta.valid)
);

const isError = computed<boolean>(
    () => !!(errorMessage.value && meta.touched)
);

const inputClasses = props.type === 'file' ?
    'file-input file-input-bordered' : 'input input-bordered input-sm';
</script>
<template>
    <div class="form-control mb-1">
        <label class='label'>
            <span class='label-text'>{{ props.name }}</span>
            <span class="label-text-alt">
                <BadgeError v-if='isError'>{{ errorMessage }}</BadgeError>
                <BadgeSuccess v-if='isValid'/>
            </span>
        </label>

        <select v-if='props.type === "select"'
                @click='field.setTouched'
                v-model='value'
                :class='{"select-error": isError, "select-success": isValid}'
                :name='field.label'
                class='select select-bordered select-sm'
        >
            <option v-for='option in props.options'
                    :key='option.value'
                    :value="option.value"
                    :disabled='option.disabled'
            >
                {{ option.name }}
            </option>
        </select>

        <input v-else @focusout='field.setTouched'
               v-model='value'
               :class='[inputClasses, {"input-error": isError, "input-success": isValid}]'
               :name='field.label'
               :type='props.type'
               :placeholder='props.name'
        />
    </div>
</template>
