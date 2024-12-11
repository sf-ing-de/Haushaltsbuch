<template>
  <input type="file" accept=".csv" @change="onFileSelected" />
  <form>
    <label for="skiplines">Skip n first lines:</label>
    <input type="number" id="skiplines" name="skiplines" min="0" @change="onChangeSkipLines">
  </form>
  <div>fileskipFirstNLines: {{ fileskipFirstNLines }}</div>
  <div>{{ fileContent }}</div>
</template>

<script setup>
import { ref } from 'vue'

console.log("script setup: Start")
const fileContent = ref(null);
const fileObject = ref('')
const fileParsed = ref(false)
const fileskipFirstNLines = ref(0)

const onChangeSkipLines = (event) => {
  console.log('onChangeSkipLines: start')
  fileParsed.value = false;
  fileskipFirstNLines.value = event.target.value;
}

const onFileSelected = (event) => {
  fileObject.value = event.target.files[0];

  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (event) => {
    fileContent.value = event.target.result;
    console.log('Content of file: ' + fileContent)
  };

  reader.onerror = (error) => {
    console.error('Error on reading file: ', error);
  };
  reader.readAsText(file);
}

</script>