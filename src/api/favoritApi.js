const apiUrl = "http://api.favorit-parts.ru/hs/hsprice/";
export const apiKey = "00000000-0000-0000-0000-000000000001";

export function getBrands(key, article) {
  const params = new URLSearchParams({
    key,
    number: article,
  });
  const url = `${apiUrl}?${params.toString()}`;

  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при загрузке производителей");
    }

    return response.json();
  });
}

export function getAnalogs(key, article, brand) {
  const params = new URLSearchParams({
    key,
    number: article,
    brand,
    analogues: "on",
  });
  const url = `${apiUrl}?${params.toString()}`;

  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при загрузке результата");
    }

    return response.json();
  });
}
