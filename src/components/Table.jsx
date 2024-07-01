import { useContext, useMemo } from "react";
import { Row } from "./Row";
import { ItemsContext } from "../contexts/ItemsProvider";
import Chart from "./Chart";

const Table = () => {
  const { items } = useContext(ItemsContext);

  const topItems = useMemo(() => {
    return items
      .filter(item => item.bids && Object.keys(item.bids).length > 0)  // Filtra items con más de 0 pujas
      .sort((a, b) => Object.keys(b.bids).length - Object.keys(a.bids).length)  // Ordena por número de pujas
      .slice(0, 5);  // Toma los primeros 5
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
            <th>Actions</th>
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
        <Chart data={topItems} />
      </div>
    </>
  );
};

export default Table;
