<template>
  <input type="file" @change="onFileSelected" />
  <p v-if="fileContent">{{ fileContent }}</p>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const fileContent = ref(null);

    const onFileSelected = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        fileContent.value = event.target.result;
      };

      reader.onerror = (error) => {
        console.error('Fehler beim Lesen der Datei:', error);
      };

      reader.readAsText(file);
    };

    return {
      fileContent,
      onFileSelected,
    };
  },
};
</script>