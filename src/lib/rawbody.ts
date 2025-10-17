export async function readBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    const txt = await request.text();
    try {
      return JSON.parse(txt);
    } catch {
      return {};
    }
  }
}
