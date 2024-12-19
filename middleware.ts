import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const requestNextUrl = req.nextUrl.href
    // Обновляем кодировку только для поисковых запросов
    if (requestNextUrl.includes("s=")) {
        const rewriteUrl = req.nextUrl.clone()
        // console.log('Encode url:', rewriteUrl)
        rewriteUrl.href = decodeCyrillic(requestNextUrl, false)
        // Исходный параметр search содержит битые символы
        rewriteUrl.search = decodeCyrillic(requestNextUrl, true)
        // console.log('Decode url:', rewriteUrl)
        return NextResponse.rewrite(rewriteUrl)
    }
    return
}

// Функция декодирования Windows-1251 в UTF-8
function decodeCyrillic(str: string, search: boolean) {
    // Удаляем все части url, оставляя только кодированные символы для параметра search
    if (search) {
        str = str.replace(/.+s=/, "s=") // .replace(/&.+/, "")
    }
    const winMap: { [key: string]: string } = {
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
    const utfMap: { [key: string]: string } = {
        'а': '%D0%B0',
        'б': '%D0%B1',
        'в': '%D0%B2',
        'г': '%D0%B3',
        'д': '%D0%B4',
        'е': '%D0%B5',
        'ё': '%D1%91',
        'ж': '%D0%B6',
        'з': '%D0%B7',
        'и': '%D0%B8',
        'й': '%D0%B9',
        'к': '%D0%BA',
        'л': '%D0%BB',
        'м': '%D0%BC',
        'н': '%D0%BD',
        'о': '%D0%BE',
        'п': '%D0%BF',
        'р': '%D1%80',
        'с': '%D1%81',
        'т': '%D1%82',
        'у': '%D1%83',
        'ф': '%D1%84',
        'х': '%D1%85',
        'ц': '%D1%86',
        'ч': '%D1%87',
        'ш': '%D1%88',
        'щ': '%D1%89',
        'ъ': '%D1%8A',
        'ы': '%D1%8B',
        'ь': '%D1%8C',
        'э': '%D1%8D',
        'ю': '%D1%8E',
        'я': '%D1%8F',
        'А': '%D0%90',
        'Б': '%D0%91',
        'В': '%D0%92',
        'Г': '%D0%93',
        'Д': '%D0%94',
        'Е': '%D0%95',
        'Ё': '%D0%81',
        'Ж': '%D0%96',
        'З': '%D0%97',
        'И': '%D0%98',
        'Й': '%D0%99',
        'К': '%D0%9A',
        'Л': '%D0%9B',
        'М': '%D0%9C',
        'Н': '%D0%9D',
        'О': '%D0%9E',
        'П': '%D0%9F',
        'Р': '%D0%A0',
        'С': '%D0%A1',
        'Т': '%D0%A2',
        'У': '%D0%A3',
        'Ф': '%D0%A4',
        'Х': '%D0%A5',
        'Ц': '%D0%A6',
        'Ч': '%D0%A7',
        'Ш': '%D0%A8',
        'Щ': '%D0%A9',
        'Ъ': '%D0%AA',
        'Ы': '%D0%AB',
        'Ь': '%D0%AC',
        'Э': '%D0%AD',
        'Ю': '%D0%AE',
        'Я': '%D0%AF'
    }
    // Декодируем все символы Windows-1251 в кириллицу, что бы избежать повторной замены символов
    str = str.replace(/%[A-F0-9]{2}/g, (match) => winMap[match] || match)
    // Декодируем все символы кириллицы в UTF-8
    str = str.replace(/[а-яА-Я]/g, (match) => utfMap[match] || match)
    // console.log('Decode string:', str)
    return str
}

// npm install -g typescript
// tsc .\middleware.ts && node .\middleware.js
// const url = 'https://kinozal.tv/browse.php?s=%F2%E5%F1%F2&g=0&c=0&v=0&d=0&w=0&t=0&f=0'
// decodeCyrillic(url, false)
// decodeCyrillic(url, true)
// Decode string: https://kinozal.tv/browse.php?s=%D1%82%D0%B5%D1%81%D1%82&g=0&c=0&v=0&d=0&w=0&t=0&f=0
// Decode string: s=%D1%82%D0%B5%D1%81%D1%82