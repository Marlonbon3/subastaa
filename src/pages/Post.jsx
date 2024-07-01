import React, { useState } from 'react';
import { getDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config"
import yaml from "js-yaml";

// Función para parsear el campo y extraer item y bid
const parseField = (key) => {
  const match = key.match(/item(\d+)_bid(\d+)/);
  return {
    item: Number(match[1]),
    bid: Number(match[2]),
  };
};

const Post = () => {
  const [formData, setFormData] = useState({
    primaryImage: '',
    title: '',
    subtitle: '',
    detail: '',
    secondaryImage: '',
    amount: '',
    endTime: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      primaryImage: formData.primaryImage,
      title: formData.title,
      subtitle: formData.subtitle,
      detail: formData.detail,
      secondaryImage: formData.secondaryImage,
      currency: "$", // Siempre será $
      amount: parseFloat(formData.amount),
      endTime: formData.endTime,
    };

    const docRef = doc(db, "auction", "items");

    getDoc(docRef)
      .then((doc) => {
        const fields = Object.keys(doc.data());
        const updates = {};

        // Encontrar el ID disponible más alto y sumarle 1
        const nextId = Math.max(...fields.map(field => parseField(field).item)) + 1;

        // Añadir el nuevo artículo al documento
        updates[`item${nextId}_bid0`] = newItem;

        return updates;
      })
      .then((updates) => {
        updateDoc(docRef, updates);
        console.debug("Artículo añadido a Firestore");
        alert("Artículo añadido correctamente");
        // Limpiar el formulario después de enviar
        setFormData({
          primaryImage: '',
          title: '',
          subtitle: '',
          detail: '',
          secondaryImage: '',
          amount: '',
          endTime: '',
        });
      })
      .catch((error) => {
        console.error("Error al añadir artículo: ", error);
        alert("Hubo un error al añadir el artículo. Por favor, intenta nuevamente.");
      });
  };

  return (
    <div className="container">
      <h1 className="my-4">Postear Artículo para Subastar</h1>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="primaryImage" className="form-label">URL de la imagen principal:</label>
              <input
                type="text"
                className="form-control"
                id="primaryImage"
                name="primaryImage"
                value={formData.primaryImage}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="title" className="form-label">Título:</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="subtitle" className="form-label">Subtítulo:</label>
              <input
                type="text"
                className="form-control"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="detail" className="form-label">Detalle:</label>
              <textarea
                className="form-control"
                id="detail"
                name="detail"
                rows="4"
                value={formData.detail}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="secondaryImage" className="form-label">URL de la imagen secundaria:</label>
              <input
                type="text"
                className="form-control"
                id="secondaryImage"
                name="secondaryImage"
                value={formData.secondaryImage}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Precio inicial:</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">Fecha y hora de finalización:</label>
              <input
                type="datetime-local"
                className="form-control"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">Postear Artículo</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
