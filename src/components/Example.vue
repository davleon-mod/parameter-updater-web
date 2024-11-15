<template>
    <v-data-table :headers="headers" :items="speckleUserData" item-value="name" class="elevation-1">
        <template v-slot:item="{ item }">
            <tr>
                <td bold v-for="header in headers" :key="header.value">
                    <span @click="editItem(item, header.value)">
                        {{ item[header.value] }}
                    </span>
                </td>
            </tr>
        </template>
    </v-data-table>

    <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
            <v-card-title>Edit</v-card-title>
            <v-card-text>
                <v-text-field v-model="editedValue" label="Edit" single-line />
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="cancelEdit">Cancel</v-btn>
                <v-btn text @click="saveEdit">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <div><v-spacer></v-spacer>
        <v-btn @click="commit" color="primary" class="elevation-2" style="margin-left: auto;">Commit</v-btn>
    </div>

    <!-- ffor debugging only -->
    <div v-if="changedItems.length > 0">
        <h2>Changed Items</h2>
        <hr>
        <div v-for="item in changedItems" :key="item.BrepId">
            <h3>{{ item.BrepId }}</h3>
            <ul>
                <li v-for="(value, key) in item" :key="key">
                    <strong>{{ key }}:</strong> {{ value }}
                </li>
            </ul>
            <hr>
        </div>
    </div>


    <!-- <p>{{ speckleUserData }}</p> -->
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from "vue";
import { getLatestVersion, getModelObjects, getObjectData } from '@/speckleUtils'
import { loadData } from '@/speckleLoader'


let headers = ref([])
const changedItems = ref([])

let speckleUserData = []

//set up on mounted hook
onMounted(async () => {

    const speckleObj = await loadData()
    // console.log(speckleObj)

    speckleUserData = reactive(extractBreps(speckleObj))
    //slice items array get first two items

    let keys = Object.keys(speckleUserData[0])

    headers.value = keys.map(key => {
        return {
            title: key,
            align: "left",
            sortable: true,
            value: key
        }
    })
});


function extractBreps(data) {
    const result = [];

    function recursiveExtract(elements) {
        if (!Array.isArray(elements)) return;

        elements.forEach(element => {
            if (element.speckle_type === "Objects.Geometry.Brep") {
                element.userStrings.BrepId = element.id;
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


function commit() {
    console.log('Committing changes')
    console.log(changedItems.value)
    // stringify the changedItems array and send it to the server
    const changedItemsString = JSON.stringify(changedItems.value)
    console.log(changedItemsString)
    // use the fetch api to send it to the www.localhost.com/api/commit endpoint
    fetch('http://127.0.0.1:5000/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: changedItemsString
    })

    // clear the changedItems array
    changedItems.value = []

}

//table functions
const editDialog = ref(false);
const editedValue = ref('');
const editingItem = ref(null);
const editingKey = ref('');

const editItem = (item, valueKey) => {
    editedValue.value = item[valueKey];
    editingItem.value = item;
    editingKey.value = valueKey;
    editDialog.value = true;
};

const saveEdit = () => {
    if (editingItem.value && editingKey.value !== '') {
        editingItem.value[editingKey.value] = editedValue.value;
    }
    editDialog.value = false;
    console.log('Saved:', editingItem.value[editingKey.value]);

    // Store the changed object in a separate array, only with the id property, the BrepId propety and the value that changed. If the object exist, update it
    const changedItem = changedItems.value.find(item => item.BrepId === editingItem.value.BrepId)
    if (changedItem) {
        changedItem[editingKey.value] = editedValue.value
    } else {
        changedItems.value.push({
            BrepId: editingItem.value.BrepId,
            [editingKey.value]: editedValue.value
        })
    }

    //store the object if it has changed
    // if (!changedItems.value.includes(editingItem.value)) {
    //     changedItems.value.push(editingItem.value);
    // }
};

const cancelEdit = () => {
    editDialog.value = false;
    console.log('Cancelled');
};
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>