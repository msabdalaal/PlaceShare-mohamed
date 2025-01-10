import "./SideDrawer.css";
import { motion, AnimatePresence } from "framer-motion";
import ReactDom from "react-dom";
const SideDrawer = (props) => {
  let content = (
    <AnimatePresence>
      {props.isShow && (
        <motion.aside
          onClick={props.click}
          className="side-drawer"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {props.children}
        </motion.aside>
      )}
    </AnimatePresence>
  );
  return ReactDom.createPortal(content, document.getElementById("back-hook"));
};

export default SideDrawer;
