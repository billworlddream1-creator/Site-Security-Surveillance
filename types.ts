
export interface AlertThresholds {
  latencyMs: number;
  errorRatePercent: number;
  uptimePercent: number;
}

export interface Website {
  id: string;
  url: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  addedAt: string;
  uptimeSLA?: number;
  thresholds?: AlertThresholds;
  ownerId?: string;
  tags?: string[];
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  type: string;
  siteName: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'detected' | 'fixing' | 'patched';
  remediation: string;
  detailedSteps: string[];
  detectedAt: string;
  fixedAt?: string;
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

export type PlanType = 'free' | 'weekly' | 'monthly' | 'yearly';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  address: string;
  plan: PlanType;
  walletBalance: number;
  subscriptionExpiry?: string;
}

export interface PaymentMethod {
  id: 'paypal' | 'wallet';
  label: string;
  icon: string;
}
