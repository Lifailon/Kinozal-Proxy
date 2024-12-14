import { NextRequest, NextResponse } from 'next/server'
import iconv from 'iconv-lite'

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    console.log('Request URL:', req.url)
    console.log('Next URL:', req.nextUrl)

    if (url.searchParams.has('s')) {
        const searchParam = url.searchParams.get('s')

        // Проверяем, что параметр существует
        if (searchParam) {
            console.log('Original search param:', searchParam)

            try {
                // Декодируем строку как windows-1251 с помощью iconv-lite
                const decodedSearch = iconv.decode(Buffer.from(searchParam, 'binary'), 'windows-1251')
                console.log('Decoded search param (Windows-1251):', decodedSearch)

                // Перекодируем в UTF-8
                const encodedSearch = encodeURIComponent(decodedSearch)
                console.log('Encoded search param (URL-encoded):', encodedSearch)

                url.searchParams.set('s', encodedSearch)
            } catch (error) {
                console.error('Error during decoding:', error)
            }
        } else {
            console.warn('Search param "s" is null or empty.')
        }
    }

    console.log('Rewritten URL:', url)
    return NextResponse.rewrite(url)
}
