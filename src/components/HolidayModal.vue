<script lang="ts" setup>
import { defineProps } from 'vue'
import { getFlagUrl } from '@/api/usePublicHolidays'
import type { PublicHoliday } from '@/types/publicHoliday'

defineProps({
  isModalOpen: Boolean,
  selectedHoliday: Object as () => PublicHoliday | null,
  handleCloseModal: Function as () => void,
})
</script>

<template>
  <div
    v-if="isModalOpen && selectedHoliday"
    class="bg-black bg-opacity-40 fixed w-full h-full top-0 left-0 flex items-center justify-center z-50"
    @click="$emit('handleCloseModal')"
  >
    <div class="bg-white p-6 rounded-md w-11/12 sm:w-96 relative pr-10" @click.stop>
      <button class="absolute top-4 right-4 text-xl font-bold" @click="$emit('handleCloseModal')">
        X
        <img
          v-if="selectedHoliday.countryCode"
          :src="getFlagUrl(selectedHoliday.countryCode)"
          alt="Flag"
          class="w-6 h-6"
        />
      </button>
      <h2 class="text-3xl font-bold">{{ selectedHoliday.name }}</h2>

      <div v-if="selectedHoliday.localName && selectedHoliday.name !== selectedHoliday.localName">
        <span>Or, the local name:</span>
        <p class="font-bold">{{ selectedHoliday.localName }}</p>
      </div>

      <div class="mt-4">
        <p><strong>Date:</strong> {{ selectedHoliday.date }}</p>
        <p><strong>Country Code:</strong> {{ selectedHoliday.countryCode }}</p>

        <div v-if="selectedHoliday.counties">
          <p><strong>Counties:</strong> {{ selectedHoliday.counties }}</p>
        </div>

        <div v-if="selectedHoliday.launchYear">
          <p><strong>Launch Year:</strong> {{ selectedHoliday.launchYear }}</p>
        </div>

        <p>
          <strong>Holiday Type:</strong>
          {{ selectedHoliday.types ? selectedHoliday.types.join(', ') : 'N/A' }}
        </p>
      </div>
    </div>
  </div>
</template>
