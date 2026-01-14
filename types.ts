
export interface Website {
  id: string;
  url: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  addedAt: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  type: string;
  siteName: string;
}

export interface PerformanceMetric {
  date: string;
  visitors: number;
  loadTime: number;
  errorRate: number;
}

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'detected' | 'fixing' | 'patched';
  remediation: string;
}

export interface AIAnalysis {
  strengths: string[];
  weaknesses: string[];
  securityConcerns: string[];
  recommendations: string[];
  cyberCrimeDetection: string;
  vulnerabilities: Vulnerability[];
}

export enum TimeRange {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly'
}
