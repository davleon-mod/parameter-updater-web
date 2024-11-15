<template>

  <WelcomeView fluid v-if="store.Authenticated" />

  <v-container v-else class="home pa-6" fluid mx-0>


    <!-- <DataTable /> -->
    <Example />



  </v-container>

</template>


<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useSpeckleStore } from '@/stores/index'; // Adjust the store path as necessary

import StreamSearch from "@/components/StreamSearch.vue";
import WelcomeView from "@/components/WelcomeView.vue";
import DataTable from "@/components/DataTable.vue";
import Example from "@/components/Example.vue";

// Pinia store
const store = useSpeckleStore();

// Server URL (environment variable)
const serverUrl = import.meta.env.VUE_APP_SERVER_URL;

const loading = ref(false)
const options = reactive({ itemsPerPage: 5 })

const selectedKeys = ref(["id", "message", "branchName", "authorName"])

onMounted(() => {
  const storedOpts = store.tableOptions;
  if (storedOpts) Object.assign(options, storedOpts);
});

// Computed properties
const selectedStream = computed(() => {
  return store.currentStream
})


const commits = computed(() => store.latestCommits);

const previousCursors = computed(() => store.previousCursors || [null]);

const availableKeys = computed(() => {
  const keys = {};
  commits.value?.items.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (!keys[key]) {
        keys[key] = true;
      }
    });
  });
  return Object.keys(keys);
});

const filteredHeaders = computed(() => {
  return selectedKeys.value.map((key) => {
    return {
      title: key,
      key: key,
    };
  });
})

watch(
  options,
  async (val, oldval) => {
    store.setTableOptions(val);
    if (oldval.page && val.page !== oldval.page) {
      loading.value = true;
      if (val.page > oldval.page) {
        const cursor = store.latestCommits.cursor;
        await store.getCommits(cursor);
        store.addCursorToPreviousList(cursor);
      } else {
        console.log('page down');
        await store.getCommits(previousCursors.value[val.page - 1]);
      }
      loading.value = false;
    }
  },
  { deep: true }
);


function handleStreamSelection(event) {
  store.handleStreamSelection(event)

}


</script>
