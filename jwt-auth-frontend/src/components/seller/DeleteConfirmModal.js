import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  if (!isOpen) return null;

  return (
    <div className="ch-modal-backdrop" onClick={onClose}>
      <div className="ch-modal-box">
        <div className="ch-modal-title">Delete This Order?</div>
        <p className="ch-modal-desc">Are you sure you want to permanently delete this cancelled order? This action cannot be undone.</p>
        <div className="ch-modal-actions">
          <button className="ch-btn-neutral" onClick={onClose}>Cancel</button>
          <button className="ch-btn-danger" onClick={() => onConfirm(orderId)}>Delete Order</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

