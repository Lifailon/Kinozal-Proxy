import { NextRequest, NextResponse } from 'next/server'

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
                // Используем TextDecoder для Windows-1251
                const buffer = new TextEncoder().encode(searchParam)
                const decodedSearch = new TextDecoder('windows-1251').decode(buffer)

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
