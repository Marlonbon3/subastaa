import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { itemStatus } from "../utils/itemStatus";
import { formatField, formatMoney } from "../utils/formatString";
import { updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { ModalsContext } from "../contexts/ModalsProvider";
import { ModalTypes } from "../utils/modalTypes";
import PaypalButton from "./Paypalbutton";
const Modal = ({ type, title, children }) => {
  const { closeModal, currentModal } = useContext(ModalsContext);
  if (type !== currentModal) return null;
  return ReactDOM.createPortal(
    <div className="modal fade show" style={{ display: "block" }} onClick={closeModal}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button className="btn-close" onClick={closeModal} />
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
Modal.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};
const ItemModal = () => {
  const { activeItem, openModal, closeModal } = useContext(ModalsContext);
  const [secondaryImageSrc, setSecondaryImageSrc] = useState("");
  const minIncrease = 1;
  const maxIncrease = 10;
  const [bid, setBid] = useState("");
  const [valid, setValid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [minBid, setMinBid] = useState("-.--");
  const [topBidders, setTopBidders] = useState([]);
  const [auctionEnded, setAuctionEnded] = useState(false);

 /*  useEffect(() => {
    if (activeItem.secondaryImage === undefined) return;
    try {
      const src = require(`../assets/${activeItem.secondaryImage}.png`);
      setSecondaryImageSrc(src.default);
    } catch (error) {
      console.error("Failed to load image", error);
    }
  }, [activeItem.secondaryImage]); */

  useEffect(() => {
    const status = itemStatus(activeItem);
    setMinBid(formatMoney(activeItem.currency, status.amount + minIncrease));
    setTopBidders(status.topBidders);
  }, [activeItem]);
  
  const delayedClose = () => {
    setTimeout(() => {
      closeModal();
      setFeedback("");
      setValid("");
    }, 1000);
  };
  const handleSubmitBid = async () => {
    let nowTime = new Date().getTime();
    setIsSubmitting(true);
    if (activeItem.endTime - nowTime < 0) {
      setFeedback("Sorry, this item has ended!");
      setValid("is-invalid");
      delayedClose();
      setIsSubmitting(false);
      return;
    }
    if (auth.currentUser.displayName == null) {
      setFeedback("You must provide a username before bidding!");
      setValid("is-invalid");
      setTimeout(() => {
        openModal(ModalTypes.SIGN_UP);
        setIsSubmitting(false);
        setValid("");
      }, 1000);
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(bid)) {
      setFeedback("Please enter a valid monetary amount!");
      setValid("is-invalid");
      setIsSubmitting(false);
      return;
    }
    const amount = parseFloat(bid);
    const status = itemStatus(activeItem);
    if (amount < status.amount + minIncrease) {
      setFeedback("You did not bid enough!");
      setValid("is-invalid");
      setIsSubmitting(false);
      return;
    }
    if (amount > status.amount + maxIncrease) {
      setFeedback(`For the demo you can only increase the price up to ${activeItem.currency}${maxIncrease} per bid.`);
      setValid("is-invalid");
      setIsSubmitting(false);
      return;
    }
    await updateDoc(doc(db, "auction", "items"), {
      [formatField(activeItem.id, status.bids + 1)]: {
        amount,
        uid: auth.currentUser.uid,
      },
    });
    console.debug("handleSubmitBid() write to auction/items");
    setValid("is-valid");
    delayedClose();
  };
  const handleChange = (e) => {
    setBid(e.target.value);
    setIsSubmitting(false);
    setValid("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSubmitBid();
    }
  };
  const [bidderNames, setBidderNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const names = await Promise.all(
          topBidders.map(async (bidder) => {
            const userDoc = await getDoc(doc(db, 'users', bidder.uid));
            if (userDoc.exists) {
              return userDoc.data().name; // Asume que el nombre del usuario está almacenado en el campo 'name'
            } else {
              return bidder.uid; // Retorna el UID si no se encuentra el documento
            }
          })
        );
        const uniqueNames = [...new Set(names)];
        setBidderNames(uniqueNames);
      } catch (error) {
        console.error("Failed to fetch user names", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserNames();
  }, [topBidders]);

  const [preciofinal, setPreciofinal] = useState()
useEffect(() => {
  if (topBidders[0]?.amount) {
    setPreciofinal(topBidders[0].amount);
  }
}, [topBidders]);
let nowTime = new Date().getTime();


  return (
    <Modal type={ModalTypes.ITEM} title={activeItem.title}>
      <div className="modal-body">
        <p>{activeItem.detail}</p>
        <img src={activeItem.primaryImage} className="img-fluid" alt={activeItem.title} />
        <div className="top-bidders">
          <h6>Top 3 Bidders:</h6>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {bidderNames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
              {activeItem.endTime - nowTime < 0 && (
            <div>
              <p>FELICIDADES ERES EL GANADOR DE ESTA SUBASTA, REALIZA EL PAGO CON EL VENDEDOR</p>
            <PaypalButton totalValue={preciofinal} invoice={activeItem.title}/>
            </div>
          )}
            </ul>
          )}
        </div>
      </div>
      <div className="modal-footer justify-content-start">
        <div className="input-group mb-2">
          <span className="input-group-text">{activeItem.currency}</span>
          <input
            className={`form-control ${valid}`}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmitBid}
            disabled={isSubmitting}
          >
            Submit bid
          </button>
          <div className="invalid-feedback">{feedback}</div>
        </div>
        <label className="form-label">Enter {minBid} or more</label>
        <p className="text-muted">(This is just a demo, you're not bidding real money)</p>
      </div>
    </Modal>
  );
};
const SignUpModal = () => {
  const { closeModal } = useContext(ModalsContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [valid, setValid] = useState("");
  const [error, setError] = useState("");
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setValid("is-invalid");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await setDoc(doc(db, "users", user.uid), { name: username, email, admin: "" });
      console.debug(`signUp() write to users/${user.uid}`);
      setValid("is-valid");
      setTimeout(() => {
        closeModal();
        setValid("");
      }, 1000);
    } catch (error) {
      setError(error.message);
      setValid("is-invalid");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSignUp();
    }
  };
  return (
    <Modal type={ModalTypes.SIGN_UP} title="Sign up for Markatplace Auction">
      <div className="modal-body">
        <p>
          We use anonymous authentication. Provide a unique username that we will display
          alongside your bids. If you win an auction, we will use your email to contact you.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${valid}`}
              id="username"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${valid}`}
              id="email"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="email">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${valid}`}
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${valid}`}
              id="confirmPassword"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="invalid-feedback">{error}</div>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>

      </div>
    </Modal>
  );
};
const LoginModal = () => {
  const { closeModal } = useContext(ModalsContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.debug(`signIn() user: ${auth.currentUser.displayName}`);
      setValid("is-valid");
      setTimeout(() => {
        closeModal();
        setValid("");
      }, 1000);
    } catch (error) {
      setError(error.message);
      setValid("is-invalid");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  return (
    <Modal type={ModalTypes.LOG_IN} title="Log in to Markatplace Auction">
      <div className="modal-body">
        <p>
          If you have an account with us, log in using your email address and password.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${valid}`}
              id="email"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="email">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${valid}`}
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="password">Password</label>
            <div className="invalid-feedback">{error}</div>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleLogin}>
            Log In
          </button>
        </form>
      </div>
    </Modal>
  );
};

export { ItemModal, SignUpModal, LoginModal };