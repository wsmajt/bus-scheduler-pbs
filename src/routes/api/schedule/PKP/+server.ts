import type { RequestHandler } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

const pad = (num: number): string => num.toString().padStart(2, '0');

export const GET: RequestHandler = async () => {
	try {
		const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));

		const day = pad(now.getDate());
		const month = pad(now.getMonth() + 1);
		const year = now.getFullYear();
		const hours = pad(now.getHours());
		const minutes = pad(now.getMinutes());

		const dateParam = `${day}${month}${year}${hours}${minutes}`;
		const timeParam = `${hours}%3A${minutes}`;

		const url = `https://beta.bilkom.pl/stacje/tablica?nazwa=Bydgoszcz+Politechnika&stacja=5100641&data=${dateParam}&time=${timeParam}&przyjazd=false`;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});
		const html = await response.text();
		const $ = cheerio.load(html);

		const timetable: Array<{
			carrier: string;
			number: string;
			time: string;
			date: string;
			direction: string;
		}> = [];

		$('li.el').each((index, element) => {
			const $el = $(element);

			const carrierMetadata = $el.find('.mobile-carrier').text().trim();
			const [carrierCode, carrierNumber] = carrierMetadata.split(/\s+/);

			const time = $el.find('.time').text().trim().replace('late', '');
			const date = $el.find('.day').text().trim();
			const direction = $el.find('.direction').text().trim();

			timetable.push({
				carrier: carrierCode,
				number: carrierNumber,
				time: `${time}`.replace(/\s+/g, ''),
				date,
				direction
			});
		});

		return new Response(JSON.stringify(timetable), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=60'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to fetch schedule' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};