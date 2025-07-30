<script setup>
import { PhotoIcon } from '@heroicons/vue/24/solid'
import Uppy from "@uppy/core";
import DropTarget from "@uppy/drop-target";

const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  imageFor: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['imageAdded'])
const uppyInstance = ref(null)

const uploadedFiles = computed(() => {
  if (uppyInstance.value) {
    return uppyInstance.value.getFiles()
  }
  return []
})

const readFileAsDataURL = (file) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    uppyInstance.value.addFile({
      name: file.name,
      type: file.type,
      data: file,
      preview: reader.result // This is the base64 representation of the file
    });
  };
  reader.readAsDataURL(file);
}

const onDrop = (e) => {
  if (props.multiple) {
    const files = Array.from(e.target.files);
    files.forEach(readFileAsDataURL);
  } else {
    const file = e.target.files[0];
    readFileAsDataURL(file);
  }
}

onMounted(() => {
  uppyInstance.value = new Uppy({
    restrictions: {
      maxNumberOfFiles: props.multiple ? 99 : 1,
      allowedFileTypes: ['image/*'],
      maxFileSize: 3000000,
    },
    autoProceed: false
  })
  uppyInstance.value.use(DropTarget, {
    target: '#drop-zone',
  })
})

const createImageObject = (file) => {
  return {
    IMAGE_NAME: file.name,
    IMAGE_URL: '-',
    IMAGE_BASE64: file.preview,
  };
};

const onClickAddImage = () => {
  const files = props.multiple
    ? uploadedFiles.value.map(createImageObject)
    : createImageObject(uploadedFiles.value[0]);
  emits('imageAdded', {
    files,
    imageFor: props.imageFor,
  });
};
</script>

<template>
  <div class="space-y-3">
    <div
      id="drop-zone"
      class="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 z-50"
    >
      <div class="text-center">
        <PhotoIcon
          class="mx-auto h-12 w-12 text-gray-300"
          aria-hidden="true"
        />
        <div class="mt-4 flex text-sm leading-6 text-gray-600">
          <label
            for="file-upload"
            class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            <span>
              Upload a file
            </span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              class="sr-only"
              :multiple="props.multiple"
              @change="onDrop"
            >
          </label>
          <p class="pl-1">
            or drag and drop
          </p>
        </div>
        <p class="text-xs leading-5 text-gray-600">
          PNG, JPG max size 3MB
        </p>
      </div>
    </div>

    <div>
      <ul
        role="list"
        class="divide-y divide-gray-100"
      >
        <li
          v-for="file in uploadedFiles"
          :key="file"
          class="flex justify-between gap-x-6 py-2 items-center"
        >
          <div class="flex min-w-0 gap-x-4">
            <img
              class="h-12 w-12 flex-none rounded bg-gray-50"
              :src="file.preview"
              alt=""
            >
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-gray-900">
                {{ file.name }}
              </p>
              <p class="mt-1 truncate text-xs leading-5 text-gray-500">
                {{ file.type }}
              </p>
            </div>
          </div>

          <div>
            <Button
              variant="danger"
              size="xs"
              rounded
              class="w-6 h-6"
              @click="uppyInstance.removeFile(file.id)"
            >
              x
            </Button>
          </div>
        </li>
      </ul>
    </div>

    <div
      v-if="uploadedFiles.length > 0"
      class="flex justify-end pb-1"
    >
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        @click="onClickAddImage"
      >
        {{ getComponentData('POP00060_BTN01001', 'caption', 'Add') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
