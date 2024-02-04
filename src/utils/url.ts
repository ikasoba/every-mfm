export function urlWithParams<T extends Record<string, any>>(
  url: URL,
  params: T
) {
  const res = new URL(url);

  for (const name in params) {
    res.searchParams.set(name, params[name]);
  }

  return res;
}
