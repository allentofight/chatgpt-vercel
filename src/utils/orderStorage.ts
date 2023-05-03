export function setItemWithExpiration(key: string, value: any, expireHours: number): void {
  const expireTime = new Date();
  expireTime.setHours(expireTime.getHours() + expireHours);
  const data = { value, expireTime: expireTime.getTime() };
  localStorage.setItem(key, JSON.stringify(data));
}

export function getItemWithExpiration(key: string): any | null {
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  const parsedData: { value: any; expireTime: number } = JSON.parse(data);
  const currentTime = new Date().getTime();

  if (parsedData.expireTime < currentTime) {
    localStorage.removeItem(key);
    return null;
  }

  return parsedData.value;
}
