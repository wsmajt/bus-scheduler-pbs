import type { RequestHandler } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

let sessionCookies: string | null = null;

async function getNewSession( stopId : number) {
    console.log(stopId)
    const initResponse = await fetch(
        "http://odjazdy.zdmikp.bydgoszcz.pl/panels/0/default.aspx?stop=${stopId}",
        {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }
    );

    const cookies = initResponse.headers.get('set-cookie');
    if (!cookies) throw new Error('Failed to get initial cookies');

    sessionCookies = cookies
        .split(',')
        .map(cookie => cookie.split(';')[0])
        .join('; ');

    return sessionCookies;
}

export const POST: RequestHandler = async ( {params} ) => {
    try {
        const stopId = Number(params.stopId)
        if (!stopId){
            throw new Error("Brak ID przystanku!")
        }

        if (!sessionCookies) {
            await getNewSession(stopId);
        }
        console.log(stopId)

        const url = "http://odjazdy.zdmikp.bydgoszcz.pl/panels/0/default.aspx?stop=${stopId}";
        const body = new URLSearchParams({});
        const headers = {
            'Accept': '*/*',
            'Accept-Language': 'pl,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': sessionCookies!,
            'Origin': 'http://odjazdy.zdmikp.bydgoszcz.pl',
            'Pragma': 'no-cache',
            'Referer': 'http://odjazdy.zdmikp.bydgoszcz.pl/panels/0/default.aspx?stop=${stopId}',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36 Edg/132.0.0.0',
            'X-MicrosoftAjax': 'Delta=true',
            'X-Requested-With': 'XMLHttpRequest'
        };

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        const departures: Array<{ line: string; direction: string; departure: string }> = [];

        const scheduleTable = $('table.tablePanel');
        if (!scheduleTable.length) {
            throw new Error('Schedule table not found in response');
        }

        scheduleTable.find('tbody tr').each((i, row) => {
            const columns = $(row).find('td');
            if (columns.length === 3) {
                const line = $(columns[0]).text().trim();
                const direction = $(columns[1]).text().trim();
                const departure = $(columns[2]).text().trim();

                departures.push({
                    line,
                    direction,
                    departure
                });
            }
        });

        const filteredDepartures = departures.filter(d =>
            d.line && d.direction && d.departure &&
            (d.departure.includes('min') || d.departure.includes(':'))
        );

        return new Response(JSON.stringify({ departures: filteredDepartures }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch schedule' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};