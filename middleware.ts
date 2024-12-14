import { NextRequest, NextResponse } from 'next/server'
import iconv from 'iconv-lite'

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    const searchParam = url.searchParams.get('s')

    if (searchParam) {
        console.log('Original URL:', req.url)
        
        // Используем decodeURIComponent
        try {
            const decodedURIComponent = decodeURIComponent(searchParam)
            console.log('Decoded with decodeURIComponent:', decodedURIComponent)
        } catch (e) {
            console.error('Error with decodeURIComponent:', e)
        }

        // Декодирование с использованием Buffer (UTF-8)
        try {
            const decodedBufferUtf8 = Buffer.from(searchParam, 'hex').toString('utf8')
            console.log('Decoded with Buffer to UTF-8:', decodedBufferUtf8)
        } catch (e) {
            console.error('Error with Buffer to UTF-8:', e)
        }

        // Декодирование с использованием iconv (Windows-1251)
        try {
            const decodedWin1251 = iconv.decode(Buffer.from(searchParam, 'binary'), 'windows-1251')
            console.log('Decoded with iconv (windows-1251):', decodedWin1251)
        } catch (e) {
            console.error('Error with iconv (windows-1251):', e)
        }

        // Попробуем декодировать в ISO-8859-1
        try {
            const decodedISO = iconv.decode(Buffer.from(searchParam, 'binary'), 'ISO-8859-1')
            console.log('Decoded with iconv (ISO-8859-1):', decodedISO)
        } catch (e) {
            console.error('Error with iconv (ISO-8859-1):', e)
        }

        // Декодирование с использованием TextDecoder (windows-1251)
        try {
            const textDecoder = new TextDecoder('windows-1251', { fatal: true })
            const decodedTextDecoder = textDecoder.decode(new TextEncoder().encode(searchParam))
            console.log('Decoded with TextDecoder:', decodedTextDecoder)
        } catch (e) {
            console.error('Error with TextDecoder:', e)
        }

        // Пример ручного разбора битых данных (если необходимо)
        const hexString = searchParam
        const bytes = hexString.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
        console.log('Decoded bytes:', bytes)
    }

    return NextResponse.rewrite(url)
}
