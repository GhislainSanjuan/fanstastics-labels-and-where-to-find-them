
//Init of index
function init() {
  PropertiesService.getScriptProperties().setProperty("startIndex", 0)
}


//Constantes
//If the script is too lng (because the files list is too long ), we can break down the function call by breaking the data into smaller array of 500 lines
//we use this step variable 
const step = 500 
const docID = "xxxx" // The Google Sheets for the files list
const SP = SpreadsheetApp.openById(docID)

//The label Json format
const LABEL = {
  "id": "xxxxx",
  "champ1": {"id": "xxxxxxxxxx"},
  "champ2": {"id": "xxxxxxxxxx"},
  "champ3": {"id": "xxxxxxxxxx" },
  "champ4Liste": {"id": "xxxxxxxxxx",
    "options": [
      {"name": "option1","id": "xxxxxxxxxx"},
      {"name": "option2","id": "xxxxxxxxxx"}, 
      {"name": "option3","id": "xxxxxxxxxx"}
    ]
  }
}



/*******************************************************************************************************
* This function apply a value to a list type label field
* ******************************************************************************************************
* @param {string} fileId - the file id 
* @param {string} labelId - the label id 
* @param {string} fieldId - the field id of the label 
* @param {string} fieldValue - the value to apply
* @return {} 
*/
function setLabelList(fileId, labelId, fieldId, fieldValueId) {
  // Add Label To The File (Fields will be empty)
  let AddLabel = Drive.newModifyLabelsRequest()
  AddLabel.setLabelModifications(Drive.newLabelModification().setLabelId(labelId));
  // Commit
  let output = Drive.Files.modifyLabels(AddLabel, fileId);
  // Set field of file
  let fieldModification = Drive.newLabelFieldModification();
  fieldModification.fieldId = fieldId;
  fieldModification.setSelectionValues = fieldValueId;
  let modifyLabelsRequest = Drive.newModifyLabelsRequest();
  modifyLabelsRequest.labelModifications = Drive.newLabelModification()
  modifyLabelsRequest.labelModifications.labelId = labelId;
  modifyLabelsRequest.labelModifications.setFieldModifications([fieldModification]);
  // Commit
  output = Drive.Files.modifyLabels(modifyLabelsRequest, fileId);
  //Logger.log(output);
}


/*******************************************************************************************************
* This function apply a value to an integer type label field
* ******************************************************************************************************
* @param {string} fileId - the file id 
* @param {string} labelId - the label id 
* @param {string} fieldId - the field id of the label 
* @param {string} fieldValue - the value to apply
* @return {} 
*/
function setLabelInteger(fileId, labelId, fieldId, fieldValue) {
  // Add Label To The File (Fields will be empty)
  let AddLabel = Drive.newModifyLabelsRequest()
  AddLabel.setLabelModifications(Drive.newLabelModification().setLabelId(labelId));
  // Commit
  let output = Drive.Files.modifyLabels(AddLabel, fileId);
  // Set field of file
  let fieldModification = Drive.newLabelFieldModification();
  fieldModification.fieldId = fieldId;
  fieldModification.setIntegerValues = fieldValue
  let modifyLabelsRequest = Drive.newModifyLabelsRequest();
  modifyLabelsRequest.labelModifications = Drive.newLabelModification()
  modifyLabelsRequest.labelModifications.labelId = labelId;
  modifyLabelsRequest.labelModifications.setFieldModifications([fieldModification]);
  // Commit
  output = Drive.Files.modifyLabels(modifyLabelsRequest, fileId);
}



/*******************************************************************************************************
* This function apply a value to a text type label field
* ******************************************************************************************************
* @param {string} fileId - the file id 
* @param {string} labelId - the label id 
* @param {string} fieldId - the field id of the label 
* @param {string} fieldValue - the value to apply
* @return {} 
*/
function setLabelText(fileId, labelId, fieldId, fieldValue) {
  // Add Label To The File (Fields will be empty)
  let AddLabel = Drive.newModifyLabelsRequest()
  AddLabel.setLabelModifications(Drive.newLabelModification().setLabelId(labelId));
  // Commit
  let output = Drive.Files.modifyLabels(AddLabel, fileId);
  // Set field of file
  let fieldModification = Drive.newLabelFieldModification();
  fieldModification.fieldId = fieldId;
  fieldModification.setTextValues = fieldValue
  let modifyLabelsRequest = Drive.newModifyLabelsRequest();
  modifyLabelsRequest.labelModifications = Drive.newLabelModification()
  modifyLabelsRequest.labelModifications.labelId = labelId;
  modifyLabelsRequest.labelModifications.setFieldModifications([fieldModification]);
  // Commit
  output = Drive.Files.modifyLabels(modifyLabelsRequest, fileId);
  //Logger.log(output);
}

/*******************************************************************************************************
* This function gives the json format from a label created for Google Drive
* ******************************************************************************************************
* @param {} 
* @return {} 
*/
function getLabelInformation() {
  //Place label id -> Example https://drive.google.com/labels/v2793JJ
  let label_json = DriveLabels.Labels.get("labels/v2793JJ", {
    "view": "LABEL_VIEW_FULL"
  })
  label_json.fields.forEach(function (t) {
    let text
    try {
      text = `"id": "` + t.id + `",
      "options": [`
      t.selectionOptions.choices.forEach(function (c) {
        text += `{
          "name": "`+ c.properties.displayName + `",
          "id": "`+ c.id + `"
        },`
      })
    }
    catch (e) {
      Logger.log(e)
      text = t.properties.displayName + ":" + t.id
    }
  })
  console.log(text)
  return text
}



/*******************************************************************************************************
* This function loop over the files list and apply the right value for the label filed
* ******************************************************************************************************
* @param {} 
* @return {} 
*/
function setlabels() {
  let data = SP.getSheetByName("XXXXX").getDataRange().getValues()
  //If the script is too lng (because the files list is too long ), we can break down the function call by breaking the data into smaller array of 500 lines
  //That's why we add a line number, to know where we stopped and to resume on the next call
  let index = Number(PropertiesService.getScriptProperties().getProperty("startIndex"))
  for (let i = index; i < index + step; i++) {
    let docId = data[i][xx] //On récupère l'id du fichier pour lequel on va appliquer le label
    try {
      //We gather the value to add on the label fields
      let champ1Valeur = data[i][xx]
      let champ2Valeur = data[i][xx]
      let champ3Valeur = data[i][xx]
      //We apply a filter for the list type label fields using the value set up in the Google Sheets/files list
      /*
      {
      "name": "bordeaux",
      "id": "xxxxxx"
      }
      */
      let champ4Valeur = champ4Liste.options.filter(x => x.name == data[i][xx])[0].id 

      //We apply the values to the label fields using functions depending on the field type
      setLabelText(docId, LABEL.id, LABEL.champ1.id, champ1Valeur)
      setLabelText(docId, LABEL.id, LABEL.champ2.id, champ2Valeur)
      setLabelInteger(docId, LABEL.id, LABEL.champ3.id, champ3Valeur)
      setLabelList(docId, LABEL.id, LABEL.champ4.id, champ4Valeur)
    }
    catch (e) {
      console.log(e + ":" + i + ":" + data[i][2])
    }
  }
  //Index incrementation
  PropertiesService.getScriptProperties().setProperty("startIndex", index + step)
}
