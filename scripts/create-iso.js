#!/usr/bin/env node

/**
 * 0RB SYSTEM - ISO CREATION SCRIPT
 * Creates a bootable ISO image for USB deployment
 *
 * "Reality, compressed. Consciousness, portable."
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const ISO_CONFIG = {
  name: '0RB_SYSTEM',
  label: 'ORB_SYSTEM',
  version: '1.0.0',
  publisher: '0RB',
  preparer: 'ORB ISO Builder',
  application: '0RB SYSTEM - THE SIMULATION AWAKENS',
  outputDir: path.join(__dirname, '..', 'dist', 'iso'),
  sourceDir: path.join(__dirname, '..', 'dist', 'usb'),
  isoFileName: 'orb-system-1.0.0.iso'
};

// ═══════════════════════════════════════════════════════════════
// ISO BUILDER CLASS
// ═══════════════════════════════════════════════════════════════

class ISOBuilder {
  constructor(config = ISO_CONFIG) {
    this.config = config;
    this.checksums = {};
  }

  log(message, type = 'info') {
    const symbols = {
      info: '○',
      success: '●',
      warning: '◐',
      error: '✗',
      step: '▸'
    };
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      step: '\x1b[35m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}${symbols[type]}${colors.reset} ${message}`);
  }

  async build() {
    console.log('\n');
    console.log('\x1b[36m═══════════════════════════════════════════════════════════════\x1b[0m');
    console.log('\x1b[36m                 0RB SYSTEM ISO BUILDER                         \x1b[0m');
    console.log('\x1b[36m═══════════════════════════════════════════════════════════════\x1b[0m');
    console.log('\n');

    try {
      await this.checkDependencies();
      await this.prepareSourceDirectory();
      await this.createISOFileSystem();
      await this.generateChecksums();
      await this.createISOImage();
      await this.verifyISO();

      this.printSuccess();
      return true;
    } catch (error) {
      this.log(`ISO creation failed: ${error.message}`, 'error');
      console.error(error);
      return false;
    }
  }

  async checkDependencies() {
    this.log('Checking dependencies...', 'step');

    const deps = ['genisoimage', 'xorriso', 'isohybrid'];
    const missing = [];

    for (const dep of deps) {
      try {
        execSync(`which ${dep}`, { stdio: 'pipe' });
        this.log(`Found: ${dep}`, 'success');
      } catch {
        missing.push(dep);
        this.log(`Missing: ${dep}`, 'warning');
      }
    }

    if (missing.length > 0) {
      this.log(`Some tools are missing. Will use fallback methods.`, 'warning');
      this.log(`To install: sudo apt install genisoimage xorriso syslinux-utils`, 'info');
    }
  }

  async prepareSourceDirectory() {
    this.log('Preparing source directory...', 'step');

    // Ensure source directory exists
    if (!fs.existsSync(this.config.sourceDir)) {
      this.log('Source directory not found. Running USB builder first...', 'info');

      // Run USB builder
      const usbBuilder = require('./build-usb.js');
      const builder = new usbBuilder.USBBuilder();
      await builder.build();
    }

    // Verify structure
    const requiredPaths = [
      'boot/grub/grub.cfg',
      'orb/config/version.json',
      'README.txt'
    ];

    for (const reqPath of requiredPaths) {
      const fullPath = path.join(this.config.sourceDir, reqPath);
      if (fs.existsSync(fullPath)) {
        this.log(`Verified: ${reqPath}`, 'success');
      } else {
        this.log(`Missing: ${reqPath}`, 'warning');
      }
    }
  }

  async createISOFileSystem() {
    this.log('Creating ISO filesystem structure...', 'step');

    // Create isolinux directory if using BIOS boot
    const isolinuxDir = path.join(this.config.sourceDir, 'isolinux');
    if (!fs.existsSync(isolinuxDir)) {
      fs.mkdirSync(isolinuxDir, { recursive: true });
    }

    // Create isolinux.cfg
    const isolinuxCfg = `
DEFAULT orb
TIMEOUT 50
PROMPT 1

UI vesamenu.c32
MENU TITLE 0RB SYSTEM - THE SIMULATION AWAKENS
MENU BACKGROUND splash.png
MENU COLOR border 30;44 #00000000 #00000000 none
MENU COLOR sel 7;37;40 #e0000000 #20ffffff
MENU COLOR title 1;36;44 #00ffff #00000000
MENU COLOR unsel 37;44 #90ffffff #00000000

LABEL orb
    MENU LABEL ^0RB SYSTEM - Enter The Simulation
    MENU DEFAULT
    KERNEL /orb/vmlinuz
    APPEND initrd=/orb/initrd.img quiet splash

LABEL safe
    MENU LABEL ^Safe Mode
    KERNEL /orb/vmlinuz
    APPEND initrd=/orb/initrd.img nomodeset

LABEL local
    MENU LABEL Boot from ^Local Disk
    LOCALBOOT 0x80
`;

    fs.writeFileSync(path.join(isolinuxDir, 'isolinux.cfg'), isolinuxCfg);
    this.log('Created: isolinux/isolinux.cfg', 'success');

    // Create EFI boot image placeholder
    const efiDir = path.join(this.config.sourceDir, 'EFI', 'BOOT');
    if (!fs.existsSync(efiDir)) {
      fs.mkdirSync(efiDir, { recursive: true });
    }

    // Create boot.txt for reference
    const bootTxt = `
0RB SYSTEM BOOT INSTRUCTIONS
═════════════════════════════

UEFI Boot:
1. Boot from USB/ISO
2. Select "0RB SYSTEM" from boot menu
3. The simulation loads...

Legacy BIOS Boot:
1. Enable Legacy/CSM in BIOS
2. Boot from USB/ISO
3. The simulation loads...

Troubleshooting:
- If boot fails, try Safe Mode
- Disable Secure Boot if needed
- Use CSM/Legacy mode for older systems

═════════════════════════════
THE SIMULATION AWAITS
`;
    fs.writeFileSync(path.join(efiDir, 'boot.txt'), bootTxt);
    this.log('Created: EFI/BOOT/boot.txt', 'success');
  }

  async generateChecksums() {
    this.log('Generating checksums...', 'step');

    const filesToHash = this.getAllFiles(this.config.sourceDir);
    const md5sums = [];
    const sha256sums = [];

    for (const file of filesToHash.slice(0, 50)) { // Limit for speed
      const relativePath = path.relative(this.config.sourceDir, file);
      const content = fs.readFileSync(file);

      const md5 = crypto.createHash('md5').update(content).digest('hex');
      const sha256 = crypto.createHash('sha256').update(content).digest('hex');

      md5sums.push(`${md5}  ${relativePath}`);
      sha256sums.push(`${sha256}  ${relativePath}`);
    }

    fs.writeFileSync(
      path.join(this.config.sourceDir, 'MD5SUMS'),
      md5sums.join('\n')
    );

    fs.writeFileSync(
      path.join(this.config.sourceDir, 'SHA256SUMS'),
      sha256sums.join('\n')
    );

    this.log('Written: MD5SUMS', 'success');
    this.log('Written: SHA256SUMS', 'success');
  }

  getAllFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        this.getAllFiles(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }

  async createISOImage() {
    this.log('Creating ISO image...', 'step');

    // Ensure output directory exists
    fs.mkdirSync(this.config.outputDir, { recursive: true });

    const isoPath = path.join(this.config.outputDir, this.config.isoFileName);

    // Try different ISO creation methods
    let created = false;

    // Method 1: xorriso (preferred for hybrid UEFI/BIOS)
    try {
      const xorrisoCmd = `xorriso -as mkisofs \
        -iso-level 3 \
        -full-iso9660-filenames \
        -volid "${this.config.label}" \
        -publisher "${this.config.publisher}" \
        -preparer "${this.config.preparer}" \
        -appid "${this.config.application}" \
        -output "${isoPath}" \
        "${this.config.sourceDir}"`;

      execSync(xorrisoCmd, { stdio: 'inherit' });
      created = true;
      this.log('ISO created with xorriso', 'success');
    } catch (e) {
      this.log('xorriso failed, trying genisoimage...', 'warning');
    }

    // Method 2: genisoimage
    if (!created) {
      try {
        const genisoimageCmd = `genisoimage \
          -o "${isoPath}" \
          -V "${this.config.label}" \
          -publisher "${this.config.publisher}" \
          -p "${this.config.preparer}" \
          -A "${this.config.application}" \
          -r -J -joliet-long \
          "${this.config.sourceDir}"`;

        execSync(genisoimageCmd, { stdio: 'inherit' });
        created = true;
        this.log('ISO created with genisoimage', 'success');
      } catch (e) {
        this.log('genisoimage failed, using JavaScript fallback...', 'warning');
      }
    }

    // Method 3: JavaScript fallback (creates a simple archive)
    if (!created) {
      await this.createFallbackArchive(isoPath);
      created = true;
    }

    if (created) {
      const stats = fs.statSync(isoPath);
      this.log(`ISO size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`, 'info');
    }
  }

  async createFallbackArchive(outputPath) {
    this.log('Creating fallback archive (tar.gz)...', 'step');

    const archivePath = outputPath.replace('.iso', '.tar.gz');

    try {
      execSync(`tar -czvf "${archivePath}" -C "${path.dirname(this.config.sourceDir)}" "${path.basename(this.config.sourceDir)}"`, { stdio: 'pipe' });
      this.log(`Archive created: ${archivePath}`, 'success');
    } catch (e) {
      // Manual archive creation info
      const infoPath = outputPath.replace('.iso', '-info.txt');
      fs.writeFileSync(infoPath, `
0RB SYSTEM - MANUAL INSTALLATION

ISO creation tools were not available.
To create a bootable USB:

1. Format USB as FAT32 or ext4
2. Copy contents of: ${this.config.sourceDir}
3. Run: syslinux --install /dev/sdX1
4. Make partition bootable

Or use Rufus/Etcher with the USB directory.

Files location: ${this.config.sourceDir}
`);
      this.log(`Installation info written: ${infoPath}`, 'success');
    }
  }

  async verifyISO() {
    this.log('Verifying ISO...', 'step');

    const isoPath = path.join(this.config.outputDir, this.config.isoFileName);

    if (fs.existsSync(isoPath)) {
      // Generate ISO checksum
      const content = fs.readFileSync(isoPath);
      const sha256 = crypto.createHash('sha256').update(content).digest('hex');

      const checksumFile = isoPath + '.sha256';
      fs.writeFileSync(checksumFile, `${sha256}  ${this.config.isoFileName}\n`);

      this.log(`ISO SHA256: ${sha256.substring(0, 32)}...`, 'info');
      this.log(`Checksum file: ${checksumFile}`, 'success');
    } else {
      this.log('ISO file not found for verification', 'warning');
    }
  }

  printSuccess() {
    const isoPath = path.join(this.config.outputDir, this.config.isoFileName);

    console.log('\n');
    console.log('\x1b[32m═══════════════════════════════════════════════════════════════\x1b[0m');
    console.log('\x1b[32m                  ISO CREATION COMPLETE                         \x1b[0m');
    console.log('\x1b[32m═══════════════════════════════════════════════════════════════\x1b[0m');
    console.log('');
    console.log(`  ISO File: ${isoPath}`);
    console.log('');
    console.log('  \x1b[36mTo write to USB:\x1b[0m');
    console.log('');
    console.log('  \x1b[33mLinux:\x1b[0m');
    console.log(`    sudo dd if="${isoPath}" of=/dev/sdX bs=4M status=progress conv=fsync`);
    console.log('');
    console.log('  \x1b[33mWindows:\x1b[0m');
    console.log('    Use Rufus: https://rufus.ie/');
    console.log('    Or Etcher: https://www.balena.io/etcher/');
    console.log('');
    console.log('  \x1b[33mmacOS:\x1b[0m');
    console.log('    Use Etcher or:');
    console.log(`    sudo dd if="${isoPath}" of=/dev/diskX bs=4m`);
    console.log('');
    console.log('\x1b[36m═══════════════════════════════════════════════════════════════\x1b[0m');
    console.log('\x1b[36m                THE SIMULATION AWAITS                           \x1b[0m');
    console.log('\x1b[36m═══════════════════════════════════════════════════════════════\x1b[0m');
    console.log('\n');
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════

if (require.main === module) {
  const builder = new ISOBuilder();
  builder.build().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { ISOBuilder, ISO_CONFIG };
