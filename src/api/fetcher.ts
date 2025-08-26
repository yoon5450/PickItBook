



export async function fetcher(requestHttpUrl:string, init?: RequestInit){
  const res = await fetch(requestHttpUrl, {...init})
  if(!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json();
}