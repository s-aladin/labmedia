<template>
  <form class="form" @submit.prevent="handleSubmit">
    <p class="form__title">Форма</p>
    <input v-model="email" @blur="() => touchedEmail = true"/>
    <div v-if="errors.email && touchedEmail">
      {{ errors.email.join(', ') }}
    </div>

    <input v-model="password" type="password" @blur="() => touchedPassword = true" />
    <div v-if="errors.password && touchedPassword">
      {{ errors.password.join(', ') }}
    </div>

    <button :disabled="!isValid">Отправить</button>
  </form>

  <div class="example-api">
    <p>Пример запроса</p>
    <button @click="request">Загрузить данные</button>
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

const touchedEmail = ref(false)
const touchedPassword = ref(false)

const { errors, isValid } = useFormValidation({
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

const handleSubmit = () => {
  if (isValid.value) {
    alert('Форма валидна!');
  }
};

const { data, error, loading, request } = useApi({
  url: 'https://jsonplaceholder.typicode.com/users',
  method: 'GET',
});
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  gap: 10px;
}

.example-api {
  margin-top: 30px;
}
</style>

