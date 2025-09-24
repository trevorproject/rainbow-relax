import { FullConfig } from '@playwright/test';
import { exec } from 'child_process';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Global Teardown: Cleaning up...');
  
  // Kill any remaining Python servers
  return new Promise((resolve) => {
    exec('pkill -f "python3 -m http.server"', (error: any) => {
      if (error) {
        console.log('No Python servers to kill');
      } else {
        console.log('Python servers killed');
      }
      resolve(undefined);
    });
  });
}

export default globalTeardown;
