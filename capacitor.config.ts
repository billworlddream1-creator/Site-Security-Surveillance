export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
  };
}

const config: CapacitorConfig = {
  appId: 'com.gmt.sss',
  appName: 'GMT SSS',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
