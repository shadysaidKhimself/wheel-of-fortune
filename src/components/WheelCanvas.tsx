import React, { useMemo } from 'react';
import type { Prize } from '../store/types';

interface WheelCanvasProps {
  prizes: Prize[];
  autoRemove: boolean;
  wheelRotation: number;
  radius: number;
  center: { x: number; y: number };
}

const WheelCanvas: React.FC<WheelCanvasProps> = ({
  prizes,
  autoRemove,
  wheelRotation,
  radius,
  center,
}) => {
  // 1. 計算可見獎項
  const visiblePrizes = useMemo(() => {
    return autoRemove ? prizes.filter((p) => !p.isDrawn) : prizes;
  }, [prizes, autoRemove]);

  // 2. 邊界情況：無獎項
  if (visiblePrizes.length === 0) {
    return (
      <div
        className="wheel-empty-state"
        style={{
          width: radius * 2,
          height: radius * 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: '2px dashed #ddd',
          color: '#888',
          fontSize: '1.2rem',
          backgroundColor: '#f9f9f9'
        }}
      >
        已無可抽獎項
      </div>
    );
  }

  const sliceCount = visiblePrizes.length;
  const sliceAngle = (2 * Math.PI) / sliceCount;

  // 穩定顏色生成器
  const getStableColor = (id: string) => {
    let hash = 0;
    for (let j = 0; j < id.length; j++) {
      hash = id.charCodeAt(j) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 60%)`;
  };

  return (
    <div className="wheel-ui-root" style={{ position: 'relative', width: center.x * 2, height: center.y * 2 }}>
      {/* 指針 */}
      <div
        className="wheel-pointer-icon"
        style={{
          position: 'absolute',
          top: center.y - radius - 20,
          left: center.x,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderTop: '30px solid #333',
          zIndex: 10
        }}
      />

      <svg
        width={center.x * 2}
        height={center.y * 2}
        viewBox={`0 0 ${center.x * 2} ${center.y * 2}`}
      >
        {/* 底盤 */}
        <circle cx={center.x} cy={center.y} r={radius + 5} fill="#333" />

        <g
          transform={`rotate(${wheelRotation}, ${center.x}, ${center.y})`}
          style={{ transition: 'transform 3s cubic-bezier(0.15, 0, 0.15, 1)' }}
        >
          {visiblePrizes.map((prize, i) => {
            const fillColor = getStableColor(prize.id);

            // 處理單一獎項：直接繪製圓形以避免 SVG Arc 路徑重合問題
            if (sliceCount === 1) {
              return (
                <g key={prize.id}>
                  <circle cx={center.x} cy={center.y} r={radius} fill={fillColor} stroke="#FFFFFF" strokeWidth="2" />
                  <text
                    x={center.x}
                    y={center.y - radius * 0.65}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#FFFFFF"
                    style={{ fontSize: '21px', fontWeight: '900', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            }

            // 處理多個獎項
            const canvasOffset = -Math.PI / 2 - sliceAngle / 2;
            const startAngle = i * sliceAngle + canvasOffset;
            const endAngle = (i + 1) * sliceAngle + canvasOffset;

            const x1 = center.x + radius * Math.cos(startAngle);
            const y1 = center.y + radius * Math.sin(startAngle);
            const x2 = center.x + radius * Math.cos(endAngle);
            const y2 = center.y + radius * Math.sin(endAngle);

            const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
            const pathData = `M ${center.x} ${center.y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const textAngleCenter = startAngle + sliceAngle / 2;
            const textX = center.x + radius * 0.65 * Math.cos(textAngleCenter);
            const textY = center.y + radius * 0.65 * Math.sin(textAngleCenter);
            const textRotationDeg = (textAngleCenter * 180) / Math.PI + 90;

            return (
              <g key={prize.id}>
                <path d={pathData} fill={fillColor} stroke="#FFFFFF" strokeWidth="2" />
                <text
                  x={textX}
                  y={textY}
                  transform={`rotate(${textRotationDeg}, ${textX}, ${textY})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#FFFFFF"
                  style={{ fontSize: '21px', fontWeight: '900', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  {prize.label}
                </text>
              </g>
            );
          })}
          
          {/* 中心圓點 */}
          <circle cx={center.x} cy={center.y} r="12" fill="#333" stroke="#FFF" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};

export default WheelCanvas;
