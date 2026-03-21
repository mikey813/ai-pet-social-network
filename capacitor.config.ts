import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.wepet.app',
  appName: 'WePet',
  webDir: 'public',
  server: {
    url: 'https://你的线上域名',
    cleartext: false,
  },
}

export default config