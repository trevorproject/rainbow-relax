#!/usr/bin/env node

/**
 * Start Dev Server with Auto Test Page
 * 
 * This script starts the Vite dev server and automatically opens the test page
 * with the correct port detection.
 */

import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Wait for a port to be available
 * @param {number} port - Port to check
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} True if port is available
 */
async function waitForPort(port, timeout = 30000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${port}`, { timeout: 1000 });
      if (stdout.trim() === '200') {
        return true;
      }
    } catch (error) {
      // Port not ready yet, continue waiting
    }
    
    // Wait 500ms before checking again
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return false;
}

/**
 * Find the actual port the dev server is running on
 * @returns {Promise<number|null>} The port number or null if not found
 */
async function findDevServerPort() {
  const commonPorts = [5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180];
  
  for (const port of commonPorts) {
    try {
      const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${port}`, { timeout: 1000 });
      if (stdout.trim() === '200') {
        return port;
      }
    } catch (error) {
      continue;
    }
  }
  
  return null;
}

/**
 * Open the test page in the default browser
 * @param {number} port - Port number
 */
async function openTestPage(port) {
  const testPageUrl = `http://localhost:${port}/test-pages/dynamic-test-auto.html`;
  
  try {
    // Try to open in default browser
    if (process.platform === 'darwin') {
      await execAsync(`open "${testPageUrl}"`);
    } else if (process.platform === 'win32') {
      await execAsync(`start "${testPageUrl}"`);
    } else {
      await execAsync(`xdg-open "${testPageUrl}"`);
    }
    
    console.log(`✅ Test page opened: ${testPageUrl}`);
  } catch (error) {
    console.log(`⚠️  Could not auto-open browser. Please manually open: ${testPageUrl}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Rainbow Relax Widget Development Server...\n');
  
  // Start the dev server
  const devServer = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    shell: true
  });
  
  // Handle dev server output
  devServer.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    // Look for port information in the output
    const portMatch = output.match(/Local:\s+http:\/\/localhost:(\d+)/);
    if (portMatch) {
      const port = parseInt(portMatch[1], 10);
      console.log(`\n🔍 Detected dev server on port ${port}`);
      
      // Wait a bit for the server to be fully ready
      setTimeout(async () => {
        const isReady = await waitForPort(port, 10000);
        if (isReady) {
          console.log(`✅ Dev server is ready on port ${port}`);
          await openTestPage(port);
        } else {
          console.log(`⚠️  Dev server may not be fully ready yet`);
        }
      }, 2000);
    }
  });
  
  devServer.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  // Handle process exit
  devServer.on('close', (code) => {
    console.log(`\n📴 Dev server exited with code ${code}`);
  });
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down dev server...');
    devServer.kill('SIGINT');
    process.exit(0);
  });
  
  // Keep the process alive
  devServer.on('exit', (code) => {
    process.exit(code);
  });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as startDevWithTest };
