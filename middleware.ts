import { NextRequest, NextResponse } from 'next/server'
import iconv from 'iconv-lite'

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    if (url.searchParams.has('s')) {
        const searchParam = url.searchParams.get('s') || ''
        try {
            const buffer = Buffer.from(searchParam, 'binary')
            const decodedSearch = iconv.decode(buffer, 'windows-1251')
            url.searchParams.set('s', decodedSearch)
            console.log('url:', url)
        } catch (error) {
            console.error(error)
        }
    }
    return NextResponse.rewrite(url)
}
