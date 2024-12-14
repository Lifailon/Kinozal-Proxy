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
            const buffer = Buffer.from(searchParam || '', 'utf-8') // Корректно конвертируем строку в буфер
            const decoder = new TextDecoder('windows-1251') // Используем TextDecoder для кодировки windows-1251
            const decodedSearch = decoder.decode(buffer) // Декодируем буфер
            console.log('Decoded search param (Windows-1251):', decodedSearch)

            // Преобразуем строку обратно в URL-кодировку
            const encodedSearch = encodeURIComponent(decodedSearch)
            console.log('Encoded search param (URL-encoded):', encodedSearch)

            url.searchParams.set('s', encodedSearch)
        } catch (error) {
            console.error('Error during decoding:', error)
        }
    }

    console.log('Rewritten URL:', url)
    return NextResponse.rewrite(url)
}
