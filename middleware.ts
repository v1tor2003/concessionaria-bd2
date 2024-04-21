import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req){
    console.log(req.nextUrl.pathname)
    console.log(req.nextauth.token?.email)
    if(req.nextUrl.pathname.startsWith('/dashboard')){
      const token = req.nextauth.token

      if(!token) return NextResponse.rewrite(new URL('/login', req.url))
      
      if(req.nextUrl.pathname === '/dashboard/funcionarios')
        if(token.role != 'adm') return NextResponse.rewrite(new URL('/unauthorized', req.url))
    } 
  },
  {
    callbacks: {
      authorized: ({token}) => !!token
    }
  } 
)

// maybe macther is '/dashboard/:path*'
export const config = {matcher: ['/dashboard/:path*']}