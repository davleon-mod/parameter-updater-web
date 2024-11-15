<template>
    <v-data-table :headers="headers" :items="desserts" item-value="name" class="elevation-1">
        <template v-slot:item="{ item }">
            <tr>
                <td v-for="header in headers" :key="header.value">
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

    <p>{{ desserts }}</p>
</template>

<script setup>
import { ref } from 'vue';

const headers = ref([
    {
        title: "Dessert",
        align: "left",
        sortable: false,
        value: "name"
    },
    { title: "Calories", value: "calories" },
    { title: "Fat (g)", value: "fat" },
    { title: "Carbs (g)", value: "carbs" },
    { title: "Protein (g)", value: "protein" },
    { title: "Iron (%)", value: "iron" },
]);

const desserts = ref([
    {
        id: 1,
        name: "Frozen Yogurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: "1%"
    },
    {
        id: 2,
        name: "Ice cream sandwich",
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: "1%"
    },
    {
        id: 3,
        name: "Eclair",
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: "7%"
    },
    {
        id: 4,
        name: "Cupcake",
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        iron: "8%"
    },
    {
        id: 5,
        name: "Gingerbread",
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        iron: "16%"
    },
    {
        id: 6,
        name: "Jelly bean",
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        iron: "0%"
    },
    {
        id: 7,
        name: "Lollipop",
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        iron: "2%"
    },
    {
        id: 8,
        name: "Honeycomb",
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        iron: "45%"
    },
    {
        id: 9,
        name: "Donut",
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        iron: "22%"
    },
    {
        id: 10,
        name: "KitKat",
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        iron: "6%"
    }
]);

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
};

const cancelEdit = () => {
    editDialog.value = false;
    console.log('Cancelled');
};
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>
