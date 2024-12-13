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
        'Content-Type': Array.isArray(headers['content-type']) ? headers['content-type'][0] : headers['content-type'] || 'application/x-www-form-urlencoded',
        'accept': Array.isArray(headers['accept']) ? headers['accept'][0] : headers['accept'] || '',
        'accept-language': Array.isArray(headers['accept-language']) ? headers['accept-language'][0] : headers['accept-language'] || '',
        'accept-charset': '',
        'accept-encoding': Array.isArray(headers['accept-encoding']) ? headers['accept-encoding'][0] : headers['accept-encoding'] || '',
        'cookie': Array.isArray(headers['cookie']) ? headers['cookie'][0] : headers['cookie'] || '',
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
    }

    // Если есть тело запроса, то преобразуем его в строку
    let authString: string | undefined
    if (body) {
        authString = new URLSearchParams(body as Record<string, string>).toString()
        console.log('Body:', authString)
    }

    // Декодируем кириллицу для поисковых запросов
    // const decodeUrl = decodeCyrillic(`${baseUrl}${req.url}`)
    const decodeUrl = `${baseUrl}${req.url}`
    if (req.url?.includes("s=")) {
        const requestSearch = req.url.replace(/^.*s=/, "")
        console.log('Search query:', requestSearch)
        console.log('Search query decode in utf-8:', Buffer.from(requestSearch, 'binary').toString('utf-8'))
        console.log('Search query decode in win-1251', iconv.decode(Buffer.from(requestSearch, 'binary'), 'windows-1251'))
        console.log('Headers:', req.headers)
    }
    
    try {
        // Запрос к серверу
        const response = await fetch(decodeUrl, {
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

// Функция для декодирования кириллицы в заголовке запроса
function decodeCyrillic(str: string) {
    if (str.includes("s=")) {
        const cyrillicMap: { [key: string]: string } = {
            '%20': '+',
            '%E0': 'а',
            '%E1': 'б',
            '%E2': 'в',
            '%E3': 'г',
            '%E4': 'д',
            '%E5': 'е',
            '%E6': 'ж',
            '%E7': 'з',
            '%E8': 'и',
            '%E9': 'й',
            '%EA': 'к',
            '%EB': 'л',
            '%EC': 'м',
            '%ED': 'н',
            '%EE': 'о',
            '%EF': 'п',
            '%F0': 'р',
            '%F1': 'с',
            '%F2': 'т',
            '%F3': 'у',
            '%F4': 'ф',
            '%F5': 'х',
            '%F6': 'ц',
            '%F7': 'ч',
            '%F8': 'ш',
            '%F9': 'щ',
            '%FA': 'ъ',
            '%FB': 'ы',
            '%FC': 'ь',
            '%FD': 'э',
            '%FE': 'ю',
            '%FF': 'я',
            '%C0': 'А',
            '%C1': 'Б',
            '%C2': 'В',
            '%C3': 'Г',
            '%C4': 'Д',
            '%C5': 'Е',
            '%C6': 'Ж',
            '%C7': 'З',
            '%C8': 'И',
            '%C9': 'Й',
            '%CA': 'К',
            '%CB': 'Л',
            '%CC': 'М',
            '%CD': 'Н',
            '%CE': 'О',
            '%CF': 'П',
            '%D0': 'Р',
            '%D1': 'С',
            '%D2': 'Т',
            '%D3': 'У',
            '%D4': 'Ф',
            '%D5': 'Х',
            '%D6': 'Ц',
            '%D7': 'Ч',
            '%D8': 'Ш',
            '%D9': 'Щ',
            '%DA': 'Ъ',
            '%DB': 'Ы',
            '%DC': 'Ь',
            '%DD': 'Э',
            '%DE': 'Ю',
            '%DF': 'Я',
        }
        str = str.replace(/%[A-F0-9]{2}/g, (match) => cyrillicMap[match] || match)
        console.log('Search:', str.replace(/^.*s=/, ""))
    }
    return str
}