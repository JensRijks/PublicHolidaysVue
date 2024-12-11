<script lang="ts" setup>
import type { DropdownCountry, PublicHoliday } from '@/types/publicHoliday'
import { ref, computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import HolidayModal from './HolidayModal.vue'

const props = defineProps<{
  publicHolidays: PublicHoliday[] | null
  selectedCountry: DropdownCountry | null
  year: number
}>()

const sortColumn = ref('date')
const sortOrder = ref('asc')
const isModalOpen = ref(false)
const selectedHoliday = ref<PublicHoliday | null>(null)

const sortedPublicHolidays = computed(() => {
  return [...(props.publicHolidays || [])]
    .sort((a, b) => {
      let comparison = 0
      if (sortColumn.value === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortColumn.value === 'day') {
        const dayA = new Date(a.date).toLocaleString('en-US', { weekday: 'long' })
        const dayB = new Date(b.date).toLocaleString('en-US', { weekday: 'long' })
        comparison = dayA.localeCompare(dayB)
      } else if (sortColumn.value === 'holiday') {
        comparison = a.name.localeCompare(b.name)
      }
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
    .reduce((acc: PublicHoliday[], holiday) => {
      const exists = acc.some(
        (h) =>
          new Date(h.date).toLocaleDateString() === new Date(holiday.date).toLocaleDateString(),
      )
      if (!exists) acc.push(holiday)
      return acc
    }, [])
})

// Methods
const handleSort = (column: 'date' | 'day' | 'holiday') => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc'
  }
}

const handleOpenModal = (holiday: PublicHoliday) => {
  selectedHoliday.value = holiday
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
  selectedHoliday.value = null
}

const getDayOfWeek = (date: string) => {
  return new Date(date).toLocaleString('en-US', { weekday: 'long' })
}

const sortArrow = computed(() => (sortOrder.value === 'asc' ? '&#9650;' : '&#9660;'))
</script>

<template>
  <div
    v-if="props.publicHolidays && props.publicHolidays.length > 0"
    class="mt-2 bg-white p-2 rounded-md w-full"
  >
    <HolidayModal
      :isModalOpen="isModalOpen"
      :selectedHoliday="selectedHoliday"
      @handleCloseModal="handleCloseModal"
    />

    <div class="flex flex-row text-stone-600 text-base sm:text-xl">
      <p
        @click="handleSort('date')"
        class="font-semibold w-40 sm:w-48 pl-2 cursor-pointer flex items-center"
      >
        DATE
        <span v-if="sortColumn === 'date'" class="ml-2 text-sm" v-html="sortArrow"></span>
      </p>
      <p
        @click="handleSort('day')"
        class="hidden sm:block sm:w-44 font-semibold pl-3 cursor-pointer items-center"
      >
        DAY
        <span v-if="sortColumn === 'day'" class="ml-2 text-sm" v-html="sortArrow"></span>
      </p>
      <p
        @click="handleSort('holiday')"
        class="w-full font-semibold pl-4 cursor-pointer flex items-center"
      >
        HOLIDAY
        <span v-if="sortColumn === 'holiday'" class="ml-2 text-sm" v-html="sortArrow"></span>
      </p>
    </div>

    <div class="flex flex-col gap-1">
      <div
        v-for="(holiday, index) in sortedPublicHolidays"
        :key="holiday.date + '-' + index"
        class="p-2 rounded-md cursor-pointer"
        :style="{
          backgroundColor: index % 2 === 0 ? 'rgba(42, 156, 255, 0.3)' : 'rgba(42, 156, 255, 0.1)',
        }"
        @click="handleOpenModal(holiday)"
      >
        <div class="text-stone-700 font-medium flex flex-row gap-3 text-base sm:text-lg">
          <p class="w-40 sm:w-48">{{ holiday.date }}</p>
          <p class="hidden sm:block sm:w-44">{{ getDayOfWeek(holiday.date) }}</p>
          <div class="flex flex-row w-full items-center">
            <p class="w-full">{{ holiday.name }}</p>
            <span>&#x2726;</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else-if="props.selectedCountry && props.publicHolidays && props.publicHolidays.length === 0"
    class="mt-2 bg-white p-4 rounded-md w-full"
  >
    <p class="text-stone-600 text-xl">
      No holidays found for <span class="font-bold">{{ props.selectedCountry.name }}</span> in the
      year <span class="font-bold">{{ year }}</span> AC
    </p>
  </div>

  <div v-else-if="selectedCountry" class="h-[50vh] flex items-center justify-center">
    <LoadingSpinner :size="30" />
  </div>
</template>
