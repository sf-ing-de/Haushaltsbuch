<style>

table, th, tr, td {
  table-layout: auto;
  text-align: left; 
  border: 1px solid; 
  border-collapse: collapse;
  padding: 5px;
}
tr:nth-child(odd) {background-color: rgb(255, 231, 231);}

.container {
  /*background: rgb(0, 0, 255);*/
  position: relative;
  height: auto;
}

.base {
  display: block;
  padding: 4px;
  visibility: hidden;
  width: 100%;
  /* height: 100%; */
}

.overlay {
  position: absolute; 
  top: 0;
  background: rgb(255, 255, 255);
  width: 98%;
  padding: 4px;

  /*height: 97%;*/
}

</style>

<template>
  
  <form @submit.prevent>
    <input type="file" accept=".csv" @change="onCSVFileSelected" />
    <label v-if="fileParsed">Skip n first lines:</label>
    <input v-if="fileParsed" type="number" v-model="fileSkipFirstNLines" min="0" @change="onChangeSkipLines">
    <label v-if="fileParsed" for="encoding">File encoding:</label>
    <select v-if="fileParsed" v-model="fileEncoding" @change="onChangeEncoding">
      <option value="ascii">ASCII</option>
      <option value="utf-8">UTF-8</option>
    </select>
    <br>
    <label for="filePreviewFirstNLines" v-if="fileParsed" >Auswahl der Zeilen für die Vorschau, 0 zeigt alle Zeilen:</label>
    <input name="filePreviewFirstNLines" v-if="fileParsed" type="number" v-model="filePreviewFirstNLines" min="0" @change="onChangePreviewLines">
    <input v-if="fileParsed" type="submit" value="Alle Spalten übernehmen" @click="onClickAssignAllColumns($event)">
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
                {{ fileContent[line][column-1] }}
            </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="line in fileContent.length - 1"
          v-bind:key="'row-' + line">
            <td v-for="column in fileContent[line].length"
                v-bind:key="'row-' + line + '-column-' + column">
                {{ fileContent[line][column-1] }}
            </td>
        </tr>
    </tbody>
  </table>
  <div v-if="flagGlobal.clickedHeader">
    <form id="newColumnForm" @submit.prevent>
      <label for="newColumn">Auswahl einer bestehenden Spalte oder Eingabe einer neuen:</label>
      <input list="existingColums" name="newColumn" id="newColumn" autocomplete="off"
             v-model="newColumnForm">
             fileContentNew[0]: {{ fileContentNew[0] }}
      <datalist id="existingColums">
        <option v-for="header in fileContentNew[0]"
                v-bind:value="header"></option>
      </datalist>
      <select v-model="newColumnFormat" @change="onChangeColumnFormat">
        <option value="text">Text</option>
        <option value="date">Datum</option>
        <option value="current">Währung</option>
      </select>
      <input v-if="flagGlobal.newColumnFormFormatDateSelected" name="newColumnFormatDate" id="newColumnFormatID" 
              v-model="newColumnFormatDate" @change="onChangeColumnFormat">
      <select v-if="flagGlobal.newColumnFormFormatCurrentSelected" v-model="newColumnFormatCurrentSeperator" @change="onChangeColumnFormat">
        <option value=",">Komma verwenden</option>
        <option value=".">Punkt verwenden</option>
      </select>
      <select v-if="flagGlobal.newColumnFormFormatCurrentSelected"  v-model="newColumnFormatCurrentAlternate" @change="onChangeColumnFormat">
        <option value="yes">Werte invertieren</option>
        <option value="no">Werte nicht invertieren</option>
      </select>
      <input type="submit" value="OK" @click="onClickAssignNewColumn($event)">
    </form>
  </div>
  <div v-if="fileContentNew.length > 0">Zum Löschen einer Spalte, einen Doppelklick auf den Spaltennamen ausführen.
    <button @click="onClickDownloadFileContenNew">Download</button>
  </div>
  <div v-if="fileContentNew.length > 0">
    <label for="fileNewPreviewFirstNLines">Auswahl der Zeilen für die Vorschau, 0 zeigt alle Zeilen:</label>
    <input name="fileNewPreviewFirstNLines" type="number" v-model="fileNewPreviewFirstNLines" min="0" @change="onChangePreviewNewLines">
  </div>
  <div v-if="fileContentNew.length > 0">
    <label for="JSONFilterLoad">Laden eines JSON Filters:</label>
    <input name="JSONFilterLoad" type="file" accept=".json" @change="onJSONFileSelected" />
  </div>
  <div v-if="Object.keys(categoryJSON).length > 0">
    <label for="columnToFilter">Spalte zum Filter:</label>
    <input list="listForColumnToFilter" name="columnToFilter" id="columnToFilterID" autocomplete="off"
           v-model="columnToFilter">
    <datalist id="listForColumnToFilter">
      <option v-for="columns in fileContentNew[0]" v-bind:value="columns"></option>
    </datalist>
    <label for="JSONFilter">JSON Filters:</label>
    <input list="existingFilters" name="newColumnFilter" id="newColumnFilterID" autocomplete="off"
           v-model="newColumnFilter">
    <datalist id="existingFilters">
      <option v-for="key in Object.keys(categoryJSON)" v-bind:value="key"></option>
    </datalist>
    <button @click="onClickFilterChange">Filter anwenden</button>
  </div>
  <div v-if="Object.keys(categoryJSON).length > 0">    
    <label for="selectedFilter">Wörter nach denen gefiltert wird, müssen durch ein Komma getrennt sein:</label>
    <input type="text" name="selectedFilter" id="selectedFilter" style="width: 100%;"
           v-model="categoryJSON[newColumnFilter]">
  </div>
  <table v-if="fileParsed & (fileContentNew.length > 0)" style="width: 100%;">
    <thead>
        <tr>
            <th v-for="column in fileContentNew[0].length"
                v-bind:key="'header-' + column" @dblclick="onDoubleClickHeaderNew($event, column)">
                <input style="font-weight: bold" v-model="fileContentNew[0][column-1]"/>
            </th>
        </tr>
    </thead>
    <tbody v-if="fileNewPreviewFirstNLines.valueOf()">
      <tr v-for="line in fileNewPreviewFirstNLines.valueOf()"
          v-bind:key="'row-'+line">
            <td v-for="column in fileContentNew[line].length"
                v-bind:key="'row-' + line + '-column-' + column">
                <div class='container'>
                  <div class='base'> {{ fileContentNew[line][column-1] }} </div>
                  <input class='overlay' v-model="fileContentNew[line][column-1]" />
                </div>
            </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="line in (fileContentNew.length - 1)"
          v-bind:key="'row-' + (line)">
            <td v-for="column in fileContentNew[line].length"
                v-bind:key="'row-' + (line) + '-column-' + column">
                <div class='container'>
                  <div class='base'> {{ fileContentNew[line][column-1] }} </div>
                  <input class='overlay' v-model="fileContentNew[line][column-1]" />
                </div>
                
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
const fileContentNewFiltered = ref(new Object());
const fileObjectCSV = ref('');
const fileObjectJSON = ref('');
const categoryJSON = ref('');
const fileParsed = ref(false);
const fileSkipFirstNLines = ref(0);
const filePreviewFirstNLines = ref(3);
const fileNewPreviewFirstNLines = ref(5);
const fileEncoding = ref('utf-8');
const newColumnFormat = ref('text');
const newColumnFormatDate = ref('e.g. dd-mm-yyyy or mm/dd/yy');
const newColumnFormatCurrentAlternate = ref('no');
const newColumnFormatCurrentSeperator = ref(',');
const newColumnForm = ref([]);
const newColumnFilter = ref([]);
const columnToFilter = ref();
const flagGlobal = ref( {
  fileParsed: false,
  clickedHeader : false,
  clickedHeaderNew : false,
  newColumnFormFormatDateSelected : false,
  newColumnFormFormatCurrentSelected : false
});     
let selectedHeader = -1;

// example for transpose an array:
//let array = [[1,2,3,4], [5,6,7,8]];
//console.log('array[0].map((col, i) => [array].map(row => row[i]))', array[0].map((col, i) => array.map(row => row[i])))

//console.log('[10, 20, 30].map((col, i) => {if(i == tmp) {value} else {0}})', [10, 20, 30].map((col, i) => {if(i == tmp) {return value} else {return 0}}))

const onClickFilterChange = (event) => {
  console.log('onFilterChange: start ');
  // console.log('onFilterChange: columnToFilter.value ', toRaw(columnToFilter.value));
  // console.log('onFilterChange: categoryJSON.value ', toRaw(categoryJSON.value));
  // console.log('onFilterChange: Object.keys(categoryJSON.value) ', toRaw(Object.keys(categoryJSON.value)));
  // console.log('onFilterChange: fileContentNew.value ', toRaw(fileContentNew.value));
  for (const category of Object.keys(categoryJSON.value)) {
    // fileContentNewFiltered.value[category] = [toRaw(fileContentNew.value[0])];
    fileContentNewFiltered.value[category] = [toRaw(fileContentNew.value[0])];
    for (let row = 1; row < fileContentNew.value.length; row++) {
      for (const searchString of categoryJSON.value[category]) {
        const colToflt = fileContentNew.value[0].indexOf(columnToFilter.value);
        const stringExtract = toRaw(fileContentNew.value[row][colToflt]);
        console.log('onFilterChange: stringExtract: ', stringExtract);
        if (stringExtract.includes(searchString)) {
          fileContentNewFiltered.value[category].push(toRaw(fileContentNew.value[row]));
        }
      }
    }    
  }
  

  console.log('onFilterChange: fileContentNewFiltered.value: ', toRaw(fileContentNewFiltered.value));

  // fileContentNewFiltered.value[element] = fileContentNew.value[columnToFilter.value]

}

const onJSONFileSelected = (event) => {
  fileObjectJSON.value = event.target.files[0];
  parseJSONFile();
}

const parseJSONFile = () => {
  
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      //console.log('parsJSONFile: reader.result: ', reader.result)
      categoryJSON.value = JSON.parse(reader.result);
      //console.log('parsJSONFile: categoryJSON.value: ', categoryJSON.value)
      //console.log('parsJSONFile: categoryJSON.value.Lebensmittel: ', categoryJSON.value.Lebensmittel)
      //console.log('parsJSONFile: Object.keys(categoryJSON.value): ', Object.keys(categoryJSON.value))

    },
    false,
  );

  if (fileObjectJSON.value) {
    reader.readAsText(fileObjectJSON.value);
  }
}

const parseCSVFile = () => {
  //console.log('fileSkipFirstNLines.value: ' + fileSkipFirstNLines.value)
  Papa.parse(fileObjectCSV.value, {
    header: false,
    skipEmptyLines: true,
    encoding: fileEncoding.value,
    complete: function( results ){
      fileContent.value = results.data;
      fileParsed.value = true;
    },
    beforeFirstChunk: chunk => [...chunk.split('\n').slice(fileSkipFirstNLines.value)].join('\n')
  } );
}

const onClickDownloadFileContenNew = (event) => {
  console.log('onClickDownloadFileContenNew clicked button')
  // credit: https://www.raymondcamden.com/2020/12/15/vue-quick-shot-downloading-data-as-a-file
  // credit: https://www.bitdegree.org/learn/javascript-download
  const papaConfig = 
  {
    quotes: true, //or array of booleans
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\r\n",
    skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
    columns: null //or array of strings
  }

	let filename = 'sf-ing.csv';
	let text = Papa.unparse(fileContentNew.value, papaConfig);
	
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();
	document.body.removeChild(element); 
}

const onChangeSkipLines = (event) => {
  parseCSVFile();
}

const onCSVFileSelected = (event) => {
  //fileContentNew.value = [];
  fileObjectCSV.value = event.target.files[0];
  parseCSVFile();
}

const onChangeEncoding = (event) => {
  parseCSVFile();
}

const onChangePreviewLines = (event) => {
  parseCSVFile();
}

const onChangePreviewNewLines = (event) => {

}

const onClickHeader = (event, header) => {
  // Flag als Trigger für die Aktualisierung des HTMLs bzw. zm Umschalten der Sichtbarkeit
  flagGlobal.value.clickedHeader = true;
  
  //console.log('fileContent.value[0][header]: ', fileContent.value[0][header]);

  // Überprüfung ob es schon ein angelegtes neues Objekt zum Erstellen eines CSVs gibt.
  if (fileContentNew.value.length > 0){
    // Es wird das bestehende Objekt durchsucht, ob schon eine Spalte mit dem geklickten
    // Namen vorhanden ist.
    for (let index = 0; index < fileContentNew.value[0].length; index++) {
      if (fileContentNew.value[0][index] == fileContent.value[0][header]) {
        newColumnForm.value = fileContentNew.value[0][index];
        break;
      } else {
        newColumnForm.value = fileContent.value[0][header];
      }
    }
  } else {
    newColumnForm.value = fileContent.value[0][header];
  }
  selectedHeader = header;
}
const onDoubleClickHeaderNew = (event, header) => {

  const tmplength = fileContentNew.value.length;
  const tmpheaderlength = fileContentNew.value[0].length;

  flagGlobal.value.clickedHeaderNew = true;

  for (let index = 0; index < tmplength; index++) {
    if(tmpheaderlength > 1){
      fileContentNew.value[index].splice(header - 1, 1);
    } else {
      fileContentNew.value.splice(0, 1);
    }
  }
}

const onChangeColumnFormat = (event) => {
  //console.log('onChangeColumnFormat: newColumnFormat.value: ', newColumnFormat.value)
  if (newColumnFormat.value == 'date') {
    flagGlobal.value.newColumnFormFormatDateSelected = true;
  }
  else
  {
    flagGlobal.value.newColumnFormFormatDateSelected = false;
  }
  if (newColumnFormat.value == 'current') {
    flagGlobal.value.newColumnFormFormatCurrentSelected = true;
  }
  else
  {
    flagGlobal.value.newColumnFormFormatCurrentSelected = false;
  }
  
}

function stringToDate(dateString, stringFormat) {
  let day = String('');
  let month = String('');
  let year = String('');

  for (let index = 0; index < stringFormat.length; index++) {
    //console.log('dateString: ', dateString);
    //console.log('dateString[index]: ', dateString[index]);
    switch (stringFormat.toLowerCase()[index]) {
      case 'd':
        day = day.concat(dateString[index]);
        break;
      case 'm':
        month = month.concat(dateString[index]);
        break;
      case 'y':
        year = year.concat(dateString[index]);
        break;
      default:
        break;
    }
    //console.log('day: ', day, 'month: ', month, 'year: ', year);
  }
  // console.log('stringToDate: day', day)
  // console.log('stringToDate: month', month)
  // console.log('stringToDate: year', year)
  //console.log('new Date(year, month, day): ', new Date(year, Number(month) - 1, day))
  return new Date(year, Number(month) - 1, day)
}

function changeColumnFormatDate(tmp) {
  const locale = 'de';
  const options = {
    'year'  : 'numeric',
    'month' : '2-digit',
    'day'   : '2-digit'
  }
  switch (newColumnFormat.value) {
    case 'date':
    //tmp = stringToDate(tmp, newColumnFormatDate.value);
    tmp = stringToDate(tmp, newColumnFormatDate.value).toLocaleDateString(locale, options);
    break;
    case 'current':
      tmp = Number(Number.parseFloat(tmp));
      break;
    case 'text':    
    default:
      tmp = String(tmp);
      break;  
  }
  return tmp;
}

function changeColumnFormatCurrent(tmp) {
  //console.log('tmp begin: ', tmp)

  tmp = String(tmp);

  //console.log("tmp.includes(',', tmp.length - 3)", tmp.includes(',', tmp.length - 3))

  if (tmp.includes(',', tmp.length - 3) == true){
    tmp = tmp.replace('.','!');
    //console.log('String(tmp).includes(',', String(tmp).length - 3) if:  String(tmp).replace(.,!): ', tmp)

    tmp = tmp.replace(',','.');
    //console.log('String(tmp).includes(',', String(tmp).length - 3) if:  String(tmp).replace(,,.): ', tmp)

    tmp = tmp.replace('!',',');
    //console.log('String(tmp).includes(',', String(tmp).length - 3) if:  String(tmp).replace(!,,): ', tmp)

  }

  //console.log('changeColumnFormatCurrent:newColumnFormatCurrentSeperator.value', newColumnFormatCurrentSeperator.value)
  if (newColumnFormatCurrentAlternate.value == 'yes'){
    if (tmp[0] == '-') {
      tmp = tmp.substring(1)
    } else {
      tmp = '-'.concat(tmp);
    }
  }
  //console.log('changeColumnFormatCurrent:newColumnFormatCurrentSeperator.value', newColumnFormatCurrentSeperator.value)
  if (newColumnFormatCurrentSeperator.value == ','){
    tmp = tmp.replace('.','!');
    //console.log('newColumnFormatCurrentSeperator.value if:  String(tmp).replace(.,!): ', tmp)

    tmp = tmp.replace(',','.');
    //console.log('newColumnFormatCurrentSeperator.value if:  String(tmp).replace(,,.): ', tmp)

    tmp = tmp.replace('!',',');
    //console.log('newColumnFormatCurrentSeperator.value if:  String(tmp).replace(!,,): ', tmp)

  }
  //console.log('tmp end: ', tmp)

  return String(tmp);
}

function changeColumnFormat(tmp) {
  switch (newColumnFormat.value) {
    case 'date':
      tmp = changeColumnFormatDate(tmp);
      break;
  
    case 'current':
      tmp = changeColumnFormatCurrent(tmp);
      break;
  
    default:
      break;
  }

return tmp;
}

const onClickAssignAllColumns = (event) => {
  //console.log('onClickAssignAllColumns start')

  newColumnFormat.value = 'text';

  for (let index = 0; index < fileContent.value[0].length; index++) {
    //console.log('onClickAssignAllColumns: fileContent.value[0][index]', fileContent.value[0][index])
    newColumnForm.value = fileContent.value[0][index];
    selectedHeader = index;
    onClickAssignNewColumn();
  }
  
}

const onClickAssignNewColumn = (event) => {
  //console.log('onClickAssignNewColumn start: ');  
  //console.log('onClickAssignNewColumn: newColumnForm.value: ', newColumnForm.value)

  // Überprüfung ob es schon ein neues CSV Objekt gibt
  if (fileContentNew.value.length > 0) {
    //console.log('onClickAssignNewColumn:fileContentNew.value.length > 0', fileContentNew.value.length > 0)
    let headerExistsFlag = false;
    let tmpHeader = -1;   
    let lastRow = -1;
    // Überprüfung ob der Name des Headers schon existiert. Es wird jedes Element der erste Zeile mit dem
    // Headernamen aus dem HTML verglichen und in tmpHeader wird die Spalte vermerkt, in headerExistsFlag
    // wird gespeichert, dass ein Header gefunden wurde und die Schleife wird abgebrochen
    for (let index = 0; index < fileContentNew.value[0].length; index++) {
      if (fileContentNew.value[0][index] == newColumnForm.value) {
        //console.log('onClickAssignNewColumn:fileContentNew.value[0][index] == newColumnForm.value', fileContentNew.value[0][index] == newColumnForm.value)
        tmpHeader = index;
        headerExistsFlag = true;
        break;
      }
    }
    // Existiert bereits ein Header mit dem Namen aus dem HTML?
    if (headerExistsFlag == true) {
      //console.log('onClickAssignNewColumn:headerExistsFlag == true', headerExistsFlag == true)
      // Beim Hinzufügen kann es sein, dass eine Spalte schon länger ist als die Hinzuzufügende.
      // Mit der Schleife wird überprüft, ob es leere (null) Zeilen in der Spalte gibt, falls ja
      // wird die erste als Startwert zum Hinzufügen der weiteren Werte genommen.
      for (let index = 1; index < fileContentNew.value.length; index++) {
        //console.log('onClickAssignNewColumn:fileContentNew.value[index][tmpHeader]', fileContentNew.value[index][tmpHeader])
        // Überprüfung ob die Zeile eine leere Zelle enthält
        if (fileContentNew.value[index][tmpHeader] == null) {
          //console.log('onClickAssignNewColumn:fileContentNew.value[index][tmpHeader] == null', fileContentNew.value[index][tmpHeader] == null)
          lastRow = index;
          //console.log('onClickAssignNewColumn:lastRow = index', lastRow)
          break;
        }
      }
      // Es werden die neuen Werte aus der Spalte aus dem HTML in das bestehende CSV-Objekt eingefügt.
      for(let index = 1; index < fileContent.value.length; index++){
        // Existiert die Spalte bereits und hat leere (null) Zellen, so wird lastRow als OFfset beim
        // Hinzufügen verwendet.
        if (lastRow >= 0) {
          //console.log('onClickAssignNewColumn:lastRow >= 0', lastRow >= 0)
          if (fileContentNew.value[index - 1 + lastRow].length >= tmpHeader) {
            fileContentNew.value[index - 1 + lastRow][tmpHeader] = changeColumnFormat(fileContent.value[index][selectedHeader]);
          } else {
            fileContentNew.value[index - 1 + lastRow].push(changeColumnFormat(fileContent.value[index][selectedHeader]));
          }
          
        }
        // Existiert die Spalte hat aber noch keine leeren Zeilen. So bedeutet das, dass an das gesamte
        // CSV Objekt eine neue Zeile angehangen werden muss.
        else {       
          //console.log('onClickAssignNewColumn:lastRow >= 0 else', lastRow >= 0);
          // Es wird eine neue leere Zeile aus der Headerzeile erstellt. Die map() Funktion durchläuft jedes
          // Element dieser Zeile und fügt in der entsprechenden Spalte den Wert aus der HTML Spalte ein,
          // an allen anderen Stellen ist die Zelle leer (null). Dann wird diese Zeile an das Ende der CSV
          // mit .push angehangen.
          let arrayAdd = fileContentNew.value[0].map((col, i) => {if(i == tmpHeader) {return changeColumnFormat(fileContent.value[index][selectedHeader])} else {return null}})
          fileContentNew.value.push(arrayAdd)
        }
      }
    } 
    // Existiert der Header noch nicht als Spalte, so wird eine weitere Spalte an das CSV angehangen.
    else {
      //console.log('onClickAssignNewColumn:headerExistsFlag == true else', headerExistsFlag == true) 
      fileContentNew.value[0].push(newColumnForm.value);
      // Es wird jede Zeile durchlaufen und das Zeilenelement um eine Spalte erweitert
      for (let index = 1; index < fileContent.value.length; index++) {
        fileContentNew.value[index].push(changeColumnFormat(fileContent.value[index][selectedHeader]))
      }
    }
  } 
  // Existiert noch kein CSV Objekt, so wird ein neues mit der ersten Spalte erzeugt.
  else {
    //console.log('onClickAssignNewColumn:fileContentNew.value.length > 0 else', fileContentNew.value.length > 0)
    fileContentNew.value.push([newColumnForm.value])
    for (let index = 1; index < fileContent.value.length; index++) {
      fileContentNew.value.push([changeColumnFormat(fileContent.value[index][selectedHeader])])
    }
  }
  //console.log('onClickAssignNewColumn:fileContentNew.value', fileContentNew.value)

  flagGlobal.value.clickedHeader = false;
  flagGlobal.value.newColumnFormFormatDateSelected = false;
  flagGlobal.value.newColumnFormFormatCurrentSelected = false;
  newColumnFormat.value = 'text';
}
</script>