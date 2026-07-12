<template>
  <n-card
    title="Real-time Data Stream"
    size="large"
    style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); width: 100%; max-width: 1000px; margin: 0 auto;"
  >
    <template #header-extra>
      <n-tag type="default" round style="margin-right: 20px">
        {{ lastUpdated }}
      </n-tag>
      <n-tag :type="statusColor" round>
        {{ connectionStatus }}
      </n-tag>
    </template>

    <div style="margin-top: 20px; min-height: 350px;">

      <div v-if="arr.length === 0" style="height: 350px; display: flex; justify-content: center; align-items: center;">
        <n-spin 
          size="large" 
          :description="connectionStatus === 'Connected' ? 'Waiting for first data points (up to 10s)...' : 'Server disconnected. Waiting for connection...'" 
        />
      </div>

      <apexchart
        v-else
        width="100%"
        height="350"
        type="line"
        :options="chartOptions"
        :series="chartSeries"
      />

    </div>
  </n-card>
</template>

<script setup>
  import {
    ref, computed, onMounted, onUnmounted,
  } from 'vue';
  import { NCard, NSpin, NTag } from 'naive-ui';
  import apexchart from 'vue3-apexcharts';

  const WS_URL = import.meta.env?.VITE_WS_URL || 'ws://127.0.0.1:3000';
  const API_URL = import.meta.env?.VITE_API_URL || 'http://127.0.0.1:3000/history';

  const ws = ref(null);
  const connectionStatus = ref('Waiting for connection...');
  const arr = ref([]);

  const statusColor = computed(() => {
    if (connectionStatus.value === 'Connected') return 'success';
    if (connectionStatus.value === 'Error') return 'error';
    if (connectionStatus.value === 'Disconnected') return 'warning';
    return 'default';
  });

  const lastUpdated = computed(() => {
    if (arr.value.length < 1) {
      return 'Nav datu';
    }
    return new Date(arr.value[arr.value.length - 1].time).toLocaleTimeString();
  });

  const chartOptions = ref({
    chart: {
      id: 'randomnum-chart',
      animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } },
      toolbar: { show: true },
    },
    colors: ['#075598'],
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'dd MMM HH:mm:ss',
        style: { fontSize: '12px' },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
    },
    tooltip: {
      x: {
        format: 'dd MMM HH:mm:ss',
      },
    },
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 5, colors: ['#8bc63e'] },
  });
  
  // Transform incoming data for ApexCharts.
  const chartSeries = computed(() => {
    const transformedArray = arr.value.map((elements) => ({
      x: new Date(elements.time).getTime(),
      y: elements.previousNumber,
    }));
    return [{ name: 'Value', data: transformedArray }];
  });

  const updateChartTimeline = (latestTime) => {
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        min: latestTime - 150000,
        max: latestTime,
      },
    };
  };

  onMounted(() => {
    let isHistoryLoaded = false;

    const connectWebSocket = () => {
      ws.value = new WebSocket(WS_URL);

      ws.value.onopen = async () => {
        connectionStatus.value = 'Connected';
        if (isHistoryLoaded === false) {
          try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.length > 0) {
              arr.value = data;
              isHistoryLoaded = true;
              const latestTime = new Date(data[data.length - 1].time).getTime();
              updateChartTimeline(latestTime);
            }
          } catch (Error) {
            // eslint-disable-next-line no-console
            console.warn('No history found, server might be down');
          }
        }
      };

      ws.value.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newArray = [...arr.value, data];

        if (newArray.length > 15) {
          arr.value = newArray.slice(1);
        } else {
          arr.value = newArray;
        }

        const latestTime = new Date(data.time).getTime();
        updateChartTimeline(latestTime);
      };

      ws.value.onerror = () => {
        connectionStatus.value = 'Error';
      };

      ws.value.onclose = () => {
        connectionStatus.value = 'Disconnected';
        setTimeout(connectWebSocket, 3000);
      };
    };
    connectWebSocket();
  });

  onUnmounted(() => {
    if (ws.value) {
      ws.value.close();
    }
  });
</script>