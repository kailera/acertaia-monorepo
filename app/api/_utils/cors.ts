import { NextResponse } from 'next/server'
export const corsHeaders = {
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type, Authorization'
}
export const withCORS = <T,>(res: NextResponse<T>) => {
  Object.entries(corsHeaders).forEach(([k,v])=> res.headers.set(k, v as string))
  return res
}
export const options = ()=> withCORS(new NextResponse(null,{status:200}))
