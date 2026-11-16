import { useState } from "react";
import "./App.css";

import { getBrands, apiKey, getAnalogs } from "./api/favoritApi";

function App() {
  const [article, setArticle] = useState("");
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [results, setResults] = useState([]);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [resultsError, setResultsError] = useState("");
  const [hasSearchedBrands, setHasSearchedBrands] = useState(false);
  const [hasSearchedResults, setHasSearchedResults] = useState(false);
  const [brandsError, setBrandsError] = useState("");

  const handleArticleSubmit = async (event) => {
    event.preventDefault();

    setBrand("");
    setBrands([]);
    setResults([]);
    setIsResultsLoading(false);
    setResultsError("");
    setHasSearchedResults(false);
    setHasSearchedBrands(false);
    setBrandsError("");
    setIsBrandsLoading(true);
    console.log(article);

    try {
      const data = await getBrands(apiKey, article);
      setBrands(data.goods.map((item) => item.brand));
      setHasSearchedBrands(true);
    } catch (error) {
      console.error("Ошибка загрузки производителей", error);
      setBrandsError(error.message);
    } finally {
      setIsBrandsLoading(false);
    }
  };

  const handleBrandSubmit = async (event) => {
    event.preventDefault();
    if (!brand) return;
    console.log(brand);
    setIsResultsLoading(true);
    setResultsError("");
    setResults([]);
    setHasSearchedResults(false);

    try {
      const data = await getAnalogs(apiKey, article, brand);
      console.log(data);
      setResults(data.goods?.[0]?.analogues ?? []);
      setHasSearchedResults(true);
    } catch (error) {
      console.error("Ошибка загрузки аналогов", error);
      setResultsError(error.message);
    } finally {
      setIsResultsLoading(false);
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
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isBrandsLoading}
            >
              Найти
            </button>
          </form>
          {isBrandsLoading && <div>Загрузка производителей...</div>}
          {brandsError && <div>{brandsError}</div>}
        </div>
      </section>
      {hasSearchedBrands && brands.length > 0 && (
        <section className="card mt-4">
          <div className="card-body">
            <h2>Выбор производителя</h2>

            <form
              className="d-flex gap-2 flex-wrap align-items-end"
              onSubmit={handleBrandSubmit}
            >
              <div className="flex-grow-1">
                <label htmlFor="brand" className="form-label">
                  Производитель
                </label>
                <select
                  className="form-select"
                  id="brand"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
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
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!brand || isResultsLoading}
              >
                Показать аналоги
              </button>
            </form>
            {isResultsLoading && <div>Загрузка...</div>}
            {resultsError && <div className="text-danger">{resultsError}</div>}
          </div>
        </section>
      )}
      {hasSearchedBrands && brands.length === 0 && (
        <div>Производители не найдены</div>
      )}

      {results.length === 0 &&
        hasSearchedResults &&
        !isResultsLoading &&
        !resultsError && <div>По вашему запросу ничего не найдено</div>}
      {results.length > 0 && (
        <section className="card mt-4">
          <div className="card-body">
            <h2>Результаты поиска</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Артикул</th>
                  <th scope="col">Наименование</th>
                  <th scope="col">Производитель</th>
                  <th scope="col">Цена</th>
                  <th scope="col">Наличие</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => {
                  return (
                    <tr key={item.goodsID}>
                      <td>{item.number}</td>
                      <td>{item.name}</td>
                      <td>{item.brand} </td>
                      <td>{item.price}</td>
                      <td>{item.count > 0 ? item.count : "Нет в наличии"}</td>
                    </tr>
                  );
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
