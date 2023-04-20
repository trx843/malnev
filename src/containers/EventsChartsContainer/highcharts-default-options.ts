export const highchartsDefaultOptions = {
  chart: {
    height: '600',
  },

  title: {
    text: 'График изменения коэффициентов преобразования',
  },

  yAxis: {
    title: {
      text: 'Kj, имп/м3',
    },
  },

  xAxis: {
    accessibility: {},
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false,
      },
      pointStart: 2010,
    },
  },
  series: [],

  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 300,
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
          },
        },
      },
    ],
  },
};
