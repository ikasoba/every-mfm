<script setup lang="ts">
import { ref } from 'vue';
import MfmRender from './components/MfmRender.vue';

const content = ref("")
</script>

<template>
  <textarea v-model="content"></textarea><br/>
  <MfmRender :text="content"></MfmRender>
</template>