const puppeteer = require('puppeteer');

module.exports = {
	nytScraper: async (section) => {
		try {
			const data = [];
			const browser = await puppeteer.launch({ 'args' : [
				'--no-sandbox',
				'--disable-setuid-sandbox'
			]});
			const page = await browser.newPage();
			page.setUserAgent(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
			);
			//await page.setViewport({ width: 1920, height: 1080 });
			await page.goto(`https://www.nytimes.com/section/${section}`);

			// await page.waitFor('#stream-panel ol > li', { timeout: 120000 });
			await page.waitForSelector('#stream-panel ol > li');

			const items = await page.$$('#stream-panel ol > li');
			for (let item of items) {
				let title = await item.$eval('h2', (title) => title.textContent.trim());
				let summary = await item.$eval('div > div > a > p', (summary) =>
					summary.textContent.trim(),
				);
				let author;
				try {
					author = await item.$eval(
						'div > div > a > div:last-child > p',
						(author) => author.textContent.trim(),
					);
				} catch (error) {
					author = 'An Unknown Author';
				}
				let articleURL = await item.$eval('a', (articleURL) =>
					articleURL.getAttribute('href').trim(),
				);
				let imageURL;
				try {
					imageURL = await item.$eval('img', (imageURL) =>
						imageURL.getAttribute('src').trim(),
					);
				} catch (error) {
					imageURL =
						'https://via.placeholder.com/205x137?text=No+Image+Available';
				}
				let publishedOnDate = await item.$eval('time', (publishedOnDate) =>
					publishedOnDate.textContent.trim(),
				);
				await data.push({
					title,
					summary,
					author: author.replace('By ', ''),
					articleURL,
					imageURL: imageURL.replace(
						'thumbWide.jpg?quality=75&auto=webp&disable=upscale',
						'mediumThreeByTwo210.jpg?quality=100&auto=webp',
					),
					publishedOnDate: new Date(publishedOnDate),
				});
			}
			await page.close();
			await browser.close();
			return data;
		} catch (error) {
			console.error('Scraping', error);
		}
	},
};
