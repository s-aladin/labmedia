<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" @blur="validateField('email')" />
    <div v-if="errors.email">
      {{ errors.email.join(', ') }}
    </div>

    <input v-model="password" type="password" @blur="validateField('password')" />
    <div v-if="errors.password">
      {{ errors.password.join(', ') }}
    </div>

    <button :disabled="!isValid">Отправить</button>
  </form>

  <div>
    <button @click="getUsers">Загрузить данные</button>
    <div v-if="loading">Загрузка...</div>
    <div v-if="error">{{ error }}</div>
    <pre v-if="data">{{ data }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useApi } from "@/hooks/useApi";

const email = ref('');
const password = ref('');

const { isValid, errors, validate } = useFormValidation({
  email: {
    value: email,
    rules: [
      { validator: (v) => !!v, message: 'Email обязателен' },
      { validator: (v) => /.+@.+\..+/.test(v), message: 'Неверный формат email' },
    ],
  },
  password: {
    value: password,
    rules: [
      { validator: (v) => v.length >= 6, message: 'Пароль должен быть не менее 6 символов' },
    ],
  },
});

const validateField = (fieldName: string) => {
  validate();
};

const handleSubmit = () => {
  if (validate()) {
    alert('Форма валидна!');
  }
};

const { data, error, loading, request } = useApi({
  url: 'https://jsonplaceholder.typicode.com/users',
  method: 'GET',
});

const getUsers = () => {
  request();
};
</script>

<style>

</style>
