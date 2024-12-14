import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const rewriteUrl = req.nextUrl.clone()
    if (rewriteUrl.href.includes("s=")) {
        console.log('Input URL:', rewriteUrl)
        const requestSearch = rewriteUrl.href.replace(/^.*s=/, "")
        if (requestSearch == "%F2%E5%F1%F2") {
            const newRequestSearch = "%D1%82%D0%B5%D1%81%D1%82"
            rewriteUrl.href = rewriteUrl.href.replace(requestSearch, newRequestSearch)
            rewriteUrl.search = rewriteUrl.search.replace(requestSearch, newRequestSearch)
            // rewriteUrl.searchParams.set('s', newRequestSearch)
        }
        console.log('Input URL:', rewriteUrl)
    }
    return NextResponse.rewrite(rewriteUrl)
}