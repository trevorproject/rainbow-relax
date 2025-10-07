#!/usr/bin/env node

/**
 * Port Detection Script for Rainbow Relax Widget
 * 
 * This script detects the actual port that the Vite dev server is running on
 * and outputs it to stdout. This is used by other scripts and configurations
 * to ensure they use the correct port.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Find the port that the Vite dev server is running on
 * @returns {Promise<number|null>} The port number or null if not found
 */
async function findVitePort() {
  try {
    // Check for Vite processes and extract port from their output
    const { stdout } = await execAsync('ps aux | grep "vite" | grep -v grep');
    
    if (!stdout.trim()) {
      return null;
    }

    // Try to find port in the process output
    const portMatch = stdout.match(/localhost:(\d+)/);
    if (portMatch) {
      return parseInt(portMatch[1], 10);
    }

    // If no port found in process output, try common Vite ports
    const commonPorts = [5173, 5174, 5175, 5176, 5177];
    
    for (const port of commonPorts) {
      try {
        const { stdout: curlOutput } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${port}`, { timeout: 1000 });
        if (curlOutput.trim() === '200') {
          return port;
        }
      } catch (error) {
        // Port not responding, continue to next
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('Error detecting port:', error.message);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  const port = await findVitePort();
  
  if (port) {
    console.log(port);
    process.exit(0);
  } else {
    console.error('No Vite dev server found running');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { findVitePort };
