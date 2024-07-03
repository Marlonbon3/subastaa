import React from 'react';
import { getDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config"

const MyAuctionsPage = () => {
  return (
    <div>
      <h1>My Auctions</h1>
    </div>
  );
};

export default MyAuctionsPage;