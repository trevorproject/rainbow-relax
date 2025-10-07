import { FullConfig } from '@playwright/test';
import { exec } from 'child_process';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Global Teardown: Cleaning up...');
  
  // Kill any remaining serve servers
  return new Promise((resolve) => {
    exec('pkill -f "serve"', (error: any) => {
      if (error) {
        console.log('No serve servers to kill');
      } else {
        console.log('Serve servers killed');
      }
      resolve(undefined);
    });
  });
}

export default globalTeardown;
