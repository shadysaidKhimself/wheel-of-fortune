import React, { useState, useEffect } from 'react';
import { useWheelStore } from '../store/wheelStore';

const ResultModal: React.FC = () => {
  const { status, resultPrizeId, prizes } = useWheelStore();
  const [isOpen, setIsOpen] = useState(false);

  // 當狀態切換到 result 時，開啟 Modal
  useEffect(() => {
    if (status === 'result' && !isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    }
  }, [status, isOpen]);

  if (status !== 'result' || !isOpen || !resultPrizeId) return null;

  const winner = prizes.find((p) => p.id === resultPrizeId);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        style={{
          backgroundColor: '#fff',
          padding: '2.5rem',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          maxWidth: '80%',
          width: '400px'
        }}
      >
        <h2 style={{ margin: '0 0 1rem 0', color: '#333' }}>中獎結果</h2>
        
        <div 
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#ff6b6b',
            margin: '1.5rem 0',
            wordBreak: 'break-all'
          }}
        >
          {winner?.label || '未知獎項'}
        </div>

        <button
          onClick={() => setIsOpen(false)}
          style={{
            marginTop: '1rem',
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            backgroundColor: '#34c759',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          確認
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
