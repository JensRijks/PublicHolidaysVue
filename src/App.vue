<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { type DropdownCountry, type PublicHoliday } from './types/publicHoliday'
import { getPublicHolidays, getAllAvailableCountries, getFlagUrl } from '@/api/usePublicHolidays'
import PublicHolidaysTable from './components/PublicHolidaysTable.vue'

const isOpen = ref(false)
const isOpenDelay = ref(false)
const selectedCountry = ref<DropdownCountry | null>(null)
const year = ref(2024)
const searchTerm = ref('')
const publicHolidays = ref<PublicHoliday[] | null>(null)
const countries = ref<DropdownCountry[]>([])

const dropdownRef = ref(null)

const filteredCountries = computed(() =>
  countries.value.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  ),
)

const fetchHolidays = async () => {
  if (year.value && selectedCountry.value) {
    try {
      publicHolidays.value = await getPublicHolidays(year.value, selectedCountry.value.countryCode)
    } catch (error) {
      console.error(error)
    }
  }
}

const handleOpen = () => {
  isOpen.value = true

  if (selectedCountry.value) {
    isOpenDelay.value = true
  }

  setTimeout(() => {
    isOpenDelay.value = true
  }, 200)
}

const handleClose = () => {
  isOpenDelay.value = false
  isOpen.value = false
}

const handleCountrySelect = (country: DropdownCountry) => {
  searchTerm.value = country.name
  handleClose()
  selectedCountry.value = country
}

// Function to handle input change
const handleInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  searchTerm.value = input.value
}

const handleYearChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  year.value = parseInt(input.value) ? parseInt(input.value) : 0
  console.log(year.value)
}

// Function to handle clearing search
const handleClearSearch = () => {
  searchTerm.value = ''
  selectedCountry.value = null
  year.value = 2024
  publicHolidays.value = null
  handleClose()
}

onMounted(async () => {
  try {
    countries.value = await getAllAvailableCountries()
  } catch (error) {
    console.error(error)
  }
})

watch([selectedCountry, year], async () => {
  if (selectedCountry.value) {
    await fetchHolidays()
  }
})
</script>

<template>
  <div
    class="w-full flex flex-col items-center p-4 pt-8 transition-all duration-300 ease-in-out"
    :style="{
      paddingTop: isOpen || selectedCountry ? '2rem' : '0',
      position: 'absolute',
      top: isOpen || selectedCountry ? '0' : '40%',
    }"
  >
    <div class="max-w-lg sm:max-w-xl md:max-w-2xl w-full">
      <h1
        class="font-black mb-4 text-white font-sans text-center"
        :class="{
          'text-lg sm:text-4xl md:text-5xl': isOpen || selectedCountry,
          'text-4xl sm:text-6xl md:text-7xl': !(isOpen || selectedCountry),
        }"
      >
        Discover
        <span style="color: rgb(42 156 255)"> Holidays </span>
        Around the World
      </h1>

      <div
        ref="dropdownRef"
        class="flex flex-row bg-white"
        :class="isOpen ? 'rounded-t-md' : 'rounded-md'"
        @focus="handleOpen"
      >
        <input
          type="number"
          class="rounded-l-md p-2 text-center sm:w-24 md:w-28 text-lg sm:text-2xl md:text-3xl bg-white text-black border-r-2 border-black w-16"
          placeholder="Year"
          :value="year"
          @focus="handleOpen"
          @input="handleYearChange"
        />

        <div class="relative w-full">
          <input
            type="text"
            class="p-2 sm:p-4 w-full text-xl sm:text-3xl md:text-4xl bg-white text-black cursor-pointer pr-10 rounded-r-md"
            placeholder="Select a country..."
            v-model="searchTerm"
            @focus="handleOpen"
            @input="handleInputChange"
          />

          <div v-if="searchTerm">
            <img
              class="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer w-7 mr-1 sm:w-10 md:w-10 lg:w-12 xl:w-12"
              src="./assets/trashEmpty.svg"
              alt="Empty trash icon"
              width="22"
              height="22"
              @click="handleClearSearch"
            />
          </div>
        </div>
      </div>

      <div
        v-if="isOpenDelay"
        class="transition-all duration-300 ease-in-out font-semibold font-sans rounded-b-md bg-stone-700 text-white shadow-stone-500 shadow-sm"
      >
        <ul
          class="max-h-[70vh] overflow-auto py-1 px-2 text-lg sm:text-2xl flex flex-col gap-1 sm:gap-2"
        >
          <template v-if="searchTerm === ''">
            <li
              v-for="country in countries"
              :key="country.countryCode"
              class="p-2 hover:bg-secondary cursor-pointer flex flex-row gap-2 items-center"
              @click="handleCountrySelect(country)"
            >
              <img
                v-if="country.countryCode"
                :src="getFlagUrl(country.countryCode)"
                alt="Flag"
                class="w-6 h-6"
              />
              {{ country.name }}
            </li>
          </template>

          <template v-else>
            <li
              v-for="country in filteredCountries"
              :key="country.countryCode"
              class="p-2 hover:bg-secondary cursor-pointer flex flex-row gap-2 items-center"
              @click="handleCountrySelect(country)"
            >
              <img
                v-if="country.countryCode"
                :src="getFlagUrl(country.countryCode)"
                alt="Flag"
                class="w-6 h-6"
              />
              {{ country.name }}
            </li>

            <li v-if="filteredCountries.length === 0" class="p-2 text-gray-400">
              No countries found
            </li>
          </template>
        </ul>
      </div>

      <PublicHolidaysTable
        :publicHolidays="publicHolidays"
        :selectedCountry="selectedCountry"
        :year="year"
      />
    </div>
  </div>
</template>
