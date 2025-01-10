import ReactDOM from 'react-dom';

import './Backdrop.css';

const Backdrop =({click}) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={click}></div>,
    document.getElementById('back-ground')
  );
};

export default Backdrop;