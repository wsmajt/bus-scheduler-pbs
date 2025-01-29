import type { RequestHandler } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

export const GET: RequestHandler = async ( {params} ) => {
    try {
        let sessionCookies: string | null = null;
        const stopId = Number(params.stopId)
        const initResponse = await fetch(
            `http://odjazdy.zdmikp.bydgoszcz.pl/panels/0/default.aspx?stop=${stopId}`,
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

        return new Response(JSON.stringify({ AspCookie: sessionCookies }), {
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