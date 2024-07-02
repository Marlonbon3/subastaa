import {
  getDoc,
  updateDoc,
  doc,
  Timestamp,
  deleteField,
} from "firebase/firestore";
import { db } from "./config";
import yaml from "js-yaml";
import { formatField } from "../utils/formatString";

// Parsear el campo para obtener el item y la oferta
const parseField = (key) => {
  const match = key.match(/item(\d+)_bid(\d+)/);
  return {
    item: Number(match[1]),
    bid: Number(match[2]),
  };
};

// Desanidar los items del documento
export const unflattenItems = (doc, demo) => {
  let items = {};
  for (const [key, value] of Object.entries(doc.data())) {
    const { item, bid } = parseField(key);

    if (!(item in items)) items[item] = { bids: {} };

    if (bid === 0) {
      const { amount, endTime, ...itemData } = value;
      const endTimeDate = new Date(endTime);
      items[item] = { ...items[item], ...itemData, startingPrice: amount, endTime: endTimeDate }

      if (demo) {
        const now = new Date();
        items[item].endTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes() + items[item].endTime.getMinutes(),
          items[item].endTime.getSeconds()
        );
      }
    } else {
      items[item].bids[bid] = value;
    }
  }
  return Object.values(items);
};

// Editar items en la base de datos
export const editItems = (id = undefined, updateItems = false, deleteBids = false) => {
  fetch(import.meta.env.BASE_URL + "items.yml")
    .then((response) => response.text())
    .then((text) => yaml.load(text))
    .then((items) => {
      // Si se proporciona un ID, coloca ese item en un array por sí mismo
      if (id !== undefined) items = [items.find((item) => item.id === id)];

      // Hacer que el usuario confirme si quiere editar items
      let action = updateItems ? 'update item data' : (deleteBids ? 'delete all bids' : '');
      let item = id === undefined ? 'all items' : `item ${id}`;
      if (confirm(`You are about to ${action} for ${item}, are you sure?`) == false) {
        return;
      }

      const docRef = doc(db, "auction", "items");
      getDoc(docRef)
        .then((doc) => {
          console.debug("editItems() read from auction/items");
          let fields = Object.keys(doc.data());
          if (fields.length === 0)
            fields = items.map((item) => formatField(item.id, 0));
          const updates = {};
          items.forEach((newItem) => {
            // Convertir fecha ISO en Firestore Timestamp
            newItem.endTime = Timestamp.fromDate(new Date(newItem.endTime));
            // Filtrar campos para los que corresponden al nuevo item
            fields
              .filter((field) => parseField(field).item === newItem.id)
              .forEach((field) => {
                if (updateItems && parseField(field).bid === 0)
                  updates[field] = newItem;
                if (deleteBids && parseField(field).bid)
                  updates[field] = deleteField();
              });
          });
          return updates;
        })
        .then((updates) => {
          updateDoc(docRef, updates);
          console.debug("editItems() write to from auction/items");
        });
    });
};