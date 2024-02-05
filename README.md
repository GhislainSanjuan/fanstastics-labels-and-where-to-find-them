# Fantastic labels and where to find them

In the quest of an optimized research in Google Drive, many teams asked me to place some metadata on their documents and files. 

Widespread in Microsoft environment, this tool is not really known in Google Drive by users. 
![1](https://github.com/GhislainSanjuan/fanstastics-labels-and-where-to-find-them/blob/main/docs/Label_MS_vs_GW.png)

As Google Workspace admin or may I say wizards, we can use some little tricks to answer teams requirements.  

First, we can create labels with the team : [Create label in the admin console](https://apps.google.com/supportwidget/articlehome?hl=en_fm&article_url=https%3A%2F%2Fsupport.google.com%2Fa%2Fanswer%2F13127870%3Fhl%3Den_fm&assistant_id=generic-unu&product_context=13127870&product_name=UnuFlow&trigger_context=a)

The label can have  different fields like list, number, text,..
![1](https://github.com/GhislainSanjuan/fanstastics-labels-and-where-to-find-them/blob/main/docs/label_setup.png)

Once the label is created, it needs to be secure and visible by the right people. 
An invisibility cloak can be used by setting up some parameters like who can edit or see the label.
![1](https://github.com/GhislainSanjuan/fanstastics-labels-and-where-to-find-them/blob/main/docs/label_sharing.png)

Once the spell the label is ready, we need to apply it on every files the user/team wants.
 
2 options are available :
![1](https://github.com/GhislainSanjuan/fanstastics-labels-and-where-to-find-them/blob/main/docs/label_application.png)

The script option needs first to extract in a Google Sheets the files list in the folder where the items are. You can use GAM to do so with this command 
```unix
gam user ghislain.sanjuan@sango-co.com show filelist select id folder_ID fields id,title,parents todrive tduser ghislain.sanjuan.externe@sango-co.com
```

Then each line/item needs to be reviewed by the end user in order to know what label value needs to be applied. 

This step can be helped by gathering the folder or file name : if the parent folder name contains 2000, then apply the label Archive for exemple. 
![1](https://github.com/GhislainSanjuan/fanstastics-labels-and-where-to-find-them/blob/main/docs/fileList.png)

In the meantime, you can check out the label structure created with this script 
This will give you the label fields IDs and other informations (names, options). It’s basically the Label JSON format.
```javascript
/*******************************************************************************************************
* This function gives the json format from a label created for Google Drive
* ******************************************************************************************************
* @param {} 
* @return {} 
*/
function getLabelInformation() {
  let text=""
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

```
The Label JSON format is created and the files list is set up with the labels value to apply for each file ? 

If yes, you can cast the spell that will apply the right value to the right label filed for every item. 

To do so, you can use Apps Script to apply the value to the different label fields.
```javascript
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
```


