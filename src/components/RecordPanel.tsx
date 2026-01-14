import React from 'react';
import { useWheelStore } from '../store/wheelStore';

const RecordPanel: React.FC = () => {
  const { records, clearRecords } = useWheelStore();

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="record-panel">
      <div className="record-header">
        <h3>抽獎紀錄</h3>
        <button 
          className="btn-text" 
          onClick={clearRecords}
          disabled={records.length === 0}
        >
          清除
        </button>
      </div>

      <div className="record-list">
        {records.length === 0 ? (
          <div className="record-empty">暫無紀錄</div>
        ) : (
          records.slice().reverse().map((record) => (
            <div key={record.id} className="record-item">
              <span className="record-label">{record.label}</span>
              <span className="record-time">{formatTime(record.timestamp)}</span>
            </div>
          ))
        )}
      </div>

      <style>{`
        .record-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          border-left: 1px solid rgba(0, 0, 0, 0.1);
          padding: 1.5rem 1rem;
        }

        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 0 0.5rem;
        }

        .record-header h3 {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05rem;
        }

        .btn-text {
          background: none;
          border: none;
          color: #007aff;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .btn-text:hover:not(:disabled) {
          background: rgba(0, 122, 255, 0.1);
        }

        .btn-text:disabled {
          color: #ccc;
          cursor: not-allowed;
        }

        .record-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .record-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .record-item:hover {
          background: rgba(0, 0, 0, 0.04);
        }

        .record-label {
          font-weight: 500;
          color: #333;
          font-size: 0.95rem;
        }

        .record-time {
          font-size: 0.75rem;
          color: #999;
          font-family: monospace;
        }

        .record-empty {
          text-align: center;
          color: #bbb;
          font-size: 0.85rem;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};

export default RecordPanel;
