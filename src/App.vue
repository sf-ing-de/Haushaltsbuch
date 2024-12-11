<template>
  
  <form @submit.prevent>
    <input type="file" accept=".csv" @change="onFileSelected" />
    <label>Skip n first lines:</label>
    <input type="number" v-model="fileSkipFirstNLines" min="0" @change="onChangeSkipLines">
    <label for="encoding">File encoding:</label>
    <select v-model="fileEncoding" @change="onChangeEncoding">
      <option value="ascii">ASCII</option>
      <option value="utf-8">UTF-8</option>
    </select>
    <br>
    <label v-if="fileParsed" >Preview lines:</label>
    <input v-if="fileParsed" type="number" v-model="filePreviewFirstNLines" min="0" @change="onChangePreviewLines">
  </form>
  <table v-if="fileParsed" style="width: 100%;">
    <thead>
        <tr>
            <th v-for="header in fileContent[0]"
                v-bind:key="'header-' + header" @click="onClickHeader($event, header)">
                {{ header }}
            </th>
        </tr>
    </thead>
    <tbody v-if="filePreviewFirstNLines.valueOf()">
      <tr v-for="line in filePreviewFirstNLines.valueOf()"
          v-bind:key="'row-'+line">
            <td v-for="column in fileContent[line].length"
                v-bind:key="'row-' + line + '-column-' + column">
                  <input v-model="fileContent[line][column-1]"/>
            </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="line in fileContent.length - 1"
          v-bind:key="'row-' + line">
            <td v-for="column in fileContent[line].length"
                v-bind:key="'row-' + line + '-column-' + column">
                  <input v-model="fileContent[line][column-1]"/>
            </td>
        </tr>
    </tbody>
  </table>
  <!-- <table v-if="fileParsed" style="width: 100%;">
    <thead>
        <tr>
            <th v-for="(header, key) in fileContent.meta.fields"
                v-bind:key="'header-'+key">
                {{ header }} new
            </th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(row, rowKey) in fileContent.data"
            v-bind:key="'row-'+rowKey">
                <td v-for="(column, columnKey) in fileContent.meta.fields"
                    v-bind:key="'row-'+rowKey+'-column-'+columnKey">
                        <input v-model="fileContent.data[rowKey][column]"/>
                </td>
        </tr>
    </tbody>
  </table> -->
</template>

<script setup>
import { ref, toRaw } from 'vue'
import Papa from 'papaparse'

console.log("script setup: Start")
const fileContent = ref();
const fileContentNew = ref();
const fileObject = ref('')
const fileParsed = ref(false)
const fileSkipFirstNLines = ref(0)
const filePreviewFirstNLines = ref(10)
const fileEncoding = ref('ascii')

const parseFile = () => {
  console.log('fileSkipFirstNLines.value: ' + fileSkipFirstNLines.value)
  Papa.parse(fileObject.value, {
    header: false,
    skipEmptyLines: true,
    encoding: fileEncoding.value,
    complete: function( results ){
      fileContent.value = results.data;
      // console.log('results.data ', results.data)
      // console.log('results.data[0] ', results.data[0])
      // console.log('results.data[0] ', results.data[0][0])
      // console.log('results.meta ', results.meta)
      //console.log('results.error ', results.errors)
      // console.log('fileContent.value.data ', fileContent.value)
      // for (const row in fileContent.value) {
      //   for (const col in fileContent.value[row]) {
      //     console.log('fileContent.value[' + row + '][' + col + ']', fileContent.value[row][col])
      //   }
      // }
      fileParsed.value = true;
    },
    beforeFirstChunk: chunk => [...chunk.split('\n').slice(fileSkipFirstNLines.value)].join('\n')
  } );
}

const onChangeSkipLines = (event) => {
  parseFile();
}

const onFileSelected = (event) => {
  fileObject.value = event.target.files[0];
  parseFile();
}

const onChangeEncoding = (event) => {
  parseFile();
}

const onChangePreviewLines = (event) => {
  parseFile();
}

const onClickHeader = (event, key) => {
  console.log('onClickHeader start');  
  console.log('onClickHeader key: ', key);
  console.log('onClickHeader event.target.innerHTML: ', event.target.innerHTML);
  // console.log('onClickHeader fileContent.value.meta: ', fileContentNew.value.meta);
  // console.log('onClickHeader fileContent.value.meta.fields: ', fileContentNew.value.meta.fields);
  // console.log('onClickHeader fileContent.value.meta.fields[key]: ', fileContentNew.value.meta.fields[key]);
  // console.log('onClickHeader fileContent.value.meta.fields.push(): ', fileContentNew.value.meta.fields.push(fileContent.value.meta.fields[key]));
  // console.log('onClickHeader fileContentNew.value.meta.fields: ', fileContentNew.value.meta.fields);
  
  //parseFile();
}

</script>