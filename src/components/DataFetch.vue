<template>

    <v-container fluid class="pa-0 ma-0" style="padding: 0; margin: 0;">

        <div class="mb-0">
            <v-row no-gutters>
                <v-col md="8">
                    <v-text-field label="Object Url" v-model="url">


                    </v-text-field>
                </v-col>

                <v-col md="2" class="pl-4">

                    <v-text-field label="Limit" v-model.number="limit" type="number">

                    </v-text-field>

                </v-col>
                <v-col md="2" class="pl-4">

                    <v-btn elevation="4" color="primary" :loading="fetchLoading && !prevLoading && !nextLoading"
                        @click="fetchCategories">Fetch
                    </v-btn>
                </v-col>

            </v-row>
        </div>

    </v-container>


</template>

<script setup>

import { ref, computed, watch } from "vue";


const url = ref("https://app.speckle.systems/projects/f9eeb0be04/models/5f0cc648bc");
const limit = ref(10);
const fetchLoading = ref(false);


async function fetchCategories() {
    this.$emit("setRenderer", this.url);

    // Parse the object's url and extract the info we need from it.
    const url = new URL(this.url);
    const server = url.origin;
    const streamId = url.pathname.split("/")[2];
    const objectId = url.pathname.split("/")[4];

    // Get the gql query string.
    const query = objectQuery(streamId, objectId);

    console.log(query)

    // Set loading status
    this.fetchLoading = true;

    // Send the request to the Speckle graphql endpoint.
    // Note: The limit, selection and query clause are passed in as variables.
    let rawRes = await this.fetchFromApi(query, null, server);

    // Parse the response into.
    let res = await rawRes.json();

    let obj = res.data.stream.object;

    this.objects = obj.data;
    let tempCategories = Object.keys(this.objects).filter((cat) =>
        cat.startsWith("@")
    );
    this.categories = tempCategories
        .map((cat) => cat.slice(1))
        .filter((c) => !c.startsWith("<"))
        .sort();

    // Last, signal that we're done loading!
    this.fetchLoading = false;
}

async function fetchCategoryObjects(category) {
    // Set loading status
    this.fetchLoading = true;

    this.flatObjs = [];
    this.selectedCategory = category;

    let objs = this.objects[`@${category}`];
    let referencedIds = objs.map((o) => o["referencedId"]);

    const url = new URL(this.url);
    const server = url.origin;
    const streamId = url.pathname.split("/")[2];
    this.parameterUpdater.streamid = streamId;

    for (const objectId of referencedIds) {
        let query = objectQuery(streamId, objectId);

        let variables = {
            limit: this.limit,
            mySelect: this.select ? JSON.parse(this.select) : null,
            myQuery: this.query ? JSON.parse(this.query) : null,
        };

        let rawRes = await this.fetchFromApi(query, variables, server);

        // Parse the response into.
        let res = await rawRes.json();

        let obj = res.data.stream.object;
        // console.log("obj.data:", obj.data);
        // filter RevitElementTypes
        if (!obj.data["speckle_type"].endsWith("RevitElementType")) {
            this.parameterUpdater.addObjects([obj]);

            // Flatten the object!
            let flatObj = flat(obj.data, { safe: false });
            this.flatObjs.push(flatObj);
        }
    }

    // Create a unique list of all the headers.
    this.uniqueHeaderNames = new Set();

    // console.log("flatObjs:", this.flatObjs);

    let ids = [];

    for (var index in this.flatObjs) {
        var o = this.flatObjs[index];

        Object.keys(o).forEach(
            (k) => {
                if (
                    !k.includes("__closure") &&
                    !k.includes("type") &&
                    !k.includes("id") &&
                    !k.includes("family") &&
                    !k.includes("elementId") &&
                    !k.includes("category") &&
                    (k.startsWith("parameters") &&
                        !k.endsWith("applicationUnit") &&
                        !k.endsWith("applicationUnitType") &&
                        !k.endsWith("applicationId") &&
                        !k.endsWith("id") &&
                        !k.endsWith("totalChildrenCount") &&
                        !k.endsWith("units") &&
                        !k.endsWith("speckle_type") &&
                        !k.endsWith("isShared") &&
                        !k.endsWith("isReadOnly") &&
                        !k.endsWith("isTypeParameter") &&
                        !k.endsWith("applicationInternalName") &&
                        !k.endsWith("name"))) {
                    let isReadOnlyKey = k.replace("value", "isReadOnly");
                    let isTypeParameterKey = k.replace("value", "isTypeParameter");
                    let nameKey = k.replace("value", "name");
                    let applicationInternalNameKey = k.replace("value", "applicationInternalName");

                    let isReadOnly = o[isReadOnlyKey];
                    let isTypeParameter = o[isTypeParameterKey];
                    let name = o[nameKey];
                    let applicationInternalName = o[applicationInternalNameKey];
                    let units = o["units"];

                    if (!isReadOnly && !isTypeParameter) {
                        // console.log("isReadOnly:", isReadOnly);
                        // console.log("isTypeParameter:", isTypeParameter);
                        // this.uniqueHeaderNames.add(k);
                        // console.log("kept:", k);

                        let instanceParameterName = name + " | " + applicationInternalName;
                        if (units) {
                            instanceParameterName = instanceParameterName + " [" + units + "]";
                        }
                        this.instanceParameters.push(instanceParameterName);
                    }
                    else {
                        // console.log("dropped:", k);
                    }
                }
            }
        );
        ids.push(o.id);
    }
    this.initFilters();
    this.totalCount = this.flatObjs.length;

    this.rendererFilter = {
        filterBy: { __parents: { includes: ids } },
        ghostOthers: true,
    };
    this.$emit("applyFilter", this.rendererFilter);

    // Last, signal that we're done loading!
    this.fetchLoading = false;
}

</script>

<style scoped>
.v-container {
    width: 100%;
    height: 100%;
}
</style>