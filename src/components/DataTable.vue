<template>

    <v-container fluid>
        <!-- Table displaying the items -->
        <v-data-table :headers="headers" :items="items" item-value="id" @click:row="openEditDialog" />

        <!-- Edit Dialog -->
        <v-dialog v-model="isDialogOpen" max-width="600">
            <v-card>
                <v-card-title>Edit Item</v-card-title>
                <v-card-text>
                    <!-- Form fields for each property in userStrings -->
                    <v-text-field label="" v-model="editedItem.id"></v-text-field>

                    <v-text-field v-for="(value, key) in editedItem.userStrings" :key="key" :label="key"
                        v-model="editedItem.userStrings[key]"></v-text-field>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveChanges">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>

</template>

<script setup>

import { ref, onMounted, computed, watch } from "vue";

import { getLatestVersion, getModelObjects, getObjectData } from '@/speckleUtils'

import { loadData } from '@/speckleLoader'

const url = ref("https://app.speckle.systems/projects/f9eeb0be04/models/5f0cc648bc");
const limit = ref(10);
const fetchLoading = ref(false);
const items = ref([
    {
        id: "a104afeb33a7b4a88f04f3bf41f67822",
        userStrings: {
            SF_LOC_Eix: "E",
            SF_LOC_Zona: "Andreu",
            SF_GEN_Vol_m3: "4.0",
            SF_ObjectType: "SFPanel",
            SF_ObjectSubType: "DoorFrame",
            SF_GEN_GrossVol_m3: "7.13",
            SF_GEN_GrossDepth_m: "0.7",
            SF_GEN_GrossWidth_m: "2.01",
            SF_GEN_GrossHeight_m: "5.07",
            SF_ARC_Agrupacio1: "05_SFPanel_DoorFrame_Andreu_E_00",
            SF_ARC_Agrupacio1Numeral: "00",
        },
    },
    {
        id: "1ad236c6dcb942bb9cc3211197735818",
        userStrings: {
            SF_LOC_Eix: "F",
            SF_LOC_Zona: "Barcelona",
            SF_GEN_Vol_m3: "5.0",
            SF_ObjectType: "SFPanel",
            SF_ObjectSubType: "WindowFrame",
            SF_GEN_GrossVol_m3: "8.13",
            SF_GEN_GrossDepth_m: "0.8",
            SF_GEN_GrossWidth_m: "2.11",
            SF_GEN_GrossHeight_m: "5.17",
            SF_ARC_Agrupacio1: "05_SFPanel_WindowFrame_Barcelona_F_01",
            SF_ARC_Agrupacio1Numeral: "01",
        },
    }
    // Add other elements as needed
]);

// Dynamically generate headers based on the first item’s userStrings keys
const userStringKeys = Object.keys(items.value[0]?.userStrings || {});

const headers = ref([
    { title: 'ID', value: 'id' },
    ...userStringKeys.map(key => ({ title: key, value: `userStrings.${key}` }))
]);

// State for the dialog and editing
const isDialogOpen = ref(false);
const editedItem = ref(null);

// Function to open the dialog with the selected item
const openEditDialog = (item) => {
    editedItem.value = JSON.parse(JSON.stringify(item)); // Create a deep copy of the item
    isDialogOpen.value = true;
};

// Function to close the dialog
const closeDialog = () => {
    isDialogOpen.value = false;
    // editedItem.value = null;
};

// Function to save changes and update the item in the items array
const saveChanges = () => {
    // Find the index of the edited item in the items array
    const index = items.value.findIndex(item => item.id === editedItem.value.id);
    if (index !== -1) {
        items.value[index] = { ...editedItem.value }; // Update the item with the new data
    }
    closeDialog();
};



//set up on mounted hook
onMounted(async () => {

    const speckleObj = await loadData()
    // console.log(speckleObj)

    let items = extractBreps(speckleObj)
    //slice items array get first two items

    console.log(items)



});


// Fetch search results asynchronously
const fetchSearchResults = async () => {
    // if (!e || e.length < 1) return
    const project = "f9eeb0be04"
    const model = "f03204e74c"

    const json = await getLatestVersion(project, model)
    const ver = json.data.project.model.versions.items[0].id
    console.log(ver)

    const json2 = await getModelObjects(project, model, ver)
    const obj = json2.data.project.model.version.referencedObject
    console.log(obj)


    const json3 = await getObjectData(project, obj)
    const data = json3.data.project.object.data
    console.log(data)


    // streams.value = json.data.streams
}

function extractBreps(data) {
    const result = [];

    function recursiveExtract(elements) {
        if (!Array.isArray(elements)) return;

        elements.forEach(element => {
            if (element.speckle_type === "Objects.Geometry.Brep") {

                result.push(element.userStrings);

            }
            if (element.elements) {
                // Recursively search within nested elements
                recursiveExtract(element.elements);
            }
        });
    }

    recursiveExtract(data.elements);
    return result;
}




</script>

<style scoped>
.v-container {
    width: 100%;
    height: 100%;
}
</style>