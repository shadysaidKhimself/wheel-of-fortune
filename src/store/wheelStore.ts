import { create } from 'zustand'
import type { WheelState, SpinConfig } from './types'

interface WheelActions {
  addDraftPrize: (label: string) => void
  updateDraftPrize: (id: string, label: string) => void
  removeDraftPrize: (id: string) => void
  confirmPrizes: () => void
  resetDraft: () => void
  startSpin: () => void
  finishSpin: () => void
  clearHistory: () => void
  updateConfig: (config: Partial<SpinConfig>) => void
  resetStatus: () => void
  clearRecords: () => void
}

export type WheelStore = WheelState & WheelActions

export const useWheelStore = create<WheelStore>((set, get) => ({
  // 1. 狀態集中管理 (Initial State)
  draftPrizes: [],
  prizes: [],
  status: 'idle',
  config: {
    durationMs: 3000,
    autoRemove: true,
  },
  resultPrizeId: null,
  records: [],

  // 3. Actions
  addDraftPrize: (label) =>
    set((state) => ({
      draftPrizes: [
        ...state.draftPrizes,
        { id: Math.random().toString(36).substring(2, 9), label, isDrawn: false },
      ],
    })),

  updateDraftPrize: (id, label) =>
    set((state) => ({
      draftPrizes: state.draftPrizes.map((p) =>
        p.id === id ? { ...p, label } : p
      ),
    })),

  removeDraftPrize: (id) =>
    set((state) => ({
      draftPrizes: state.draftPrizes.filter((p) => p.id !== id),
    })),

  confirmPrizes: () => {
    const { draftPrizes } = get()
    if (draftPrizes.length === 0) return
    set({
      prizes: draftPrizes.map((p) => ({ ...p, isDrawn: false })),
      status: 'ready',
      resultPrizeId: null,
    })
  },

  resetDraft: () => set({ draftPrizes: [] }),

  startSpin: () => {
    const { status, prizes, config } = get()

    // 1. 狀態機檢查：僅允許從 ready 或 result 啟動，防止非法觸發
    if (status !== 'ready' && status !== 'result') return

    // 2. 根據 autoRemove 規則篩選可抽獎池 (Pool)
    // 若為 true，則僅篩選尚未中獎的項目；若為 false，則包含所有獎項
    const pool = config.autoRemove
      ? prizes.filter((p) => !p.isDrawn)
      : prizes

    // 3. 安全中止：若獎池為空（無可抽項目），安全終止抽獎動作，不進入 spinning 狀態
    if (pool.length === 0) return

    // 4. 結果先行：在啟動動畫前，從合法獎池中隨機決定中獎結果
    const randomIndex = Math.floor(Math.random() * pool.length)
    const winner = pool[randomIndex]

    // 5. 狀態同步：切換至 spinning 並注入確定的 resultPrizeId
    set({
      status: 'spinning',
      resultPrizeId: winner.id,
    })
  },

  finishSpin: () => {
    const { resultPrizeId, prizes, records } = get()
    if (!resultPrizeId) return

    const winner = prizes.find((p) => p.id === resultPrizeId)
    if (!winner) return

    const newRecord = {
      id: Math.random().toString(36).substring(2, 9),
      prizeId: winner.id,
      label: winner.label,
      timestamp: Date.now(),
    }

    // 5. finishSpin 僅負責：
    // - 標記中獎項目 isDrawn
    // - 將狀態切換為 "result"
    // - 新增抽獎紀錄
    set({
      prizes: prizes.map((p) =>
        p.id === resultPrizeId ? { ...p, isDrawn: true } : p
      ),
      status: 'result',
      records: [...records, newRecord],
    })
  },

  clearHistory: () =>
    set((state) => ({
      prizes: state.prizes.map((p) => ({ ...p, isDrawn: false })),
      status: 'ready',
      resultPrizeId: null,
      records: [],
    })),

  updateConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),

  resetStatus: () => {
    const { status } = get();
    if (status === 'result') {
      set({ status: 'ready', resultPrizeId: null });
    }
  },

  clearRecords: () => set({ records: [] }),
}))
