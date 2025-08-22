export async function fetcher<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: 'no-store' })
  if (!r.ok) throw new Error(await r.text().catch(()=>String(r.status)))
  return r.json()
}
