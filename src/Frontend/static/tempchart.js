const firstDayInput = document.getElementById('firstDay')
const lastDayInput = document.getElementById('lastDay')
const form = document.getElementById('serviceDepth')
const addChartButton = document.getElementById('addChart')

let chartAdded = false

let tempRequest = {
    firstDay: null,
    lastDay: null,
    hour: 14,
    services: []
}

firstDayInput.oninput = function() {
    if (chartAdded) {
        updChartDates()
    }
}

lastDayInput.oninput = firstDayInput.oninput

addChartButton.onclick = function() {
    const service = document.getElementById('serviceSelect').value
    const depth = parseInt(document.getElementById('depth').value, 10)
    tempRequest.services.push({name: service, depth: depth})    
    chartAdded = true
    updChartDates()
}

function getChartData(tempRequest, cb) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', '/getchartdata')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json'

    const body = JSON.stringify(tempRequest)

    xhr.send(body)
    xhr.onload = function() {
        cb(null, xhr.response)
    }

    xhr.onerror = function() {
        cb('XHR error')
    }
}

function updChartDates() {
    const firstDay = firstDayInput.value || new Date('2020-03-30')
    const lastDay = lastDayInput.value || new Date

    firstDayInput.value = moment(firstDay).format('YYYY-MM-DD')
    lastDayInput.value = moment(lastDay).format('YYYY-MM-DD')

    tempRequest.firstDay = firstDay
    tempRequest.lastDay = lastDay

    if (chartAdded) {
        updateChart()
    }
}

function updateChart() {
    getChartData(tempRequest, (err, res) => {
        if (err) {
            alert(err)
            return
        }
        //console.log(JSON.stringify(res))
        renderChart(myChart, res)
    })
}

function renderChart(chart, chartData) {
    config.data.labels = chartData.labels.map(date => moment(date))
    config.data.datasets = chartData.points.map((chart) => {
        return {
            label: `${chart.service} - ${chart.depth}`,
            data: chart.temps,
            borderColor: chartColor[chart.service],
            borderWidth: 2
        }
    })
    chart.update()
}
 
const chartColor = {
    STREET: 'red',
    YANDEX: 'yellow',
    GISMETEO: 'purple',
    YRNO: 'cyan',
    ACCUWEATHER: 'orange',
    RP5: 'blue',
    WEATHERCOM: 'brown'
}

const timeFormat = 'DD/MM/YYYY';
function newDateString(days) {
    return moment('2020-04-06').add(days, 'd').format(timeFormat);
}

const dataLabels = [
    newDateString(0),
    newDateString(1),
    newDateString(2),
    newDateString(3),
    newDateString(4),
    newDateString(5),
    newDateString(6),
]

const streetPoints = [4, 8, 12, 15, 8, 5, 6]
const yandexPoints = [8, 11, 10, 14, 8, 3, 6]
const gismeteoPoints = [10, 7, 9, 14, 9, 3 ,5]
const yrnoPoints = [1, 7, 7, 8, 3, 1, 4]
const accuweatherPoints = [8, 14, 10, 14, 10, 5, 6]
const rp5Points = [NaN, NaN, NaN, NaN, 9, 4, 5]
const weathercomPoints = [8, 11, 11, 15, 9, 5, 7]

const config = {
    type: 'line',
    data: {
        labels: dataLabels,
        datasets: [{
            label: 'Measured',
            data: streetPoints,
            borderColor: 'red',
            backgroundColor: 'red',
            fill: false,
            borderWidth: 4
        }, {
            label: 'Yandex',
            data: yandexPoints,
            borderColor: 'yellow',
            borderWidth: 2
        }, {
            label: 'Gismeteo',
            data: gismeteoPoints,
            borderColor: 'purple',
            borderWidth: 2
        }, {
            label: 'Yr.no',
            data: yrnoPoints,
            borderColor: 'cyan',
            borderWidth: 2
        }, {
            label: 'Accuweather',
            data: accuweatherPoints,
            borderColor: 'orange',
            borderWidth: 2
        }, {
            label: 'RP5',
            data: rp5Points,
            borderColor: 'blue',
            borderWidth: 2
        }, {
            label: 'weather.com',
            data: weathercomPoints,
            borderColor: 'brown',
            borderWidth: 2
        }]
    },
    options: {
        layout: {
            padding: {
                top: 10,
                right: 25,
                left: 25
            }
        },
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 50,
                padding: 10,
                fontSize: 16
            }
        },
        responsive: true,
        title: {
            display: false,
            text: 'City: Opaliha',
            fontSize: 30
        },
        tooltips: {
            mode: 'index'
        },
        scales: {
            xAxes: [{

                type: 'time',
                distribution: 'series',
                time: {
                    parser: timeFormat,
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM D'
                    }
                },

                display: true,
                color: '#31a11d',
                scaleLabel: {
                    display: true,
                    labelString: 'Day',
                    fontSize: 24
                },
                gridLines: {
                    display: true,
                    color: '#31a11d',
                    zeroLineWidth: 3,
                },
                ticks: {
                    padding: 10
                }
            }],
            yAxes: [{
                display: true,
                
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature',
                    fontSize: 24
                },
                gridLines: {
                    display: true,
                    color: '#31a11d',
                    zeroLineWidth: 3,
                    zeroLineColor: '#31a11d',
                },                
                ticks: {
                    suggestedMin: -5,
                    suggestedMax: 30,
                    padding: 10
                }
            }],
        }
    }
}

const ctx = document.getElementById('myChart')
const myChart = new Chart(ctx, config)

Chart.defaults.global.defaultFontSize = 16
Chart.defaults.global.defaultFontFamily = 'Mina'
Chart.defaults.global.datasets.fill = false
Chart.defaults.global.datasets.cubicInterpolationMode = 'monotone'
Chart.defaults.global.datasets.backgroundColor = 'rgba(0, 0, 0, 0)'