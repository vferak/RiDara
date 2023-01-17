<script setup lang='ts'>
import { FieldContext } from 'vee-validate';

const props = defineProps<{
    name: string,
    field: FieldContext,
    type: string
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
        <input @focusout='field.setTouched' v-model='value' :name='field.label' :type='props.type' :placeholder='props.name'
               class='input input-bordered input-sm' :class='[isError ? "input-error" : "", isValid ? "input-success" : ""]' />
    </div>
</template>
