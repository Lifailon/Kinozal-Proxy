import { NextRequest, NextResponse } from 'next/server'
import iconv from 'iconv-lite'

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    console.log('Request URL:', req.url)
    console.log('Next URL:', req.nextUrl)

    if (url.searchParams.has('s')) {
        const searchParam = url.searchParams.get('s')

        // Проверяем, что searchParam не null
        if (searchParam) {
            console.log('Original search param:', searchParam)

            try {
                // Декодируем как Windows-1251
                const buffer = Buffer.from(searchParam, 'utf-8') // Преобразуем строку в буфер
                const decodedSearch = iconv.decode(buffer, 'windows-1251')

                // Перекодируем в UTF-8 и затем в URL-encoded
                const encodedSearch = encodeURIComponent(decodedSearch)

                console.log('Decoded search param (UTF-8):', decodedSearch)
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
