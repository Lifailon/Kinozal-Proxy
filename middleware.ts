import { NextRequest, NextResponse } from 'next/server'

// Функция для ручного декодирования URL-encoded строки
function decodeAndReencodeManually(urlEncodedString: string): string {
    // Разбиваем строку на пары символов (например, %F2, %E5)
    const hexArray: string[] = urlEncodedString.match(/%[0-9A-F]{2}/g) || [];

    // Мапим каждый символ из hex-формата в соответствующий символ UTF-8
    const decodedString: string = hexArray.map((hex: string) => {
        // Получаем десятичное значение из шестнадцатиричной строки
        const charCode = parseInt(hex.substring(1), 16);

        // Возвращаем символ по кодовому значению
        return String.fromCharCode(charCode);
    }).join('');
    
    // Теперь, когда строка декодирована, кодируем её обратно в URL-формат
    const reencodedString: string = encodeURIComponent(decodedString);
    
    return reencodedString;
}

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    console.log('Request URL:', req.url)
    console.log('Next URL:', req.nextUrl)

    if (url.searchParams.has('s')) {
        const searchParam = url.searchParams.get('s')
        console.log('Original search param:', searchParam)

        try {
            // Используем вручную написанную функцию для декодирования и повторной кодировки строки
            const reencodedSearch = decodeAndReencodeManually(searchParam || '')
            console.log('Reencoded search param (URL-encoded):', reencodedSearch)
            
            // Устанавливаем заново закодированное значение параметра
            url.searchParams.set('s', reencodedSearch)
        } catch (error) {
            console.error(error)
        }
    }

    console.log('Rewritten URL:', url)
    return NextResponse.rewrite(url)
}
