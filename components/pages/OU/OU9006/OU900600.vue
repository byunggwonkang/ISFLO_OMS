<script setup>
import { Chart as ChartJS, ArcElement, BarElement  } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

const chartData = {
  datasets: [
    {
      backgroundColor: ['#41B883'],
      data: [40],
      borderWidth: 1,
      cutout: '90%',
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
}

ChartJS.register(ArcElement, BarElement)
</script>

<template>
  <AppContent
    divider
  >
    <template #filters>
      <div class="grid grid-cols-4 gap-x-2 items-center">
        <FormGroup
          label="View Type"
          horizontal
        >
          <FormCombobox />
        </FormGroup>

        <div class="space-x-1">
          <Button
            rounded
            size="sm"
            variant="gray"
          >
            Today
          </Button>

          <Button
            rounded
            size="sm"
            variant="white"
            border
          >
            This Week
          </Button>

          <Button
            rounded
            size="sm"
            variant="white"
            border
          >
            This Month
          </Button>

          <Button
            rounded
            size="sm"
            variant="white"
            border
          >
            This Year
          </Button>
        </div>

        <FormGroup
          horizontal
          label="Date"
        >
          <div class="grid grid-cols-2 gap-x-2">
            <FormDatePicker />
            <FormDatePicker />
          </div>
        </FormGroup>

        <div class="inline-flex items-center justify-between">
          <Button
            rounded
            size="sm"
            variant="gray"
          >
            Search
          </Button>

          <Button
            rounded
            size="sm"
            variant="gray"
          >
            Details
          </Button>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-4 gap-x-3 mt-3">
      <StaticticsCard
        label="Total Order"
        value="10,000"
      />

      <StaticticsCard
        label="Released"
        value="10,000"
        variant="primary"
      >
        <template #chart>
          <Doughnut
            :data="chartData"
            :options="chartOptions"
          />
        </template>
      </StaticticsCard>

      <StaticticsCard
        label="Canceled"
        value="10,000"
        variant="danger"
      >
        <template #chart>
          <Doughnut
            :data="chartData"
            :options="chartOptions"
          />
        </template>
      </StaticticsCard>

      <StaticticsCard
        label="Delivered"
        value="10,000"
        variant="success"
      >
        <template #chart>
          <Doughnut
            :data="chartData"
            :options="chartOptions"
          />
        </template>
      </StaticticsCard>
    </div>

    <div class="grid grid-cols-8 gap-x-3 mt-3">
      <div class="space-y-3 col-span-5">
        <Card
          card-header-class="border-b p-3"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">
                Fullfillment Status
              </h3>
            </div>
          </template>

          <div class="grid grid-cols-3 space-x-12 px-6 py-2">
            <div>
              <Doughnut
                :data="{
                  datasets: [
                    {
                      backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                      data: [10, 15, 80],
                      borderWidth: 1,
                      cutout: '60%',
                    }
                  ]
                }"
                :options="chartOptions"
              />
            </div>
            <div class="col-span-2 flex flex-col justify-between">
              <div class="inline-flex items-center space-x-6">
                <p class="text-blue-700 text-3xl font-extrabold">
                  Released Order Total
                </p>
                <div class="text-3xl font-extrabold relative">
                  8,456

                  <div class="absolute top-0 right-0 left-24 bg-indigo-800 text-white text-sm w-fit rounded-2xl px-2">
                    99.2%
                  </div>
                </div>
              </div>

              <div class="divide-y">
                <div class="flex items-center py-3">
                  <div class="w-full flex items-center gap-x-3">
                    <div class="w-4 h-4 bg-indigo-800 rounded" />
                    Hello
                  </div>
                  <div class="w-32 text-end">
                    8,425
                  </div>
                  <div class="w-44 text-end">
                    100%
                  </div>
                </div>

                <div class="flex items-center py-3">
                  <div class="w-full flex items-center gap-x-3">
                    <div class="w-4 h-4 bg-indigo-800 rounded" />
                    Hello
                  </div>
                  <div class="w-32 text-end">
                    8,425
                  </div>
                  <div class="w-44 text-end">
                    100%
                  </div>
                </div>

                <div class="flex items-center py-3">
                  <div class="w-full flex items-center gap-x-3">
                    <div class="w-4 h-4 bg-indigo-800 rounded" />
                    Hello
                  </div>
                  <div class="w-32 text-end">
                    8,425
                  </div>
                  <div class="w-44 text-end">
                    100%
                  </div>
                </div>

                <div class="flex items-center py-3">
                  <div class="w-full flex items-center gap-x-3 font-extrabold">
                    <div class="w-4 h-4 bg-white rounded" />
                    SUM
                  </div>
                  <div class="w-32 text-end font-extrabold">
                    8,425
                  </div>
                  <div class="w-44 text-end font-extrabold">
                    100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card card-header-class="border-b p-3">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">
                Cancellation Proportion
              </h3>
            </div>
          </template>

          <div class="grid grid-cols-3 space-x-12 px-6 py-2">
            <div>
              <Doughnut
                :data="{
                  datasets: [
                    {
                      backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                      data: [10, 15, 80],
                      borderWidth: 1,
                      cutout: '60%',
                    }
                  ]
                }"
                :options="chartOptions"
              />
            </div>
            <div class="col-span-2 flex flex-col justify-between">
              <div class="inline-flex items-center space-x-6">
                <p class="text-red-600 text-3xl font-extrabold">
                  Canceled Order Total
                </p>
                <div class="text-3xl font-extrabold relative">
                  8,456

                  <div class="absolute top-0 right-0 left-24 bg-indigo-800 text-white text-sm w-fit rounded-2xl px-2">
                    99.2%
                  </div>
                </div>
              </div>

              <div class="divide-y">
                <div class="flex items-center py-3">
                  <div class="w-full flex items-center gap-x-3">
                    <div class="w-4 h-4 bg-indigo-800 rounded" />
                    Hello
                  </div>
                  <div class="w-32 text-end">
                    8,425
                  </div>
                  <div class="w-44 text-end">
                    100%
                  </div>
                </div>

                <div class="flex items-center py-3">
                  <div class="w-full flex items-center gap-x-3">
                    <div class="w-4 h-4 bg-indigo-800 rounded" />
                    Hello
                  </div>
                  <div class="w-32 text-end">
                    8,425
                  </div>
                  <div class="w-44 text-end">
                    100%
                  </div>
                </div>

                <div class="flex items-center py-3">
                  <div class="w-full flex items-center gap-x-3">
                    <div class="w-4 h-4 bg-indigo-800 rounded" />
                    Hello
                  </div>
                  <div class="w-32 text-end">
                    8,425
                  </div>
                  <div class="w-44 text-end">
                    100%
                  </div>
                </div>

                <div class="flex items-center py-3">
                  <div class="w-full flex items-center gap-x-3 font-extrabold">
                    <div class="w-4 h-4 bg-white rounded" />
                    SUM
                  </div>
                  <div class="w-32 text-end font-extrabold">
                    8,425
                  </div>
                  <div class="w-44 text-end font-extrabold">
                    100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div class="col-span-3">
        <Card
          class="h-full"
          card-header-class="border-b p-3"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">
                Cancellation Proportion
              </h3>
            </div>
          </template>

          <div class="px-3 py-2">
            <div class="flex-col space-y-10">
              <div class="space-y-10">
                <div class="inline-flex items-center space-x-6">
                  <p class="text-green-600 text-3xl font-extrabold">
                    Delivered within one day
                  </p>
                  <div class="text-3xl font-extrabold relative">
                    8,456

                    <div class="absolute top-0 right-0 left-24 bg-indigo-800 text-white text-sm w-fit rounded-2xl px-2">
                      99.2%
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-5 gap-x-3">
                  <div class="text-center space-y-3">
                    <p>Day +1</p>
                    <Doughnut
                      :data="{
                        datasets: [
                          {
                            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                            data: [10, 15, 80],
                            borderWidth: 1,
                            cutout: '60%',
                          }
                        ]
                      }"
                      :options="chartOptions"
                    />
                  </div>
                  <div class="text-center space-y-3">
                    <p>Day +1</p>
                    <Doughnut
                      :data="{
                        datasets: [
                          {
                            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                            data: [10, 15, 80],
                            borderWidth: 1,
                            cutout: '60%',
                          }
                        ]
                      }"
                      :options="chartOptions"
                    />
                  </div>
                  <div class="text-center space-y-3">
                    <p>Day +1</p>
                    <Doughnut
                      :data="{
                        datasets: [
                          {
                            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                            data: [10, 15, 80],
                            borderWidth: 1,
                            cutout: '60%',
                          }
                        ]
                      }"
                      :options="chartOptions"
                    />
                  </div>
                  <div class="text-center space-y-3">
                    <p>Day +1</p>
                    <Doughnut
                      :data="{
                        datasets: [
                          {
                            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                            data: [10, 15, 80],
                            borderWidth: 1,
                            cutout: '60%',
                          }
                        ]
                      }"
                      :options="chartOptions"
                    />
                  </div>
                  <div class="text-center space-y-3">
                    <p>Day +1</p>
                    <Doughnut
                      :data="{
                        datasets: [
                          {
                            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                            data: [10, 15, 80],
                            borderWidth: 1,
                            cutout: '60%',
                          }
                        ]
                      }"
                      :options="chartOptions"
                    />
                  </div>
                </div>

                <div class="divide-y">
                  <div class="flex items-center py-3">
                    <div class="w-full flex items-center gap-x-3">
                      <div class="w-4 h-4 bg-indigo-800 rounded" />
                      Hello
                    </div>
                    <div class="w-32 text-end">
                      8,425
                    </div>
                    <div class="w-44 text-end">
                      100%
                    </div>
                  </div>

                  <div class="flex items-center py-3">
                    <div class="w-full flex items-center gap-x-3">
                      <div class="w-4 h-4 bg-indigo-800 rounded" />
                      Hello
                    </div>
                    <div class="w-32 text-end">
                      8,425
                    </div>
                    <div class="w-44 text-end">
                      100%
                    </div>
                  </div>

                  <div class="flex items-center py-3">
                    <div class="w-full flex items-center gap-x-3">
                      <div class="w-4 h-4 bg-indigo-800 rounded" />
                      Hello
                    </div>
                    <div class="w-32 text-end">
                      8,425
                    </div>
                    <div class="w-44 text-end">
                      100%
                    </div>
                  </div>

                  <div class="flex items-center py-3">
                    <div class="w-full flex items-center gap-x-3">
                      <div class="w-4 h-4 bg-indigo-800 rounded" />
                      Hello
                    </div>
                    <div class="w-32 text-end">
                      8,425
                    </div>
                    <div class="w-44 text-end">
                      100%
                    </div>
                  </div>

                  <div class="flex items-center py-3">
                    <div class="w-full flex items-center gap-x-3">
                      <div class="w-4 h-4 bg-indigo-800 rounded" />
                      Hello
                    </div>
                    <div class="w-32 text-end">
                      8,425
                    </div>
                    <div class="w-44 text-end">
                      100%
                    </div>
                  </div>

                  <div class="flex items-center py-3">
                    <div class="w-full flex items-center gap-x-3 font-extrabold">
                      <div class="w-4 h-4 bg-white rounded" />
                      SUM
                    </div>
                    <div class="w-32 text-end font-extrabold">
                      8,425
                    </div>
                    <div class="w-44 text-end font-extrabold">
                      100%
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-x-3">
                <StaticticsCard
                  label="Total Order"
                  value="10,000"
                />

                <StaticticsCard
                  label="Total Order"
                  value="10,000"
                />

                <StaticticsCard
                  label="Total Order"
                  value="10,000"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <div class="mt-3">
      <Card
        card-header-class="border-b border-dashed p-3"
      >
        <template #header>
          <h3 class="text-lg font-semibold">
            Fullfillment Staticstics
          </h3>
          <div class="flex items-center space-x-12">
            <p class="text-3xl font-semibold">
              100% Order Fullfilled
            </p>

            <div class="inline-flex gap-x-3">
              <p class="text-sm text-green-400">
                +2.1%
              </p>
              <p class="text-sm">
                vs Yesterday
              </p>
            </div>

            <p class="text-sm">
              Order From Today 01:00 AM ~ 12:59 PM
            </p>

            <div class="flex space-x-6">
              <div class="flex items-center space-x-3 text-sm">
                <div class="w-3 h-3 rounded-full bg-indigo-800 mr-2" />
                Order
              </div>
              <div class="flex items-center space-x-3 text-sm">
                <div class="w-3 h-3 rounded-full bg-gray-200 mr-2" />
                Delivered
              </div>
            </div>
          </div>
        </template>

        <BarChart
          aria-describedby="my-data-table"
          :data="{
            labels: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
            datasets: [
              {
                label: 'Order',
                backgroundColor: 'rgb(55 48 163)',
                data: [10, 20, 12, 22, 23, 23, 10, 20, 12, 22, 23, 23, 10, 20, 12, 22, 23, 23, 10, 20, 12, 22, 23, 23]
              },
              {
                label: 'Delivered',
                backgroundColor: 'rgb(229 231 235)',
                data: [10, 20, 12, 22, 23, 23, 10, 20, 12, 22, 23, 23, 10, 20, 12, 22, 23, 23, 10, 20, 12, 22, 23, 23]
              }
            ],
          }"
          :options="{
            barThickness: 8
          }"
        />
      </Card>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
