<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import {MinusIcon, PlusIcon} from "@heroicons/vue/24/solid/index.js";
const props = defineProps({
  additionalItemsData: {
    type: Object,
    default: () => {}
  },
  brand: {
    type: Object,
    default: () => {}
  }
})

const { getComponentData } = usePageLoaderComponent(['POP00210'])

const additionalData = ref(props.additionalItemsData)

const tableFields = [
  {
    caption: 'Item Type',
    dataFieldName: 'ITEM_TYPE',
    display: 'Y'
  },
  {
    caption: 'SAP Code',
    dataFieldName: 'SAP_CODE',
    display: 'Y'
  },
  {
    caption: 'Item Name',
    dataFieldName: 'ITEM_NAME',
    display: 'Y'
  },
  {
    caption: 'Item Qty',
    dataFieldName: 'ITEM_QTY',
    display: 'Y'
  },
  {
    caption: 'Limit Qty',
    dataFieldName: 'LIMIT_QTY',
    display: 'Y'
  },
  {
    caption: '',
    dataFieldName: 'ACTION',
    display: 'Y'
  }
]

const removeItem = (item, key) => {
  const index = additionalData.value[key].findIndex((data) => data === item)
  additionalData.value[key].splice(index, 1)

  if (additionalData.value[key].length === 0) {
    delete additionalData.value[key]
  }
}

const newItemFor = ref(null)

const openNewItemModal = ref(false)

const openNewItem = (key) => {
  newItemFor.value = key
  openNewItemModal.value = true
}

const onRowDoubleClick = (data) => {
  if (additionalData.value[newItemFor.value] === undefined) {
    additionalData.value[newItemFor.value] = []
  }

  const itemNoMap = {
    '1ST': '1',
    '2ND': '2',
    '3RD': '3'
  };

  const itemNo = itemNoMap[newItemFor.value] || '';

  additionalData.value[newItemFor.value].push({
    PROM_ITEM_NO: encrypt(itemNo),
    PROM_ITEM_NO_SEQ: encrypt(parseInt(newItemFor.value).toString()),
    PROM_ITEM_TYPE: encrypt(data.type),
    PROM_ITEM_CODE: data.type === 'ITEMS' ? data.data.ITEM_CODE : data.data.NMD_CODE,
    PROM_ITEM_BRAND_CODE: data.type === 'ITEMS' ? data.data.ITEM_BRAND_CODE : data.data.NMD_BRAND_CODE,
    PROM_ITEM_BRAND_SNAME: data.type === 'ITEMS' ? data.data.ITEM_BRAND_SNAME : data.data.NMD_BRAND_SNAME,
    PROM_ITEM_BRAND_FNAME: data.type === 'ITEMS' ? data.data.ITEM_BRAND_FNAME : data.data.NMD_BRAND_FNAME,
    PROM_ITEM_ALU: data.type === 'ITEMS' ? data.data.ITEM_ALU : data.data.NMD_ALU,
    PROM_ITEM_EAN: data.type === 'ITEMS' ? data.data.ITEM_EAN : data.data.NMD_EAN,
    PROM_ITEM_SANME: data.type === 'ITEMS' ? data.data.ITEM_SNAME : data.data.NMD_SNAME,
    PROM_ITEM_FANME: data.type === 'ITEMS' ? data.data.ITEM_FNAME : data.data.NMD_FNAME,
    PROM_ITEM_QTY: encrypt('1'),
    PROM_ITEM_SHIPPED_QTY: encrypt(''),
    PROM_ITEM_LIMIT_QTY: encrypt('50'),
  })
  openNewItemModal.value = false
}

const emit = defineEmits(['save'])

const save = () => {
  emit('save', additionalData.value)
}
</script>

<template>
  <div class="space-y-3">
    <div class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg">
      <div class="p-2 flex items-center justify-between">
        <span class="text-md">
          First Original Items or None-MD Items
        </span>

        <Button
          rounded
          variant="white"
          border
          size="xs"
          @click="openNewItem('1ST')"
        >
          <PlusIcon class="w-5 h-5" />
        </Button>
      </div>
      <Table
        header-variant="secondary"
      >
        <TableHead>
          <TableHeadCell
            v-for="(column, index) in tableFields"
            :key="index"
          >
            {{ column.caption }}
          </TableHeadCell>
        </TableHead>
        <TableBody>
          <TableRow
            v-for="(item, index) in additionalData['1ST'] ?? []"
            :key="index"
          >
            <TableCell>
              <span class="w-32">
                {{ decrypt(item.PROM_ITEM_TYPE) }}
              </span>
            </TableCell>
            <TableCell>
              <span class="w-32">
                {{ decrypt(item.PROM_ITEM_CODE) }}
              </span>
            </TableCell>
            <TableCell>
              <span>
                {{ decrypt(item.PROM_ITEM_FANME) }}
              </span>
            </TableCell>
            <TableCell>
              <FormTextInput
                :value="decrypt(item.PROM_ITEM_QTY)" 
                @input="e => item.PROM_ITEM_QTY = encrypt(e.target.value)" 
              />
            </TableCell>
            <TableCell>
              <FormTextInput
                :value="decrypt(item.PROM_ITEM_LIMIT_QTY)" 
                @input="e => item.PROM_ITEM_LIMIT_QTY = encrypt(e.target.value)"
              />
            </TableCell>
            <TableCell>
              <div class="text-end">
                <Button
                  variant="danger"
                  size="xs"
                  class="rounded"
                  @click="removeItem(item, '1ST')"
                >
                  <MinusIcon class="w-5 h-5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg">
      <div class="p-2 flex items-center justify-between">
        <span class="text-md">
          Second Original Items or None-MD Items
        </span>

        <Button
          rounded
          variant="white"
          border
          size="xs"
          @click="openNewItem('2ND')"
        >
          <PlusIcon class="w-5 h-5" />
        </Button>
      </div>
      <Table
        header-variant="secondary"
      >
        <TableHead>
          <TableHeadCell
            v-for="(column, index) in tableFields"
            :key="index"
          >
            {{ column.caption }}
          </TableHeadCell>
        </TableHead>
        <TableBody>
          <TableRow
            v-for="(item, index) in additionalData['2ND'] ?? []"
            :key="index"
          >
            <TableCell>
              <span class="w-32">
                {{ decrypt(item.PROM_ITEM_TYPE) }}
              </span>
            </TableCell>
            <TableCell>
              <span class="w-32">
                {{ decrypt(item.PROM_ITEM_CODE) }}
              </span>
            </TableCell>
            <TableCell>
              <span class="w-32">
                {{ decrypt(item.PROM_ITEM_FANME) }}
              </span>
            </TableCell>
            <TableCell>
              <FormTextInput
                :value="decrypt(item.PROM_ITEM_QTY)" 
                @input="e => item.PROM_ITEM_QTY = encrypt(e.target.value)" 
              />
            </TableCell>
            <TableCell>
              <FormTextInput
                :value="decrypt(item.PROM_ITEM_LIMIT_QTY)" 
                @input="e => item.PROM_ITEM_LIMIT_QTY = encrypt(e.target.value)"
              />
            </TableCell>
            <TableCell>
              <div class="text-end">
                <Button
                  variant="danger"
                  size="xs"
                  class="rounded"
                  @click="removeItem(item, '2ND')"
                >
                  <MinusIcon class="w-5 h-5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg">
      <div class="p-2 flex items-center justify-between">
        <span class="text-md">
          Third Original Items or None-MD Items
        </span>

        <Button
          rounded
          variant="white"
          border
          size="xs"
          @click="openNewItem('3RD')"
        >
          <PlusIcon class="w-5 h-5" />
        </Button>
      </div>
      <Table
        header-variant="secondary"
      >
        <TableHead>
          <TableHeadCell
            v-for="(column, index) in tableFields"
            :key="index"
          >
            <div class="w-max">
              {{ column.caption }}
            </div>
          </TableHeadCell>
        </TableHead>
        <TableBody>
          <TableRow
            v-for="(item, index) in additionalData['3RD'] ?? []"
            :key="index"
          >
            <TableCell>
              <span>
                {{ decrypt(item.PROM_ITEM_TYPE) }}
              </span>
            </TableCell>
            <TableCell>
              <span>
                {{ decrypt(item.PROM_ITEM_CODE) }}
              </span>
            </TableCell>
            <TableCell>
              <span>
                {{ decrypt(item.PROM_ITEM_FANME) }}
              </span>
            </TableCell>
            <TableCell>
              <FormTextInput
                :value="decrypt(item.PROM_ITEM_QTY)" 
                @input="e => item.PROM_ITEM_QTY = encrypt(e.target.value)" 
              />
            </TableCell>
            <TableCell>
              <FormTextInput
                :value="decrypt(item.PROM_ITEM_LIMIT_QTY)" 
                @input="e => item.PROM_ITEM_LIMIT_QTY = encrypt(e.target.value)"
              />
            </TableCell>
            <TableCell>
              <div class="text-end">
                <Button
                  variant="danger"
                  size="xs"
                  class="rounded"
                  @click="removeItem(item, '3RD')"
                >
                  <MinusIcon class="w-5 h-5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="grid grid-cols-7 gap-x-3">
      <div class="col-span-6" />
      <Button
        variant="gray"
        rounded
        size="sm"
        @click="save"
      >
        {{ getComponentData('POP00270_BTN01004', 'caption', 'Save') }}
      </Button>
    </div>

    <Modal
      :show="openNewItemModal"
      divider
      size="6xl"
      @close="() => {
        openNewItemModal = false
        newItemFor = null
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00210_LBL01001', 'caption', 'Items') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00210'"
          :brand="brand"
          @on-row-double-click="onRowDoubleClick"
        />
      </template>
    </Modal>
  </div>
</template>

<style scoped>

</style>
