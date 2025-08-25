



export async function fetcher(requestHttpUrl:string){
  const data = await fetch(requestHttpUrl)
  return data.json();
}