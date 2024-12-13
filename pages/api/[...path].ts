import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import nodeFetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';

// Используем библиотеки для обработки cookie при перенаправлении
// https://github.com/valeriangalliat/fetch-cookie
// https://github.com/salesforce/tough-cookie

// Создаем CookieJar для хранения куков
const jar = new CookieJar();
// Интегрируем fetch с CookieJar
const fetch = fetchCookie(nodeFetch, jar);

const baseUrl = "https://kinozal.tv";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, headers, body } = req;

    // Формируем заголовки для переноса их в запрос к целевому серверу
    const requestHeaders: Record<string, string> = {
        'Content-Type': Array.isArray(headers['content-type']) ? headers['content-type'][0] : headers['content-type'] || 'application/x-www-form-urlencoded',
        'cookie': Array.isArray(headers['cookie']) ? headers['cookie'][0] : headers['cookie'] || '',
        'accept': Array.isArray(headers['accept']) ? headers['accept'][0] : headers['accept'] || '',
        'accept-language': Array.isArray(headers['accept-language']) ? headers['accept-language'][0] : headers['accept-language'] || '',
        'cache-control': Array.isArray(headers['cache-control']) ? headers['cache-control'][0] : headers['cache-control'] || '',
        'content-type': Array.isArray(headers['content-type']) ? headers['content-type'][0] : headers['content-type'] || '',
        'priority': Array.isArray(headers['priority']) ? headers['priority'][0] : headers['priority'] || '',
        'sec-ch-ua': Array.isArray(headers['sec-ch-ua']) ? headers['sec-ch-ua'][0] : headers['sec-ch-ua'] || '',
        'sec-ch-ua-mobile': Array.isArray(headers['sec-ch-ua-mobile']) ? headers['sec-ch-ua-mobile'][0] : headers['sec-ch-ua-mobile'] || '',
        'sec-ch-ua-platform': Array.isArray(headers['sec-ch-ua-platform']) ? headers['sec-ch-ua-platform'][0] : headers['sec-ch-ua-platform'] || '',
        'sec-fetch-dest': Array.isArray(headers['sec-fetch-dest']) ? headers['sec-fetch-dest'][0] : headers['sec-fetch-dest'] || '',
        'sec-fetch-mode': Array.isArray(headers['sec-fetch-mode']) ? headers['sec-fetch-mode'][0] : headers['sec-fetch-mode'] || '',
        'sec-fetch-site': Array.isArray(headers['sec-fetch-site']) ? headers['sec-fetch-site'][0] : headers['sec-fetch-site'] || '',
        'sec-fetch-user': Array.isArray(headers['sec-fetch-user']) ? headers['sec-fetch-user'][0] : headers['sec-fetch-user'] || '',
        'upgrade-insecure-requests': Array.isArray(headers['upgrade-insecure-requests']) ? headers['upgrade-insecure-requests'][0] : headers['upgrade-insecure-requests'] || '',
        'Referer': Array.isArray(headers['referer']) ? headers['referer'][0] : headers['referer'] || '',
        'Referrer-Policy': Array.isArray(headers['referrer-policy']) ? headers['referrer-policy'][0] : headers['referrer-policy'] || '',
    };

    // Если есть тело запроса, то преобразуем его в строку
    let authString: string | undefined;
    if (body) {
        authString = new URLSearchParams(body as Record<string, string>).toString();
        console.log(' Body:', authString);
    }

    try {
        // Запрос к серверу
        const response = await fetch(`${baseUrl}${req.url}`, {
            // Передаем заголовки запроса от клиента к серверу
            headers: requestHeaders,
            // Проверяем метод и передаем тело запроса
            method: method,
            body: method === 'POST' ? authString : null,
            // Отключаем проверку SSL
            agent: new https.Agent({ rejectUnauthorized: false }),
            // Включаем перенаправление запросов для получения cookie из POST-запроса
            redirect: 'follow',
        });

        // Получаем cookies текущего домена из CookieJar для последующих запросов
        const cookies = await jar.getCookies(`${baseUrl}${req.url}`);
        if (cookies.length > 0) {
            const cookieHeaders = cookies.map(cookie => cookie.cookieString());
            console.log(' Cookies:', cookieHeaders);
            res.setHeader('Set-Cookie', cookieHeaders);
        }

        // Возвращяем ответ клиенту через pipe по частям (без загрузки памяти)
        res.status(response.status);
        if (response.body) {
            response.body.pipe(res);
        } else {
            res.end();
        }
    } catch (error) {
        console.error(' Error request:', error);
        res.status(500).send('Error request');
    }
}
