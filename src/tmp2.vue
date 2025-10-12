<template>
    <input type="file" accept=".csv" @change="onFileSelected" />
    <form>
      <label for="skiplines">Skip n first lines:</label>
      <input type="number" id="skiplines" name="skiplines" min="0" @change="onChangeSkipLines">
    </form>
    <div>fileskipFirstNLines: {{ fileskipFirstNLines }}</div>
  
    <div>{{ fileContentNew }}</div>
    <!-- <div>{{ fileContent }}</div> -->
    <table v-if="fileParsed" style="width: 100%;">
      <thead>
          <tr>
              <th v-for="(header, key) in fileContentNew.meta.fields"
                  v-bind:key="'header-'+key">
                  {{ header }}
              </th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="(row, rowKey) in fileContentNew.data"
              v-bind:key="'row-'+rowKey">
                  <td v-for="(column, columnKey) in fileContentNew.meta.fields"
                      v-bind:key="'row-'+rowKey+'-column-'+columnKey">
                          <input v-model="fileContentNew.data[rowKey][column]"/>
                  </td>
          </tr>
      </tbody>
  </table>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Papa from 'papaparse'
  
  console.log("script setup: Start")
  const fileContent = ref(null);
  console.log('Content of file: ' + fileContent)
  const fileContentNew = ref(null);
  console.log('fileobject: ' + fileContentNew)
  const fileObject = ref('')
  console.log('file object: ' + fileObject)
  const fileParsed = ref(false)
  console.log('Is file parsed: ' + fileParsed)
  const fileskipFirstNLines = ref(0)
  console.log('fileskipFirstNLines: ' + fileskipFirstNLines)
  
  const parseFile = () => {
    console.log('fileskipFirstNLines.value: ' + fileskipFirstNLines.value)
    Papa.parse( fileObject.value, {
          header: true,
          skipEmptyLines: true,
          complete: function( results ){
            fileContentNew.value = results;
            fileParsed.value = true;
          },
          beforeFirstChunk: chunk => [...chunk.split('\n').slice(fileskipFirstNLines)].join('\n'),
        } );
  }
  
  const onChangeSkipLines = (event) => {
    console.log('onChangeSkipLines: start')
    fileParsed.value = false;
    fileskipFirstNLines.value = event.target.value;
    parseFile();
  }
  
  const onFileSelected = (event) => {
    fileObject.value = event.target.files[0];
    parseFile();
  
    // const file = event.target.files[0];
    // const reader = new FileReader();
    
    // reader.onload = (event) => {
    //   fileContent.value = event.target.result;
    //   console.log('Content of file: ' + fileContent)
    // };
  
    // reader.onerror = (error) => {
    //   console.error('Error on reading file: ', error);
    // };
    // reader.readAsText(file);
  }
  
  </script>