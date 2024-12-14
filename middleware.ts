import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const rewriteUrl = req.nextUrl.clone()
    console.log('Input URL:', rewriteUrl)
    rewriteUrl.href = decodeWinToUTF(rewriteUrl.href)
    rewriteUrl.search = decodeWinToUTF(rewriteUrl.search)
    console.log('Output URL:', rewriteUrl)
    return NextResponse.rewrite(rewriteUrl)
}

function decodeWinToUTF(str: string) {
    if (str.includes("s=")) {
        const cyrillicMap: { [key: string]: string } = {
            '%E0': '%D0%B0',
            '%E1': '%D0%B1',
            '%E2': '%D0%B2',
            '%E3': '%D0%B3',
            '%E4': '%D0%B4',
            '%E5': '%D0%B5',
            '%F1': '%D1%81',
            '%E6': '%D0%B6',
            '%E7': '%D0%B7',
            '%E8': '%D0%B8',
            '%E9': '%D0%B9',
            '%EA': '%D0%BA',
            '%EB': '%D0%BB',
            '%EC': '%D0%BC',
            '%ED': '%D0%BD',
            '%EE': '%D0%BE',
            '%EF': '%D0%BF',
            '%F0': '%D1%80',
            '%F2': '%D1%82',
            '%F3': '%D1%83',
            '%F4': '%D1%84',
            '%F5': '%D1%85',
            '%F6': '%D1%86',
            '%F7': '%D1%87',
            '%F8': '%D1%88',
            '%F9': '%D1%89',
            '%FA': '%D1%8B',
            '%FB': '%D1%8D',
            '%FC': '%D1%8E',
            '%FD': '%D1%8F',
            '%FF': '%D1%91',
            '%C0': '%D0%90',
            '%C1': '%D0%91',
            '%C2': '%D0%92',
            '%C3': '%D0%93',
            '%C4': '%D0%94',
            '%C5': '%D0%95',
            '%C6': '%D0%96',
            '%C7': '%D0%97',
            '%C8': '%D0%98',
            '%C9': '%D0%99',
            '%CA': '%D0%9A',
            '%CB': '%D0%9B',
            '%CC': '%D0%9C',
            '%CD': '%D0%9D',
            '%CE': '%D0%9E',
            '%CF': '%D0%9F',
            '%D0': '%D1%80',
            '%D1': '%D1%81',
            '%D2': '%D1%82',
            '%D3': '%D1%83',
            '%D4': '%D1%84',
            '%D5': '%D1%85',
            '%D6': '%D1%86',
            '%D7': '%D1%87',
            '%D8': '%D1%88',
            '%D9': '%D1%89',
            '%DA': '%D1%8B',
            '%DB': '%D1%8D',
            '%DC': '%D1%8E',
            '%DD': '%D1%8F',
            '%D2%91': '%D0%81',
        }
        str = str.replace(/%[A-F0-9]{2}/g, (match) => cyrillicMap[match] || match)
        console.log('Search:', str.replace(/^.*s=/, ""))
    }
    return str
}