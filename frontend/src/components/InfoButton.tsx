import React, { useState } from 'react';
import Modal from './Modal';

interface InfoButtonProps {
  content: string;
}

const InfoButton: React.FC<InfoButtonProps> = ({ content }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="info-button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Ver información"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          width="24" 
          height="24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="info-content">
          <h3>Descripción del Problema</h3>
          <p>{content}</p>
        </div>
      </Modal>
    </>
  );
};

export default InfoButton;
