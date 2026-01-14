import React from 'react';
import { useWheelStore } from '../store/wheelStore';

const SpinControls: React.FC = () => {
  const { status, startSpin } = useWheelStore();

  return (
    <div className="spin-controls" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <button
        className="btn btn-success"
        onClick={startSpin}
        disabled={status === 'spinning' || status === 'idle'}
      >
        {status === 'spinning' ? '啟動中...' : '開始抽獎'}
      </button>
    </div>
  );
};

export default SpinControls;
