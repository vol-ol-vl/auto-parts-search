import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = "http://api.favorit-parts.ru/hs/hsprice/";
const apiKey = "00000000-0000-0000-0000-000000000001";
const apiKey2 = "no";

const favoriteApi = createApi({
  reducerPath: "favoriteApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (article) => ({
        url: "",
        params: {
          key: apiKey,
          number: article,
        },
      }),
    }),
    getAnalogs: builder.query({
      query: ({ article, brand }) => ({
        url: "",
        params: {
          key: apiKey,
          number: article,
          brand,
          analogues: "on",
        },
      }),
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetAnalogsQuery,
  useLazyGetBrandsQuery,
  useLazyGetAnalogsQuery,
} = favoriteApi;
export { favoriteApi };
