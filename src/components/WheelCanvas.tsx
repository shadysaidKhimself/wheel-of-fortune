import React, { useMemo } from 'react';
import type { Prize } from '../store/types';

interface WheelCanvasProps {
  prizes: Prize[];
  autoRemove: boolean;
  wheelRotation: number;
  durationMs: number;
  radius: number;
  center: { x: number; y: number };
}

const WheelCanvas: React.FC<WheelCanvasProps> = ({
  prizes,
  autoRemove,
  wheelRotation,
  durationMs,
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
          width: '100%',
          maxWidth: radius * 2,
          aspectRatio: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: '2px dashed #ddd',
          color: '#888',
          fontSize: '1.2rem',
          backgroundColor: '#f9f9f9',
          margin: '0 auto'
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

  const viewBoxSize = center.x * 2;

  return (
    <div 
      className="wheel-ui-root" 
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: viewBoxSize,
        margin: '0 auto',
        aspectRatio: '1/1'
      }}
    >
      {/* 指針：現在使用 SVG 坐標系以確保縮放時位置不偏移 */}
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* 背景底盤 */}
        <circle cx={center.x} cy={center.y} r={radius + 5} fill="#333" />

        {/* 轉盤主體 */}
        <g
          style={{ 
            transform: `rotate(${wheelRotation}deg)`,
            WebkitTransform: `rotate(${wheelRotation}deg)`,
            transformOrigin: `${center.x}px ${center.y}px`,
            transition: `transform ${durationMs}ms cubic-bezier(0.15, 0, 0.15, 1)`,
            WebkitTransition: `-webkit-transform ${durationMs}ms cubic-bezier(0.15, 0, 0.15, 1)`,
            willChange: 'transform'
          }}
        >
          {visiblePrizes.map((prize, i) => {
            const fillColor = getStableColor(prize.id);

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
          
          <circle cx={center.x} cy={center.y} r="12" fill="#333" stroke="#FFF" strokeWidth="3" />
        </g>

        {/* 頂部指針 (不隨旋轉移動) */}
        <path 
          d={`M ${center.x - 15} ${center.y - radius - 20} L ${center.x + 15} ${center.y - radius - 20} L ${center.x} ${center.y - radius + 10} Z`}
          fill="#333"
          stroke="#FFF"
          strokeWidth="1"
          style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}
        />
      </svg>
    </div>
  );
};

export default WheelCanvas;
