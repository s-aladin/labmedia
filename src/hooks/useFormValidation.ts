import {computed, ComputedRef, ref, Ref} from "vue";

interface ValidationRule {
    validator: (value: any) => boolean;
    message: string;
}

interface FieldValidation {
    value: Ref<any>;
    rules: ValidationRule[];
}

interface ValidationResult {
    errors: Ref<Record<string, string[]>>;
    isValid: ComputedRef<boolean>;
}

export function useFormValidation(fields: Record<string, FieldValidation>): ValidationResult {
    const errors = ref<Record<string, string[]>>({});

    const validateField = (fieldName: string, value: any, rules: ValidationRule[]) => {
        const fieldErrors: string[] = [];

        rules.forEach(rule => {
            const passes = rule.validator(value);
            if(!passes) {
                fieldErrors.push(rule.message);
            }
        });

        errors.value[fieldName] = fieldErrors;
    };

    const isValid = computed(() => {
        let formValid = true;
        errors.value = {};

        Object.entries(fields).forEach(([fieldName, field]) => {
            validateField(fieldName, field.value.value, field.rules);

            if (errors.value[fieldName]?.length > 0) {
                formValid = false;
            }
        });

        return formValid;
    });

    return { errors, isValid };
}