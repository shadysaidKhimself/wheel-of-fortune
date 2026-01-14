import React from 'react';
import { useWheelStore } from '../store/wheelStore';

const ConfigPanel: React.FC = () => {
  const { config, updateConfig, status } = useWheelStore();
  
  const isSpinning = status === 'spinning';

  return (
    <div className="config-panel" style={{ opacity: isSpinning ? 0.6 : 1, pointerEvents: isSpinning ? 'none' : 'auto' }}>
      <h3>設定中心</h3>
      
      <div className="config-row">
        <span>自動移除已中獎項</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={config.autoRemove}
            onChange={(e) => updateConfig({ autoRemove: e.target.checked })}
            disabled={isSpinning}
          />
          <span className="slider-round"></span>
        </label>
      </div>


    </div>
  );
};

export default ConfigPanel;
