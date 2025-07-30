import JsonExcel from 'vue-json-excel3'

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.component('DownloadExcel', JsonExcel)
});
