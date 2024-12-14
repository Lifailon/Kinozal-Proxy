import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const rewriteUrl = req.nextUrl.clone()
    rewriteUrl.href = decodeCyrillic(rewriteUrl.href, false)
    rewriteUrl.search = decodeCyrillic(rewriteUrl.href, true)
    return NextResponse.rewrite(rewriteUrl)
}

function decodeCyrillic(str: string, search: boolean) {
    if (str.includes("s=")) {
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
        str = str.replace(/%[A-F0-9]{2}/g, (match) => winMap[match] || match)
        console.log('Search:', str.replace(/^.*s=/, ""))
    }
    if (search) {
        return str.replace(/^.*s=/, "")
    }
    return str
}

// npm install -g typescript
// tsc .\middleware.ts
// node .\middleware.ts
// decodeCyrillic('s=%F2%E5%F1%F2')