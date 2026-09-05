export type Verdict = "chay_that" | "lanh_tinh" | "khong_chay";

export const VERDICT_LABEL: Record<Verdict, string> = {
  chay_that: "Cháy thật",
  lanh_tinh: "Lành tính",
  khong_chay: "Không cháy",
};

export interface SensorSeries {
  smoke: number[]; // %/m theo giây
  temp: number[]; // °C
  co: number[]; // ppm
}

export interface FireEvent {
  id: string;
  nodeId: string;
  zone: string;
  ts: string; // ISO
  level: 0 | 1 | 2 | 3 | 4;
  verdict: Verdict;
  confidence: number; // 0..1
  evidence: string[];
  explanation: string;
  series: SensorSeries;
  safetyGateTriggered: boolean;
  feedback: "dung" | "sai" | null;
}

export interface DeviceNode {
  id: string;
  zone: string;
  kinds: string[];
  online: boolean;
  lastSeen: string;
  shadow: Record<string, unknown>;
}

export interface ModelVersion {
  tag: string;
  base: string;
  quant: string;
  verdictAcc: number | null;
  map50: number | null;
  farPerDay: number | null;
  device: string;
  date: string;
  live: boolean;
}

export type Role = "quan_ly" | "cu_dan" | "trung_tam";

export const ROLE_LABEL: Record<Role, string> = {
  quan_ly: "Quản lý tòa nhà",
  cu_dan: "Cư dân",
  trung_tam: "Trung tâm giám sát",
};
