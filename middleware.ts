import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    if (url.searchParams.has('s')) {
        const searchParam = url.searchParams.get('s')
        try {
            const decodedSearch = Buffer.from(searchParam || '', 'latin1').toString('utf8')
            url.searchParams.set('s', decodedSearch)
        } catch (error) {
            console.error(error)
        }
    }
    return NextResponse.rewrite(url)
}