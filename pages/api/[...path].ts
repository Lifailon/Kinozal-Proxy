import { NextApiRequest, NextApiResponse } from 'next'
import https from 'https'
import nodeFetch from 'node-fetch'
import fetchCookie from 'fetch-cookie'
import { CookieJar } from 'tough-cookie'
import iconv from 'iconv-lite'

// Используем библиотеки для обработки cookie при перенаправлении
// https://github.com/valeriangalliat/fetch-cookie
// https://github.com/salesforce/tough-cookie
// if (response.status === 302) { const location = response.headers.get('Location') }

// Создаем CookieJar для хранения куков
const jar = new CookieJar()
// Интегрируем fetch с CookieJar
const fetch = fetchCookie(nodeFetch, jar)

const baseUrl = "https://kinozal.tv"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, headers, body } = req
   
    // Пропускаем запросы только для клиентов curl/*
    const userAgent = headers['user-agent'] || ''
    if (!userAgent.startsWith('curl/')) {
        console.log('Access denied for agent:', userAgent)
        res.status(403).send('Access denied: only curl agent')
        return
    }

    // Формируем заголовки для переноса их в запрос к целевому серверу
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'accept': Array.isArray(headers['accept']) ? headers['accept'][0] : headers['accept'] || '',
        'cookie': Array.isArray(headers['cookie']) ? headers['cookie'][0] : headers['cookie'] || '',
        'cache-control': Array.isArray(headers['cache-control']) ? headers['cache-control'][0] : headers['cache-control'] || '',
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
    }

    // Если есть тело запроса, то преобразуем его в строку
    let authString: string | undefined
    if (body) {
        authString = new URLSearchParams(body as Record<string, string>).toString()
        console.log('Auth body:', authString)
    }

    // Формируем url для запроса к серверу
    let requestUrl = `${baseUrl}${req.url}`

    // Обновляем url для загрузки
    if (requestUrl.includes("download.php?id=")) {
        requestUrl = requestUrl.replace('kinozal.tv','dl.kinozal.tv')
        console.log('Download url:', requestUrl)
    }

    // Логируем поисковые запросы
    if (requestUrl.includes("s=")) {
        const requestSearch = requestUrl.replace(/^.+s=/, "")
        console.log('Search path:', requestSearch)
        console.log('Search query:', req.query.s)
    }

    try {
        // Запрос к серверу
        const response = await fetch(requestUrl, {
            // Передаем заголовки запроса от клиента к серверу
            headers: requestHeaders,
            // Проверяем метод и передаем тело запроса
            method: method,
            body: method === 'POST' ? authString : null,
            // Отключаем проверку SSL
            agent: new https.Agent({ rejectUnauthorized: false }),
            // Включаем перенаправление запросов для получения cookie из POST-запроса
            redirect: 'follow',
        })

        // Получаем cookies текущего домена из CookieJar для последующих запросов
        const cookies = await jar.getCookies(`${baseUrl}${req.url}`)
        if (cookies.length > 0) {
            const cookieHeaders = cookies.map(cookie => cookie.cookieString())
            console.log('Cookies:', cookieHeaders)
            res.setHeader('Set-Cookie', cookieHeaders)
        }

        // Обновляем url для загрузки на странице описания
        if (req.url?.includes("details.php?id=")) {
            let bodyBuffer = await response.arrayBuffer()
            // Декодируем буфер в windows-1251
            let body = iconv.decode(Buffer.from(bodyBuffer), 'win1251')
            console.log(body)
            // Заменяем url на странице
            body = body.replace("dl.kinozal.tv", "kinozal.vercel.app")
            // Кодируем буфер обратно
            const modifiedBodyBuffer = iconv.encode(body, 'win1251')
            res.setHeader('Content-Type', 'text/html; charset=windows-1251')
            res.status(response.status).send(modifiedBodyBuffer)
        }

        // Возвращяем ответ клиенту через pipe по частям (без загрузки памяти)
        res.status(response.status)
        if (response.body) {
            response.body.pipe(res)
        } else {
            res.end()
        }
    } catch (error) {
        console.error('Error request:', error)
        res.status(500).send('Error request: destination server not available')
    }
}