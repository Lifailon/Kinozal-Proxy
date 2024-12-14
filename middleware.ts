import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    console.log('Request URL:', req.url)
    console.log('Next URL:', req.nextUrl)

    if (url.searchParams.has('s')) {
        const searchParam = url.searchParams.get('s')
        console.log('Original search param:', searchParam)

        try {
            // Декодируем строку как Windows-1251 с помощью TextDecoder
            const decoder = new TextDecoder('windows-1251')
            const decodedSearch = decoder.decode(new Uint8Array(Buffer.from(searchParam || '', 'hex')))
            console.log('Decoded search param (Windows-1251):', decodedSearch)

            // Преобразуем строку в формат URL-encoded
            const encodedSearch = encodeURIComponent(decodedSearch)
            console.log('Encoded search param (URL-encoded):', encodedSearch)

            // Устанавливаем откодированный параметр обратно в URL
            url.searchParams.set('s', encodedSearch)
        } catch (error) {
            console.error('Error during decoding:', error)
        }
    }

    console.log('Rewritten URL:', url)
    return NextResponse.rewrite(url)
}
