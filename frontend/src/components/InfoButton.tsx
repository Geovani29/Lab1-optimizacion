import React, { useState } from 'react';
import Modal from './Modal';

interface InfoButtonProps {
  content: string;
}

const InfoButton: React.FC<InfoButtonProps> = ({ content }: InfoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="info-button"
        onClick={() => setIsOpen(true)}
        title="Ver información del problema"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="info-content">
          <h3>Descripción del Problema</h3>
          <p>{content}</p>
        </div>
      </Modal>
    </>
  );
};

export default InfoButton;
