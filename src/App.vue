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
  <table v-if="fileParsed & (fileContent.length > 0)" style="width: 100%;">
    <thead>
        <tr>
            <th v-for="header in fileContent[0].length"
                v-bind:key="'header-' + header" @click="onClickHeader($event, header-1)">
                {{ fileContent[0][header-1] }}
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

  <table v-if="fileParsed & (fileContentNew.length > 0)" style="width: 100%;">
    <thead>
        <tr>
            <th v-for="header in fileContentNew[0]"
                v-bind:key="'header-' + header" @click="onClickHeaderNew($event, header)">
                {{ header }}
            </th>
        </tr>
    </thead>
    <tbody v-if="filePreviewFirstNLines.valueOf()">
      <tr v-for="line in filePreviewFirstNLines.valueOf()"
          v-bind:key="'row-'+line">
            <td v-for="column in fileContentNew[line].length"
                v-bind:key="'row-' + line + '-column-' + column">
                  <input v-model="fileContentNew[line][column-1]"/>
            </td>
      </tr>
    </tbody>
    <tbody v-else-if="(fileContentNew[line].length > 0)">
      <tr v-for="line in fileContentNew.length - 1"
          v-bind:key="'row-' + line">
            <td v-for="column in fileContentNew[line].length"
                v-bind:key="'row-' + line + '-column-' + column">
                  <input v-model="fileContentNew[line][column-1]"/>
            </td>
        </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import Papa from 'papaparse'

console.log("script setup: Start")
const fileContent = ref([]);
const fileContentNew = ref([]);
const fileObject = ref('');
const fileParsed = ref(false);
const fileSkipFirstNLines = ref(0);
const filePreviewFirstNLines = ref(10);
const fileEncoding = ref('ascii');
const newHeaderarray = ref([]);

const parseFile = () => {
  console.log('fileSkipFirstNLines.value: ' + fileSkipFirstNLines.value)
  newHeaderarray.value = [];
  fileContentNew.value = [];
  Papa.parse(fileObject.value, {
    header: false,
    skipEmptyLines: true,
    encoding: fileEncoding.value,
    complete: function( results ){
      fileContent.value = results.data;
      // console.log('results.data ', results.data)
      // console.log('results.data[0] ', results.data[0])
      // console.log('results.data[1] ', results.data[1])
      // console.log('results.data["Buchung"] ', results.data["Buchung"])
      // console.log('results.meta ', results.meta)
      // console.log('results.error ', results.errors)
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

const onClickHeader = (event, header) => {
  // console.log('onClickHeader start');  
  // console.log('onClickHeader header: ', header);
  // console.log('onClickHeader event.target.innerHTML: ', event.target.innerHTML);

  let headerExistsFlag = false;

  newHeaderarray.value.forEach(element => {
    if (element == header){
      headerExistsFlag = true;
    }
  });
  console.log('onClickHeader headerExistsFlag: ', headerExistsFlag);

  if (headerExistsFlag == false){
    newHeaderarray.value.push(header)
    newHeaderarray.value.sort()
  }
  else {
    newHeaderarray.value = newHeaderarray.value.filter((elements) => elements != header);
    newHeaderarray.value.sort()
  }
  headerExistsFlag = false;
  console.log('onClickHeader newHeaderarray.value: ', newHeaderarray.value);
  
  console.log('onClickHeader fileContent.value.length: ', fileContent.value.length);
  console.log('onClickHeader fileContent.value[0].length: ', fileContent.value[0].length);
  console.log('onClickHeader fileContent.value[0][0].length: ', fileContent.value[0][0].length);
  
  
  fileContentNew.value = Array.from(Array(fileContent.value.length), () => new Array(newHeaderarray.value.length));
  console.log('fileContentNew.value', fileContentNew.value)
  for (let row = 0; row < fileContent.value.length; row++) {
    newHeaderarray.value.forEach(col => {
      fileContentNew.value[row][col] = fileContent.value[row][col]
    });
  }
  console.log('fileContentNew.value', fileContentNew.value)

}
const onClickHeaderNew = (event, header) => {
  console.log('onClickHeaderNew start');  
  console.log('onClickHeaderNew header: ', header);
  console.log('onClickHeaderNew event.target.innerHTML: ', event.target.innerHTML);
}

</script>