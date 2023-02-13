import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";
import { getAllPokemon, getPokemon } from "./utils/pokemon";

function App() {
  //API
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  //ローディングの状態
  const [loading, setLoading] = useState(true);
  //各ポケモンの詳細データ
  const [pokemonData, setPokemonData] = useState([]);
  //次へボタンのURL
  const [nextUrl, setNextUrl] = useState("");
  //前へボタンのURL
  const [prevUrl, setPrevUrl] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);

      //各ポケモンの詳細なデータを取得し、stateのpokemonDataへ格納する
      await loadPokemon(res.results);

      //prev・nextボタンのurlをセット
      setNextUrl(res.next);
      setPrevUrl(res.previous); //null

      //ローディング完了
      setLoading(false);
    };

    fetchPokemonData();
  }, []);

  /**
   * @param {各ポケモンの詳細データ} data
   */
  const loadPokemon = async (data) => {
    //「Promise.all」 全てのデータをfetchし終えるまで。配列を格納する。
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        //各ポケモンの詳細urlを取得する
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  /**
   * 次へボタン
   */
  const handleNextPage = async () => {
    //ローディング開始
    setLoading(true);

    //全てのポケモンデータを取得
    let data = await getAllPokemon(nextUrl);

    //各ポケモンの詳細なデータを取得し、stateのpokemonDataへ格納する
    await loadPokemon(data.results);

    //prev・nextボタンのurlをセット
    setNextUrl(data.next);
    setPrevUrl(data.previous);

    //ローディング完了
    setLoading(false);
  };

  /**
   * 前へボタン
   */
  const handlePrevPage = async () => {
    //初期ロード時はprevがないのでreturnされる
    if (!prevUrl) return;

    //ローディング開始
    setLoading(true);

    //各データを取得し、Cardコンポーネント用に用意
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);

    //prev・nextボタンのurlをセット
    setNextUrl(data.next);
    setPrevUrl(data.previous);

    //ローディング完了
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中です</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {/* 1つ1つのポケモン詳細データをCardコンポーネントへ渡す */}
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
