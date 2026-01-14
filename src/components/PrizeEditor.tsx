import React from 'react';
import { useWheelStore } from '../store/wheelStore';

const PrizeEditor: React.FC = () => {
  const { draftPrizes, addDraftPrize, updateDraftPrize, removeDraftPrize, confirmPrizes, status } = useWheelStore();
  
  const isSpinning = status === 'spinning';

  return (
    <div className="prize-editor" style={{ pointerEvents: isSpinning ? 'none' : 'auto', opacity: isSpinning ? 0.6 : 1 }}>
      <h3>獎項編輯器</h3>
      <div className="prize-list">
        {draftPrizes.map((prize) => (
          <div key={prize.id} className="prize-item">
            <input
              type="text"
              value={prize.label}
              onChange={(e) => updateDraftPrize(prize.id, e.target.value)}
              placeholder="獎項名稱"
              disabled={isSpinning}
            />
            <button
              className="btn btn-danger"
              onClick={() => removeDraftPrize(prize.id)}
              disabled={isSpinning}
            >
              刪除
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          className="btn btn-primary"
          onClick={() => addDraftPrize('')}
          disabled={isSpinning}
        >
          新增獎項
        </button>
        <button
          className="btn btn-success"
          style={{ fontSize: '1rem', padding: '0.6rem 1.2rem' }}
          onClick={confirmPrizes}
          disabled={isSpinning || draftPrizes.length === 0}
        >
          儲存並更新轉盤
        </button>
      </div>
    </div>
  );
};

export default PrizeEditor;
