<script setup>
import { UseTimeAgo } from '@vueuse/components'
import { ArrowPathIcon } from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  buttonLabel: {
    type: String,
    required: true,
    default: 'Add',
  },
  items: {
    type: Array,
    required: true,
  },
  reload: {
    type: Function,
    required: false,
    default: () => {},
  },
})

const emits = defineEmits(['add'])
const text = ref('')
const chatBoxHeight = ref(0)

const add = () => {
  if (text.value === '') return
  emits('add', text.value)
  text.value = ''
}

const { loading, toggleLoading } = useLoading()

const refresh = async () => {
  toggleLoading()
  await props.reload()
  toggleLoading()
}

const getAvatar = (name, size = 22, fontSize = 0.33, background = '0050F9', color = 'FFF') => {
  return 'https://ui-avatars.com/api/?name=' + name + '&background='+ background +'&color='+ color +'&size=' + size +'&rounded=true&bold=true&font-size=' + fontSize;
}
</script>

<template>
  <Card
    divider
    shadow-size="none"
    card-header-class="px-2 py-1.5 flex justify-between items-center"
    card-body-class="p-3 h-full"
    card-footer-class="mt-auto px-2 py-1.5"
    class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
    @card-body-height="chatBoxHeight = $event - 30"
  >
    <template #header>
      <p class="leading-6 font-medium text-sm text-gray-900">
        {{ title }} ( {{ items.ORD_NOTE_COUNT ? decrypt(items.ORD_NOTE_COUNT) : '' }} )
      </p>

      <span class="cursor-pointer">
        <ArrowPathIcon
          class="w-5 h-5"
          :class="{
            'animate-spin': loading
          }"
          @click="refresh"
        />
      </span>
    </template>

    <div class="flex flex-col h-full">
      <div
        class="flex-none overflow-y-auto"
        :style="{
          height: chatBoxHeight + 'px'
        }"
      >
        <div class="flex flex-col space-y-1">
          <div
            v-for="(item, index) in items?.NOTES ?? []"
            :key="index"
            class="flex"
            :class="{
              'justify-end text-right': decrypt(item.ORD_NOTE_SIDE) === 'R',
              'justify-start text-left': decrypt(item.ORD_NOTE_SIDE) === 'L',
            }"
          >
            <div class="max-w-sm space-y-2 isac-note-list cursor-pointer">
              <div
                v-if="items.NOTES[index - 1]?.ORD_NOTE_SIDE !== item?.ORD_NOTE_SIDE"
                class="flex gap-x-2 items-center"
                :class="{
                  'flex-row-reverse': decrypt(item.ORD_NOTE_SIDE)=== 'R',
                }"
              >
                <img
                  :src="getAvatar(decrypt(item.ORD_NOTE_USER_NAME) || 'No Name')"
                  alt="Avatar"
                >
                <span class="text-xs text-gray-500">
                  {{ decrypt(item.ORD_NOTE_USER_NAME) || 'No Name' }}
                </span>
                <span class="w-1 h-1 rounded-full bg-gray-500" />
                <span class="text-xs text-gray-500 capitalize">
                  <UseTimeAgo
                    v-slot="{ timeAgo }"
                    :time="new Date(decrypt(item.ORD_NOTE_DATETIME))"
                  >
                    {{ timeAgo }}
                  </UseTimeAgo>
                </span>
              </div>
              <div
                class="flex items-center gap-x-2"
                :class="{
                  'flex-row-reverse': decrypt(item.ORD_NOTE_SIDE) === 'R',
                }"
              >
                <div class="bg-gray-100 p-2 rounded">
                  <p class="leading-normal break-words text-sm">
                    {{ decrypt(item.ORD_NOTE) }}
                  </p>
                </div>
                <p class="text-xs text-gray-500 isac-note">
                  {{ decrypt(item.ORD_NOTE_DATETIME) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <FormGroup>
        <FormTextInput
          v-model="text"
          placeholder="Enter text"
          size="lg"
        />
        <template #suffix>
          <Button
            id="POP00020_BTN01008"
            rounded
            class="h-full w-full rounded-l-none"
            @click="add"
          >
            {{ buttonLabel }}
          </Button>
        </template>
      </FormGroup>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.isac-note-list {
  .isac-note {
    display: none;
    transition: all 1s ease-in-out;
  }

  &:hover {
    .isac-note {
      display: block;
    }
  }
}
</style>
