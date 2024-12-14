import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    console.log('Request URL:', req.url)
    console.log('Next URL:', req.nextUrl)
    if (url.searchParams.has('s')) {
        const searchParam = url.searchParams.get('s')
        console.log('Original search param:', searchParam)
        try {
            const decodedSearch = decodeURIComponent(searchParam || '')
            console.log('Decoded search param (UTF-8):', decodedSearch)
            url.searchParams.set('s', decodedSearch)
        } catch (error) {
            console.error(error)
        }
    }
    console.log('Rewritten URL:', url)
    return NextResponse.rewrite(url)
}
