const moment = require('moment');

module.exports = {

    /**
     * 
     * @param {{service: string, time: Date, temps: number[]}[]} data - Temperature data
     * @param {{firstDay: Date, lastDay: Date, hour: number, services: {name: string, depth: number}[]}} tempRequest - request for getting chart data
     * @returns {{labels: Date[], points: {service: string, depth: number, temps: number[]}[]}}
     * 
     */

    calculatePoints: function (data, tempRequest) {
        const labels = getDaySequence(tempRequest.firstDay, tempRequest.lastDay)
        const points = tempRequest.services.map((service) => {
            const req = {
                firstDay: moment(tempRequest.firstDay).subtract(service.depth, 'd'),
                lastDay: moment(tempRequest.lastDay).subtract(service.depth, 'd'),
                depth: service.depth
            }
            const tempData = extractData(data, service.name, req, tempRequest.hour)
            const tempPoints = countPoints(tempData, req)
            return {
                service: service.name,
                depth: service.depth,
                temps: tempPoints
            }
        })
        return {
            labels,
            points
        }
    }
}

/**
 * 
 * @param {{service: String, time: Date, temps: Number[]}[]} data - All data from CSV files
 * @param {String} service - forecast service name
 * @param {{firstDay: Date, lastDay: Date, depth: Number}} req 
 * @param {Number} hour 
 * 
 */

function extractData(data, service, req, hour) {
    return data
        .map(record => {
            record.time = moment(record.time)
            return record
        })
        .filter((record) => {
            return record.service === service
        })
        .filter((record) => {
            return record.time >= req.firstDay && record.time < req.lastDay.endOf('day')
        })
        .filter((record) => {
            return record.time.hours() === hour
        })
}

/**
 * 
 * @param {{service: string, time: moment, temps: number[]]}[]} data 
 * @param {{firstDay: Date, lastDay: Date, depth: number}} req
 * 
 */

function countPoints(data, req) {
    const dates = getDaySequence(req.firstDay, req.lastDay)
    return dates.map((date) => {
        return avgRound(
            data.filter((record) => {
                return moment(date).startOf('day').isSame(record.time.startOf('day'))
            })
            .map(record => record.temps[req.depth])
        )
    })
}

/**
 * 
 * @param {Date} firstDay 
 * @param {Date} lastDay 
 * @returns {Date[]} 
 * 
 */

function getDaySequence(firstDay, lastDay) {
    const dates = []
    for (let d = moment(firstDay); d.isSameOrBefore(moment(lastDay)); d.add(1, 'd')) {
        dates.push(new Date(d.toISOString()))
    }
    return dates
}

/**
 * Counts an average value of a number array and rounds it
 * @param {number[]} nums 
 * @returns {number}
 */

function avgRound(nums) {
    if (!nums.length) return NaN
    const a = nums.reduce((a, b) => (a + b)) / nums.length;
    return Math.round(a)
}
