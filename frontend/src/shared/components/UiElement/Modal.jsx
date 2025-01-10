import ReactDOM from "react-dom";
import "./Modal.css";
import Backdrop from "./Backdrop";
import { motion, AnimatePresence } from "framer-motion";

const ModalOverlay = (props) => {
  const content = (
    <AnimatePresence>
      {props.show && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`modal ${props.className}`}
          style={props.style}
        >
          <header className={`modal__header ${props.headerClass}`}>
            <h2>{props.header}</h2>
          </header>
          <form
            onSubmit={
              props.onSubmit
                ? props.onSubmit
                : (event) => event.preventDefault()
            }
          >
            <div className={`modal__content ${props.contentClass}`}>
              {props.children}
            </div>
          </form>
          <footer className={`modal__footer ${props.footerClass}`}>
            {props.footer}
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <ModalOverlay {...props} />
    </>
  );
};

export default Modal;
