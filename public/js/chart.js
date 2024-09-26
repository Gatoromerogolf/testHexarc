
const ctx = document.getElementById('myChart').getContext('2d');

// Crear rectángulos de fondo para los rangos de efectividad
function drawBackground(ctx, chartArea) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';

    // Rango inefectivo
    // ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    ctx.fillStyle = 'red';
    ctx.fillStyle = 'rgba(255, 87, 51, 0.5)';
    ctx.fillRect(chartArea.left, chartArea.top, (chartArea.width * 50) / 100, chartArea.height);

    // Rango poco efectivo
    ctx.fillStyle = 'orange';
    ctx.fillStyle = 'rgba(255, 197, 51, 0.5)';
    ctx.fillRect(chartArea.left + (chartArea.width * 50) / 100, chartArea.top, (chartArea.width * 20) / 100, chartArea.height);

    // Rango efectivo
    // ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
    ctx.fillStyle = 'green';
    ctx.fillStyle = 'rgba(62, 229, 47, 0.5)';
    ctx.fillRect(chartArea.left + (chartArea.width * 70) / 100, chartArea.top, (chartArea.width * 20) / 100, chartArea.height);

    // Rango muy efectivo
    ctx.fillStyle = 'blue';
    ctx.fillStyle = 'rgba(47, 135, 229, 0.5)';
    ctx.fillRect(chartArea.left + (chartArea.width * 90) / 100, chartArea.top, (chartArea.width * 10) / 100, chartArea.height);

    ctx.restore();
}

const var1 = JSON.parse(localStorage.getItem('porciento-A'));
let var2 = JSON.parse(localStorage.getItem('porciento-B'));
let var3 = JSON.parse(localStorage.getItem('porciento-C')) || 3;
let var4 = JSON.parse(localStorage.getItem('porciento-D')) || 3;
const var5 = JSON.parse(localStorage.getItem('porciento-E')) || 3;
const var6 = JSON.parse(localStorage.getItem('porciento-F')) || 3;

const data = {
    labels: ['Gobierno Corporativo', 'Apetito de Riesgo', 'Riesgos de Mercado', 'Riesgos de Procesos', 'Situación Financiera', 'Generación de Resultados'],
    datasets: [{
        label: 'Porcentaje de Cumplimiento',
        data: [var1, var2, var3, var4, var5, var6],
        backgroundColor: '#D3D3D3',
        barThickness: 25
    }]
};

const options = {
    indexAxis: 'y',
    scales: {
        x: {
            beginAtZero: true,
            max: 100,
            title: {
                display: true,
                text: 'Porcentaje de Cumplimiento'
            },
            ticks: {
                callback: function(value) {
                    return value + '%';
                },
                color: 'black'
            },
            grid: {
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.1)'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Factores'
            },
            ticks: {
                color: 'black'
            },
            barThickness: 20 // ajusta alto de barra            
        }
    },
plugins: {
    legend: {
        display: true,
        labels: {
            generateLabels: function(chart) {
                return [
                    {
                        text: 'Inefectivo',
                        fillStyle: 'rgba(255, 87, 51, 0.5)',
                        strokeStyle: 'rgba(255, 87, 51)',
                        lineWidth: 1
                    },
                    {
                        text: 'Poco efectivo',
                        fillStyle: 'rgba(255, 197, 51, 0.5)',
                        strokeStyle: 'rgba(255, 197, 51, 0.5)',
                        lineWidth: 1
                    },
                    {
                        text: 'Efectivo',
                        fillStyle: 'rgba(62, 229, 47, 0.5)',
                        strokeStyle: 'rgba(62, 229, 47, 0.5)',
                        lineWidth: 1
                    },
                    {
                        text: 'Muy efectivo',
                        fillStyle: 'rgba(47, 135, 229, 0.5)',
                        strokeStyle: 'rgba(47, 135, 229, 0.5)',
                        lineWidth: 1
                    }
                ];
            }
        }
    },
        title: {
            display: true,
            // text: 'Cumplimiento por Factor',
            font: {
                size: 18
            }
        },
        datalabels: {
            color: 'black',
            font: {
                weight: 'bold'
            },
            align: 'end', // Cambiar 'center' a 'end'
            anchor: 'end', // Cambiar 'center' a 'end'
            offset: -20, // Añadir un offset negativo para moverlo dentro de la barra
            formatter: function(value) {
            return value + '%';
            }
        }
    },
    layout: {
        padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    }
};

const myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options,
    plugins: [ChartDataLabels, {
        beforeDraw: (chart) => {
            drawBackground(chart.ctx, chart.chartArea);
        }
    }]
});
