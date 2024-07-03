import React, { useContext, useMemo } from "react";
import { Row } from "./Row";
import { ItemsContext } from "../contexts/ItemsProvider";
import Chart from "./Chart";
import Chart2 from "./Chart2";

const Table = () => {
  const { items } = useContext(ItemsContext);

  // Filtra y ordena los items por la cantidad de bids de mayor a menor para Chart
  const topItems = useMemo(() => {
    return items
      .filter(item => item.bids && Object.keys(item.bids).length > 0)  // Filtra items con más de 0 pujas
      .sort((a, b) => Object.keys(b.bids).length - Object.keys(a.bids).length)  // Ordena por número de pujas de mayor a menor
      .slice(0, 5);  // Toma los primeros 5
  }, [items]);

  // Filtra y ordena los items por la cantidad de bids de menor a mayor para Chart2
  const bottomItems = useMemo(() => {
    return items
      .filter(item => item.bids && Object.keys(item.bids).length > 0)  // Filtra items con más de 0 pujas
      .sort((a, b) => Object.keys(a.bids).length - Object.keys(b.bids).length)  // Ordena por número de pujas de menor a mayor
      .slice(0, 5)  // Toma los primeros 5
      .reverse(); // Invierte el orden para mostrar de menor a mayor
  }, [items]);

  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Bids</th>
            <th>Winning</th>
            <th>Time Left</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </tbody>
      </table>
      <div className="mt-5">
        <h3>Top 5 Items by Bids</h3>
        <Chart data={topItems} /> {/* Utiliza la gráfica original para los topItems */}
      </div>
      <div className="mt-5">
        <h3>Bottom 5 Items by Bids</h3>
        <Chart2 data={bottomItems} /> {/* Utiliza Chart2 para los bottomItems */}
      </div>
    </>
  );
};

export default Table;
