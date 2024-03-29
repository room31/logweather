const { JSDOM } = require('jsdom');

module.exports = {
	id: 6,
	name: 'YRNO',
	url: 'https://www.yr.no',
	opts: {},
	parseFunc: function(page) {
		const { document } = new JSDOM(page).window

		const dayToday = new Date().getDate()

		const temps = Array.from(
			document.querySelectorAll('ol.daily-weather-list__intervals > li')
		).filter(li => li.querySelector('span.min-max-temperature') !== null)
		.map(li => {
			const temp = li
				.querySelector('span.min-max-temperature')
				.textContent
				.split('/')[0]
			
			const date = li
				.querySelector('time')
				.textContent

			return {
				date: parseInt(date, 10),
				temp: parseInt(temp, 10)
			}
		}).filter(day => day.date !== dayToday)
			.map(day => day.temp)
			
		// temps.unshift(currentTemp)
		return temps
	}
};
