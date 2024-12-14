import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const rewriteUrl = req.nextUrl.clone()
    rewriteUrl.href = decodeWinToUTF(rewriteUrl.href)
    rewriteUrl.search = decodeWinToUTF(rewriteUrl.search)
    return NextResponse.rewrite(rewriteUrl)
}

function decodeWinToUTF(str: string) {
    if (str.includes("s=")) {
        console.log('Search input string:', str)
        const cyrillicMap: { [key: string]: string } = {
            '%E0': '%D0%B0', // а
            '%E1': '%D0%B1', // б
            '%E2': '%D0%B2', // в
            '%E3': '%D0%B3', // г
            '%E4': '%D0%B4', // д
            '%E5': '%D0%B5', // е
            '%F1': '%D1%81', // с
            '%E6': '%D0%B6', // ж
            '%E7': '%D0%B7', // з
            '%E8': '%D0%B8', // и
            '%E9': '%D0%B9', // й
            '%EA': '%D0%BA', // к
            '%EB': '%D0%BB', // л
            '%EC': '%D0%BC', // м
            '%ED': '%D0%BD', // н
            '%EE': '%D0%BE', // о
            '%EF': '%D0%BF', // п
            '%F0': '%D1%80', // р
            '%F2': '%D1%82', // т
            '%F3': '%D1%83', // у
            '%F4': '%D1%84', // ф
            '%F5': '%D1%85', // х
            '%F6': '%D1%86', // ц
            '%F7': '%D1%87', // ч
            '%F8': '%D1%88', // ш
            '%F9': '%D1%89', // щ
            '%FA': '%D1%8B', // ы
            '%FB': '%D1%8D', // э
            '%FC': '%D1%8E', // ю
            '%FD': '%D1%8F', // я
            '%FF': '%D1%91', // ё
            '%C0': '%D0%90', // А
            '%C1': '%D0%91', // Б
            '%C2': '%D0%92', // В
            '%C3': '%D0%93', // Г
            '%C4': '%D0%94', // Д
            '%C5': '%D0%95', // Е
            '%C6': '%D0%96', // Ж
            '%C7': '%D0%97', // З
            '%C8': '%D0%98', // И
            '%C9': '%D0%99', // Й
            '%CA': '%D0%9A', // К
            '%CB': '%D0%9B', // Л
            '%CC': '%D0%9C', // М
            '%CD': '%D0%9D', // Н
            '%CE': '%D0%9E', // О
            '%CF': '%D0%9F', // П
            '%D0': '%D1%80', // р
            '%D1': '%D1%81', // с
            '%D2': '%D1%82', // т
            '%D3': '%D1%83', // у
            '%D4': '%D1%84', // ф
            '%D5': '%D1%85', // х
            '%D6': '%D1%86', // ц
            '%D7': '%D1%87', // ч
            '%D8': '%D1%88', // ш
            '%D9': '%D1%89', // щ
            '%DA': '%D1%8B', // ы
            '%DB': '%D1%8D', // э
            '%DC': '%D1%8E', // ю
            '%DD': '%D1%8F', // я
        }
        // const regex = /%[A-F0-9]{2}/g
        const regex = /s=([^&]*%[A-F0-9]{2})/g
        let encode = ''
        let decode = ''
        if (regex.test(str)) {
            const matches = str.match(regex) || []
            for (let m of matches) {
                encode += m
                decode += cyrillicMap[m]
            }
        }
        str = str.replace(encode, decode)
        console.log('Search output string:', str)
    }
    return str
}

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