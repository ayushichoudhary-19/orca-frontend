export interface Call {
  id: string;
  to: string;
  from: string;
  status: string;
  sequenceIndex?: number;
  startTime: Date;
  duration?: number;
  jitter?: number;
  packetLoss?: number;
}

export interface Session {
  id: string;
  phoneNumbers: string[];
  currentIndex: number;
  isComplete: boolean;
  calls: Call[];
}

export interface CallFeedback {
  rating: number;
  notes?: string;
  duration: number;
}