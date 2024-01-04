import React from 'react';
import "./LoginModal.css"

const Modal = ({ isOpen, onClose, children }) => {
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          {children}<br/>
          <button onClick={onClose}>확인</button>
        </div>
      </div>
    )
  );
};

export default Modal;