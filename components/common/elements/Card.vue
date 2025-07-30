<script setup>
import { computed } from 'vue'
import { useElementSize } from '@vueuse/core'
defineProps({
  shadowSize: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'default'
  },
  cardHeaderClass: {
    type: String,
    default: 'p-3'
  },
  cardBodyClass: {
    type: String,
    default: 'p-3'
  },
  cardFooterClass: {
    type: String,
    default: 'p-3'
  },
  divider: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['cardBodyHeight'])
const cardBody = ref(null)
const { height } = useElementSize(cardBody)

const cardColorVariants = computed(() => ({
  'default': 'bg-white text-gray-700',
  'primary': 'bg-indigo-600 text-white',
  'success': 'bg-green-600 text-white',
  'danger': 'bg-red-600 text-white',
  'warning': 'bg-yellow-600 text-white',
  'info': 'bg-blue-600 text-white'
}));

const shadowSizeClasses = computed(() => ({
  'default': 'isac-shadow',
  'xs': 'shadow-xs',
  'sm': 'shadow-sm',
  'md': 'shadow-md',
  'lg': 'shadow-lg',
  'xl': 'shadow-xl',
  '2xl': 'shadow-2xl',
  'none': 'shadow-none'
}));

onMounted(() => {
  emits('cardBodyHeight', height.value)
})
</script>

<template>
  <div
    :class="[
      'rounded',
      cardColorVariants[variant],
      shadowSizeClasses[shadowSize],
      {
        'divide-y divide-gray-200': divider
      }
    ]"
  >
    <div
      v-if="$slots.header"
      :class="cardHeaderClass"
    >
      <slot name="header" />
    </div>
    <div
      ref="cardBody"
      :class="cardBodyClass"
    >
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      :class="cardFooterClass"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>

</style>
