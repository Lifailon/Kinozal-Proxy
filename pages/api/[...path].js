import nodeFetch from 'node-fetch'
import fetchCookie from 'fetch-cookie'

// Используем библиотеку для обработки cookie при перенаправлении
// https://github.com/valeriangalliat/fetch-cookie
const fetch = fetchCookie(nodeFetch)
const baseUrl = "https://kinozal.tv"

export default async function handler(req, res) {
    const { method, headers, body } = req
    const requestHeaders = {
        'Content-Type': headers['content-type'] || 'application/x-www-form-urlencoded',
        'cookie': req.headers['cookie'] || '',
        'accept': req.headers['accept'],
        'accept-language': req.headers['accept-language'],
        'cache-control': req.headers['cache-control'],
        'content-type': req.headers['content-type'],
        'priority': req.headers['priority'],
        'sec-ch-ua': req.headers['sec-ch-ua'],
        'sec-ch-ua-mobile': req.headers['sec-ch-ua-mobile'],
        'sec-ch-ua-platform': req.headers['sec-ch-ua-platform'],
        'sec-fetch-dest': req.headers['sec-fetch-dest'],
        'sec-fetch-mode': req.headers['sec-fetch-mode'],
        'sec-fetch-site': req.headers['sec-fetch-site'],
        'sec-fetch-user': req.headers['sec-fetch-user'],
        'upgrade-insecure-requests': req.headers['upgrade-insecure-requests'],
        'Referer': req.headers['Referer'],
        'Referrer-Policy': req.headers['Referrer-Policy'],
    }
    // Если есть тело запроса, то преобразуем в строку
    let authString
    if (req.body) {
        authString = new URLSearchParams(req.body).toString()
        console.log(' BODY', authString)
    }
    try {
        // Запрос к серверу
        const response = await fetch(`${baseUrl}${req.url}`, {
            // Передаем заголовки запроса от клиента к серверу
            headers: requestHeaders,
            // Проверяем метод и передаем тело запроса
            method: req.method,
            body: req.method === 'POST' ? authString : null,
            // Отключаем проверку SSL
            agent: new (require('https').Agent)({ rejectUnauthorized: false }),
            // Включаем перенаправление запросов для получения cookie из POST-запроса
            redirect: 'follow',
        })
        // Перенаправление запроса для получения cookie
        // let cookies
        // if (response.status === 302) {
        //     const location = response.headers.get('Location')
        //     if (location) {
        //         redirectUrl = new URL(location, baseUrl).toString()
        //         const redirectCookie = response.headers.get('set-cookie')
        //         redirectResponse = await fetch(redirectUrl, {
        //             method: req.method,
        //             headers: {
        //                 'cookie': redirectCookie,
        //             },
        //             body: req.method === 'POST' ? authString : null,
        //             agent: new (require('https').Agent)({ rejectUnauthorized: false }),
        //         })
        //         cookies = redirectResponse.headers.get('set-cookie')
        //     }
        // }
        // Сохраняем cookie для последующих запросов
        // if (cookies) {
        //     console.log('Cookie:', cookies)
        //     res.setHeader('Set-Cookie', cookies)
        // }
        // Возвращяем ответ клиенту через pipe по частям (без загрузки памяти)
        res.status(response.status)
        response.body.pipe(res)
    } catch (error) {
        console.error('Error request:', error)
        res.status(500).send('Error request')
    }
}
