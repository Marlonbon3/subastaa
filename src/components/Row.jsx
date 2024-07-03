import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { formatTime, formatMoney } from "../utils/formatString";
import { itemStatus } from "../utils/itemStatus";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { editItems } from "../firebase/utils";
export const Row = ({ item }) => {
  const [amount, setAmount] = useState(item.startingPrice);
  const [bids, setBids] = useState(0);
  const [winner, setWinner] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const status = itemStatus(item);
    setAmount(formatMoney(item.currency, status.amount));
    setBids(status.bids);
    if (status.winner) {
      getDoc(doc(db, "users", status.winner)).then((user) => {
        setWinner(user.get("name"));
      });
    } else {
      setWinner("");
    }
  }, [item]);
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = item.endTime - now;
      if (remaining > 0) {
        setTimeLeft(formatTime(remaining));
        requestAnimationFrame(updateTimer);
      } else {
        setTimeLeft("Item Ended");
      }
    };
    requestAnimationFrame(updateTimer);
  }, [item.endTime]);
  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.title}</td>
      <td>{amount}</td>
      <td>{item.bids ? Object.keys(item.bids).length : 0}</td>
      <td>{winner}</td>
      <td>{timeLeft}</td>
      
    </tr>
  );
};
Row.propTypes = {
  item: PropTypes.shape({
    startingPrice: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    endTime: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    bids: PropTypes.object, // Asegúrate de que bids esté definido y sea un objeto
  }).isRequired,
};