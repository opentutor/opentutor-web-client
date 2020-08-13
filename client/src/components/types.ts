export interface ChatMsg {
  senderId: string;
  type: string;
  text: string;
}

export interface ErrorConfig {
  title: string;
  message: string;
  buttonText: string;
}

export interface Target {
  achieved: boolean;
  score: number;
  text: string;
  status: string;
}
