export const addPrefix = (url: string) =>
  url.startsWith(`https://`) ? url : `https://${url}`;
export const addPrefixes = (urls: string[]) =>
  urls.map((url) => (url.startsWith(`https://`) ? url : `https://${url}`));
