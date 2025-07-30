<script setup>
const countriesAndCurrencies = [
  {
    title: 'Korea',
    code: 'KR',
    currency: 'KRW',
    use: true,
    main: true
  },
  {
    title: 'America',
    code: 'US',
    currency: 'USD',
    use: false,
    main: false
  },
  {
    title: 'China',
    code: 'CN',
    currency: 'CNY',
    use: true,
    main: false
  }
]
</script>

<template>
  <AppContent
    title="Locale Setting"
    description="Manage Currency, Language, and Countries"
  >
    <div class="grid grid-cols-1 gap-24 sm:grid-cols-6">
      <div class="col-span-3">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Country
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell text-center"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell text-center"
                  >
                    Use
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell text-right"
                  >
                    Main
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(country, countryIdx) in countriesAndCurrencies"
                  :key="country.code"
                >
                  <td :class="[countryIdx !== countriesAndCurrencies.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell']">
                    {{ country.title }}
                  </td>
                  <td :class="[countryIdx !== countriesAndCurrencies.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-center']">
                    {{ country.code }}
                  </td>
                  <td :class="[countryIdx !== countriesAndCurrencies.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-center']">
                    <span
                      :class="[country.used ? 'bg-green-700' : 'bg-red-500', 'w-3 h-3 self-end rounded-full inline-block']"
                    />
                  </td>
                  <td :class="[countryIdx !== countriesAndCurrencies.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-right']">
                    <span
                      :class="[country.main ? 'bg-green-700' : 'bg-red-500', 'w-3 h-3 self-end rounded-full inline-block']"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="mt-5 flex items-center justify-end">
          <button
            class="w-40 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>

      <div class="col-span-3">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Country
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell text-center"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell text-center"
                  >
                    Use
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell text-right"
                  >
                    Main
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(country, countryIdx) in countriesAndCurrencies"
                  :key="country.code"
                >
                  <td :class="[countryIdx !== countriesAndCurrencies.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell']">
                    {{ country.title }}
                  </td>
                  <td :class="[countryIdx !== countriesAndCurrencies.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-center']">
                    {{ country.currency }}
                  </td>
                  <td :class="[countryIdx !== countriesAndCurrencies.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-center']">
                    <span
                      :class="[country.used ? 'bg-green-700' : 'bg-red-500', 'w-3 h-3 self-end rounded-full inline-block']"
                    />
                  </td>
                  <td :class="[countryIdx !== countriesAndCurrencies.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-right']">
                    <span
                      :class="[country.main ? 'bg-green-700' : 'bg-red-500', 'w-3 h-3 self-end rounded-full inline-block']"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="mt-5 flex items-center justify-end">
          <button
            class="w-40 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
