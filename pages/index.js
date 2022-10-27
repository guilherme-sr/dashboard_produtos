import { Select, MenuItem, InputLabel } from "@mui/material";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import MainChart from "../components/MainChart.js";

export default function Home() {
  // Declarações de estados
  const [categoriesAvailable, setCategoriesAvailable] = useState();
  const [productsAvailable, setProductsAvailable] = useState();
  const [brandAvailable, setBrandAvailable] = useState();
  const [chartData, setChartData] = useState([]);
  const [globalData, setGlobalData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Busca dados na API ao carregar a página
  useEffect(() => {
    fetch("/api/products-stats")
      .then((res) => res.json())
      .then((data) => {
        setGlobalData(data);
        setCategoriesAvailable(Object.keys(data));
      });
  }, []);

  // Define o dado que o gráfico exibe
  useEffect(() => {
    if (selectedCategory && selectedProduct && selectedBrand) {
      setChartData(
        globalData[selectedCategory][selectedProduct][selectedBrand]
      );
    }
  }, [selectedBrand]);

  // Executa quando a categoria for alterada
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setProductsAvailable(Object.keys(globalData[value]));
    setSelectedProduct(Object.keys(globalData[value])[0]);
    setBrandAvailable(
      Object.keys(globalData[value][Object.keys(globalData[value])[0]])
    );
    setSelectedBrand(
      Object.keys(globalData[value][Object.keys(globalData[value])[0]])[0]
    );
  };

  // Executa quando o produto for alterado
  const handleProductChange = (value) => {
    setSelectedProduct(value);
    setBrandAvailable(Object.keys(globalData[selectedCategory][value]));
    setSelectedBrand(Object.keys(globalData[selectedCategory][value])[0]);
  };

  // Executa quando a marca for alterada
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
  };

  // Dados de configuração do gráfico
  const data = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
    datasets: [
      {
        label: "Vendas",
        data: chartData,
        backgroundColor: ["#10b981"],
        borderColor: ["black"],
        borderWidth: 1.5,
        borderRadius: 10,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <>
      <div>
        <div className="flex flex-row w-full bg-emerald-500 text-white px-5 py-3 font-semibold text-lg">
          <div className="flex flex-row w-1/2">
            <Image src="/menu.svg" width="28" height="28"></Image>Menu
          </div>
          <div className="flex flex-row justify-end w-full">
            <Image src="/user.svg" width="20" height="20"></Image> Usuário
          </div>
        </div>
        <div className="m-auto w-52 h-10 border-x-2 border-b-2 rounded-br-xl rounded-bl-xl border-emerald-500 flex justify-center items-center">
          <span className="text-xl">Relatório de Vendas</span>
        </div>
      </div>
      <div>
        <div className="flex md:flex-row flex-col w-ful font-semibold text-lg w-full p-10 align-middle justify-evenly items-center">
          <div className="m-5">
            <InputLabel id="product_label">Categoria: </InputLabel>
            <Select
              className="h-4/6 w-52 rounded-xl"
              labelId="product_label"
              onChange={(e) => handleCategoryChange(e.target.value)}
              value={selectedCategory}
            >
              {categoriesAvailable &&
                categoriesAvailable.map((cat, i) => (
                  <MenuItem key={`${cat}+${i}`} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
            </Select>
          </div>
          <div className="m-5">
            <InputLabel id="product_label">Produto: </InputLabel>
            <Select
              className="h-4/6 w-52 rounded-xl"
              labelId="product_label"
              onChange={(e) => handleProductChange(e.target.value)}
              value={selectedProduct}
              disabled={!productsAvailable}
            >
              {productsAvailable &&
                productsAvailable.map((prod, i) => (
                  <MenuItem key={prod} value={prod}>
                    {prod}
                  </MenuItem>
                ))}
            </Select>
          </div>
          <div className="m-5">
            <InputLabel id="brand_label">Marca: </InputLabel>
            <Select
              className="h-4/6 w-52 rounded-xl"
              labelId="brand_label"
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              disabled={!brandAvailable}
            >
              {brandAvailable &&
                brandAvailable.map((brand, i) => (
                  <MenuItem key={`${brand}+${i}`} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="md:p-24 p-3">
        <MainChart data={data} options={options}></MainChart>
      </div>
    </>
  );
}
