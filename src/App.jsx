import { useState } from "react";
import "./App.css";

import {
  useLazyGetBrandsQuery,
  useLazyGetAnalogsQuery,
} from "./api/favoritApiSlice";

function App() {
  const [article, setArticle] = useState("");
  const [brand, setBrand] = useState("");
  const [hasSearchedBrands, setHasSearchedBrands] = useState(false);
  const [hasSearchedResults, setHasSearchedResults] = useState(false);
  const [brandsError, setBrandsError] = useState("");
  const [trigger, { isFetching: isBrandsFetching, currentData: brandsData }] =
    useLazyGetBrandsQuery();
  const [
    triggerAnalogs,
    {
      isFetching: isAnalogsFetching,
      currentData: analogsData,
      error: analogsError,
    },
  ] = useLazyGetAnalogsQuery();
  const brands =
    brandsData?.goods?.map((item) => item.brand).filter(Boolean) || [];
  const results = analogsData?.goods?.[0]?.analogues || [];

  const handleArticleSubmit = async (event) => {
    event.preventDefault();

    setBrand("");
    setHasSearchedResults(false);
    setHasSearchedBrands(false);
    setBrandsError("");

    try {
      await trigger(article).unwrap();
      setHasSearchedBrands(true);
    } catch (error) {
      console.error("Ошибка загрузки производителей", error);
      setBrandsError(
        error.data?.error ||
          error.error ||
          "Не удалось загрузить производителей",
      );
    }
  };

  const handleBrandChange = async (event) => {
    const selectedBrand = event.target.value;

    setBrand(selectedBrand);
    setHasSearchedResults(false);

    if (!selectedBrand) return;

    try {
      await triggerAnalogs({
        article,
        brand: selectedBrand,
      }).unwrap();

      setHasSearchedResults(true);
    } catch (error) {
      console.error("Ошибка загрузки аналогов", error);
    }
  };

  return (
    <main className="main container mt-5">
      <h1 className="text-center mb-4">Поиск автозапчастей</h1>

      <section className="section card search-section">
        <div className="card-body">
          <h2>Подбор по артикулу</h2>

          <form
            className="d-flex gap-2 flex-wrap align-items-end"
            onSubmit={handleArticleSubmit}
          >
            <div className="flex-grow-1">
              <label htmlFor="article" className="form-label">
                Артикул детали
              </label>
              <input
                className="form-control"
                type="text"
                id="article"
                placeholder="Введите артикул"
                value={article}
                onChange={(event) => setArticle(event.target.value)}
                required
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isBrandsFetching}
            >
              Найти
            </button>
          </form>
          {isBrandsFetching && <div>Загрузка производителей...</div>}
          {brandsError && <div>{brandsError}</div>}
        </div>
      </section>
      {hasSearchedBrands && brands.length > 0 && (
        <section className="card mt-4">
          <div className="card-body">
            <h2>Выбор производителя</h2>

            <div className="flex-grow-1">
              <label htmlFor="brand" className="form-label">
                Производитель
              </label>
              <select
                className="form-select"
                id="brand"
                value={brand}
                onChange={handleBrandChange}
              >
                <option value="">Выберите производителя</option>
                {brands.map((brand) => {
                  return (
                    <option value={brand} key={brand}>
                      {brand}
                    </option>
                  );
                })}
              </select>
            </div>
            {isAnalogsFetching && <div>Загрузка...</div>}
            {analogsError && (
              <div className="text-danger">
                {analogsError.data?.error ||
                  analogsError.error ||
                  "Не удалось загрузить аналоги"}
              </div>
            )}
          </div>
        </section>
      )}
      {hasSearchedBrands && brands.length === 0 && (
        <div>Производители не найдены</div>
      )}

      {results.length === 0 &&
        hasSearchedResults &&
        !isAnalogsFetching &&
        !analogsError && <div>По вашему запросу ничего не найдено</div>}
      {hasSearchedResults && results.length > 0 && (
        <section className="card mt-4">
          <div className="card-body">
            <h2>Результаты поиска</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Артикул</th>
                  <th scope="col">Наименование</th>
                  <th scope="col">Производитель</th>
                  <th scope="col">Склад</th>
                  <th scope="col">Цена</th>
                  <th scope="col">Наличие</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => {
                  if (!item.warehouses?.length) {
                    return (
                      <tr key={item.goodsID}>
                        <td>{item.number}</td>
                        <td>{item.name}</td>
                        <td>{item.brand}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>Нет в наличии</td>
                      </tr>
                    );
                  } else {
                    return item.warehouses.map((warehouse) => {
                      return (
                        <tr key={warehouse.id}>
                          <td>{item.number}</td>
                          <td>{item.name}</td>
                          <td>{item.brand}</td>
                          <td>{warehouse.code}</td>
                          <td>{warehouse.price}</td>
                          <td>
                            {warehouse.stock > 0
                              ? warehouse.stock
                              : "Нет в наличии"}
                          </td>
                        </tr>
                      );
                    });
                  }
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
