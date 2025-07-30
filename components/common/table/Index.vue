<script setup>
import { provide } from 'vue'
import { encrypt, decrypt } from '@/stores/common/aes'

const props = defineProps({
  striped: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  condensed: {
    type: Boolean,
    default: false
  },
  verticalLine: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  },
  headerVariant: {
    type: String,
    default: 'white'
  },
  checkable: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  },
  columns: {
    type: [Array, Object],
    default: () => []
  },
  noDataText: {
    type: String,
    default: 'No data found'
  },
  rounded: {
    type: Boolean,
    default: false
  },
  divider: {
    type: Boolean,
    default: true
  },
})

const emits = defineEmits(['onRowClick', 'onRowDoubleClick']);

const onRowClick = (item) => {
  if (!props.clickable) return
  emits('onRowClick', item)
}

const onRowDoubleClick = (item) => {
  if (!props.clickable) return
  emits('onRowDoubleClick', item)
}

provide('striped', props.striped)
provide('sticky', props.sticky)
provide('condensed', props.condensed)
provide('verticalLine', props.verticalLine)
provide('clickable', props.clickable)
provide('headerVariant', props.headerVariant)
provide('checkable', props.checkable)

const { getMaskedValue } = useMasked();
</script>

<template>
  <div
    :class="{
      'overflow-hidden shadow ring-1 ring-black ring-opacity-5': border,
      'sm:rounded-lg' : rounded
    }"
  >
    <table
      class="min-w-full"
      :class="{
        'divide-y divide-gray-300': divider
      }"
    >
      <TableHead
        v-if="columns.length > 0"
        :hide-checkbox="!checkable"
      >
        <template
          v-if="checkable"
          #checkbox
        >
          <slot
            name="header(CHECKBOX)"
          >
            <FormCheckbox />
          </slot>
        </template>
        <slot
          v-for="(column, index) in columns.filter((column) => column.display === 'Y')"
          :key="index"
          :name="`header(${column?.dataFieldName ?? ''})`"
          :column="column"
        >
          <TableHeadCell>
            <div class="w-max">
              {{ column.caption }}
            </div>
          </TableHeadCell>
        </slot>
      </TableHead>

      <TableBody v-if="items.length > 0">
        <template
          v-for="(item, itemIndex) in items"
          :key="itemIndex"
        >
          <slot
            name="row"
            :item="item"
            :columns="columns"
          >
            <TableRow
              :hide-checkbox="!checkable"
              @click="onRowClick(item)"
              @dblclick="onRowDoubleClick(item)"
            >
              <template
                v-if="checkable"
                #checkbox
              >
                <slot
                  name="cell(CHECKBOX)"
                  :item="item"
                >
                  <FormCheckbox />
                </slot>
              </template>
              <template v-if="columns.length > 0">
                <TableCell
                  v-for="(column, columnIndex) in columns"
                  v-show="column.display === 'Y'"
                  :key="columnIndex"
                >
                  <slot
                    :name="`cell(${column?.dataFieldName ?? ''})`"
                    :value="item[column.dataFieldName]"
                    :item="item"
                    :index="itemIndex"
                  >
                    <span v-if="column.editMask">
                      {{ item[column.dataFieldName] ? getMaskedValue(decrypt(item[column.dataFieldName]), column.editMask) : '-' }}
                    </span>
                    <span v-else>
                      {{ item[column.dataFieldName] ? decrypt(item[column.dataFieldName]) : '-' }}
                    </span>
                  </slot>
                </TableCell>
              </template>
              <template v-else>
                <TableCell
                  v-for="(value, valueIndex) in Object.values(item)"
                  :key="valueIndex"
                >
                  <slot
                    :name="`cell(${Object.keys(item)[valueIndex]})`"
                    :value="value"
                    :item="item"
                  >
                    {{ value ? decrypt(value) : '-' }}
                  </slot>
                </TableCell>
              </template>
            </TableRow>
          </slot>
        </template>
      </TableBody>

      <TableBody v-if="columns.length > 0 && items.length === 0">
        <TableRow
          hide-checkbox
        >
          <TableCell
            :colspan="columns.filter((column) => column.display === 'Y').length"
            class="text-center"
          >
            <slot name="noData">
              {{ noDataText }}
            </slot>
          </TableCell>
        </TableRow>
      </TableBody>

      <slot />
    </table>
  </div>
</template>

<style scoped>

</style>
