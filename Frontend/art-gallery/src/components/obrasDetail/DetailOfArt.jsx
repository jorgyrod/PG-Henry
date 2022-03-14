import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getObraDetail,
  getObrasRandon,
  removeUser,
} from "../../redux/actions/actions";
import styles from "./Detail.module.css";
import { AiFillEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import useCart from "../../customHooks/useCart.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../customHooks/useAuth";
import PaintingModal from "../../Modales/EditPainting/PaintingModal";

export const DetailOfArt = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { add, cart, remove } = useCart();

  //Manejo de vista
  const { user } = useAuth();

  useEffect(() => {
    dispatch(getObraDetail(id));
    dispatch(getObrasRandon(id));
  }, [id, dispatch]);

  const { detailObra, obraRandon } = useSelector((state) => state);

console.log(detailObra, "soy dentalle")
  /////////////////////////////////
  const [page, setPage] = useState(1);
  const maximo = 4;

  //Estado para el modal
  const [openModal, setOpenModal] = useState(false);

  const handleIncrement = () => {
    setPage((prev) => Math.min(prev + 1, 3));
  };
  const handleDecrement = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleReturn = () => {
    navigate(-1);
  };

  const handleDetail = (id) => {
    dispatch(getObraDetail(id));
    navigate(`/detailpainting/${id}`);
   
  };

  //Son utilizados para el toastify
  const removeCart = () => {
    remove(parseInt(id));
    toast.success("Paint removed from the cart!");
  };

  const addCart = () => {
    add(parseInt(id));
    toast.success("Painting added to the cart!");
  };

  if (!detailObra || !obraRandon) {
    return <h1>Loading</h1>;
  }
  return (
    <div className={styles.containerDetail}>
      <ToastContainer
        position="bottom-center"
        theme="dark"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <PaintingModal openModal={openModal} setOpenModal={setOpenModal} ObraId={id} />
      <section className={styles.principalSection}>
        <header className={styles.principalSectionTitle}>
          {user.role === "admin" ? (
            <h1>
              {detailObra.title}
              <button
                onClick={() => setOpenModal(true)}
                className={styles.btnHeaderIconDetail}
              >
                <AiFillEdit className={styles.iconHeaderCardDetail} />
              </button>
            </h1>
          ) : (
            <h1>{detailObra.title}</h1>
          )}
        </header>
        <div className={styles.principalSectionInterno}>
          <div className={styles.internoimg}>
            <img src={detailObra.photos[0].url} alt="img" />
          </div>
          <div className={styles.internodescription}>
            <h3>
              <Link to={`/artists/${detailObra.artist.id}`}>
                {detailObra.artist.name}
              </Link>
            </h3>
            <p>
              <span>{detailObra.description}</span>
              <span>Height: {detailObra.height} cm</span>
              <span>Width: {detailObra.width} cm</span>
              <span>Technique: {detailObra.techniques[0].name}</span>

              <span>Orientation: {detailObra.orientation}</span>
              <span>USD$ {detailObra.price}</span>
            </p>
            {user.role !== "admin" ? (
              cart.includes(parseInt(id)) ? (
                <button className={styles.btnCard} onClick={() => removeCart()}>
                  <div className={styles.cardImage}>-</div>
                  <div className={styles.cardText}>REMOVE FROM CART</div>
                </button>
              ) : (
                <button className={styles.btnCard} onClick={() => addCart()}>
                  <div className={styles.cardImage}>+</div>
                  <div className={styles.cardText}>ADD TO CART</div>
                </button>
              )
            ) : (
              <div></div>
            )}
            <div className={styles.btnReturn}>
              <div className={styles.cardImageReturn}>
                <div></div>
              </div>
              <div onClick={handleReturn} className={styles.cardImageReturn}>
                RETURN TO SEARCH
              </div>
            </div>
          </div>
          <div className={styles.btnCars}></div>
        </div>

        <div className={styles.principalSectionObras}>
          <div
            onClick={handleDecrement}
            className={styles.obrasDetailDecrement}
          ></div>
          <div className={styles.obrasDetail}>
            {obraRandon
              ? obraRandon
                  .slice((page - 1) * maximo, (page - 1) * maximo + maximo)
                  .map((obra) => (
                    <div
                      onClick={() => handleDetail(obra.id)}
                      key={obra.id}
                      className={styles.obrasSimilares}
                    >
                      <img src={obra.image} alt="cards" />
                    </div>
                  ))
              : ""}
          </div>
          <div
            onClick={handleIncrement}
            className={styles.obrasDetailIncrement}
          ></div>
        </div>
      </section>
    </div>
  );
};