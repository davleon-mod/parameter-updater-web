<script setup>
import { ref } from 'vue'

const data = [
    {
        id: "a104afeb33a7b4a88f04f3bf41f67822",
        userStrings: {
            SF_LOC_Eix: "E",
            SF_LOC_Zona: "Andreu",
            SF_GEN_Vol_m3: "4.0",
            SF_ObjectType: "SFPanel",
            SF_GEN_Weight_t: "100",
            SF_ObjectSubType: "DoorFrame",
            SF_ARC_Agrupacio1: "05_SFPanel_DoorFrame_Andreu_E_00",
            SF_GEN_GrossVol_m3: "7.13",
            SF_GEN_GrossDepth_m: "0.7",
            SF_GEN_GrossWidth_m: "2.01",
            SF_GEN_GrossHeight_m: "5.07",
            SF_ARC_Agrupacio1Numeral: "00",
        },
    },
    {
        id: "1ad236c6dcb942bb9cc3211197735818",
        userStrings: {
            SF_LOC_Eix: "E",
            SF_LOC_Zona: "Andreu",
            SF_GEN_Vol_m3: "4.0",
            SF_ObjectType: "SFPanel",
            SF_GEN_Weight_t: "100",
            SF_ObjectSubType: "DoorFrame",
            SF_ARC_Agrupacio1: "05_SFPanel_DoorFrame_Andreu_E_00",
            SF_GEN_GrossVol_m3: "7.13",
            SF_GEN_GrossDepth_m: "0.7",
            SF_GEN_GrossWidth_m: "2.01",
            SF_GEN_GrossHeight_m: "5.07",
            SF_ARC_Agrupacio1Numeral: "00",
        },
    },
    // Additional items here...
];

// Flatten the data to bring 'userStrings' properties to the top level
const items = data.map((item) => ({
    id: item.id,
    ...item.userStrings,
}));

// Extract unique keys from 'userStrings' to create table headers
const userStringKeys = new Set();
data.forEach((item) => {
    Object.keys(item.userStrings).forEach((key) => {
        userStringKeys.add(key);
    });
});
const userStringKeysArray = Array.from(userStringKeys);

// Create headers for the data table
const headers = [
    { title: 'ID', value: 'id', class: 'highlighted-column', cellClass: 'highlighted-column' },
    ...userStringKeysArray.map((key) => ({
        title: key,
        value: key,
        class: 'highlighted-column',
        cellClass: 'highlighted-column',
    })),
];
</script>

<template>
    <v-data-table :headers="headers" :items="items" class="elevation-1">
    </v-data-table>
</template>

<style>
.highlighted-column {
    background-color: #f0f0f0;
    /* Customize the highlight color */
}
</style>
