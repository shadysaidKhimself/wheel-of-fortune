export type Prize = {
  id: string
  label: string
  isDrawn: boolean
}

export type SpinConfig = {
  durationMs: number
  autoRemove: boolean
}

export type SpinStatus = "idle" | "ready" | "spinning" | "result"

export type DrawRecord = {
  id: string
  prizeId: string
  label: string
  timestamp: number
}

export type WheelState = {
  draftPrizes: Prize[]
  prizes: Prize[]
  status: SpinStatus
  config: SpinConfig
  resultPrizeId: string | null
  records: DrawRecord[]
}
