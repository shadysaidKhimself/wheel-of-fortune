import React from 'react';
import '../styles/App.css';
import WheelCanvas from '../components/WheelCanvas';
import PrizeEditor from '../components/PrizeEditor';
import SpinControls from '../components/SpinControls';
import ConfigPanel from '../components/ConfigPanel';
import ResultModal from '../components/ResultModal';
import RecordPanel from '../components/RecordPanel';
import { useWheelStore } from '../store/wheelStore';

const App: React.FC = () => {
  const { prizes, resultPrizeId, status, config, finishSpin } = useWheelStore();
  
  // 為了符合 UI 元件「禁止自行新增 state」的原則，我們在 App 層級管理表演的角度
  const [wheelRotation, setWheelRotation] = React.useState(0);

  // Mobile 專用介面狀態
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isRecordsOpen, setIsRecordsOpen] = React.useState(false);

  // 抽獎演出控制器：結果由 Store 決定，App 負責規劃表演路徑
  React.useEffect(() => {
    if (status === 'spinning' && resultPrizeId) {
      // 1. 取得當前可見獎項（與 UI 邏輯一致）
      const visiblePrizes = config.autoRemove ? prizes.filter(p => !p.isDrawn) : prizes;
      const index = visiblePrizes.findIndex(p => p.id === resultPrizeId);
      
      if (index !== -1) {
        const sliceAngleDeg = 360 / visiblePrizes.length;
        const extraSpins = 5; // 基本轉 5 圈

        // 2. 計算目標旋轉度數，確保 index 落地時指針在 12 點鐘方向
        // 由於 WheelCanvas 內部將 index 0 置中，我們只需要減去 index * sliceAngle
        setWheelRotation((prev) => {
          const nextBase = Math.ceil(prev / 360) * 360;
          return nextBase + (extraSpins * 360) - (index * sliceAngleDeg);
        });

        // 3. 同步動畫時長，動畫結束後觸發 Store 結算
        const timer = setTimeout(() => {
          finishSpin();
        }, config.durationMs);
        
        return () => clearTimeout(timer);
      }
    }
  }, [status, resultPrizeId, config.durationMs, config.autoRemove, prizes, finishSpin]); // Added finishSpin to dependencies

  return (
    <div className="app-container">
      {/* Mobile Drawer 遮罩 */}
      <div className={`overlay ${isDrawerOpen ? 'active' : ''}`} onClick={() => setIsDrawerOpen(false)} />

      <header>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎡 幸運大轉盤</h1>
      </header>
      
      <main className="main-content">
        {/* 左側面板：Mobile 下為 Drawer */}
        <section className={`left-panel ${isDrawerOpen ? 'open' : ''}`}>
          <div className="mobile-only" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn-text" onClick={() => setIsDrawerOpen(false)}>✕ 關閉</button>
          </div>
          <ConfigPanel />
          <PrizeEditor />
        </section>

        {/* 中央面板：優先顯示 */}
        <section className="center-panel">
          {/* 使用符合最新規範的受控組件 */}
          <WheelCanvas 
            prizes={prizes}
            autoRemove={config.autoRemove}
            wheelRotation={wheelRotation}
            radius={200}
            center={{ x: 250, y: 250 }}
          />
          <SpinControls />

          {/* Mobile 專用觸發列 */}
          <div className="mobile-controls mobile-only">
            <button className="btn btn-mobile-secondary" onClick={() => setIsDrawerOpen(true)}>
              ⚙️ 設定項目
            </button>
            <button className="btn btn-mobile-secondary" onClick={() => setIsRecordsOpen(!isRecordsOpen)}>
              📜 {isRecordsOpen ? '隱藏紀錄' : '查看紀錄'}
            </button>
          </div>
        </section>

        {/* 右側面板：Mobile 下為折疊區 */}
        <section className={`right-panel ${isRecordsOpen ? 'expanded' : ''}`}>
          <RecordPanel />
        </section>
      </main>

      <ResultModal />
    </div>
  );
};

export default App;
