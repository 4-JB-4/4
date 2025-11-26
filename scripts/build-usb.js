#!/usr/bin/env node

/**
 * 0RB SYSTEM - USB BOOTABLE BUILD SCRIPT
 * Creates a USB-bootable version of the 0RB System
 *
 * "The simulation, portable. Reality, in your pocket."
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
  name: '0RB_SYSTEM',
  version: '1.0.0',
  codename: 'THE_AWAKENING',
  outputDir: path.join(__dirname, '..', 'dist', 'usb'),
  isoDir: path.join(__dirname, '..', 'dist', 'iso'),
  bootConfig: {
    timeout: 5,
    defaultEntry: 'orb',
    theme: 'orb-dark'
  }
};

// ═══════════════════════════════════════════════════════════════
// DIRECTORY STRUCTURE FOR USB BOOT
// ═══════════════════════════════════════════════════════════════

const USB_STRUCTURE = {
  'boot': {
    'grub': {
      'grub.cfg': null,
      'themes': {
        'orb-dark': {
          'theme.txt': null,
          'background.png': null,
          'icons': {}
        }
      }
    },
    'syslinux': {
      'syslinux.cfg': null
    }
  },
  'EFI': {
    'BOOT': {
      'BOOTX64.EFI': null,
      'grubx64.efi': null
    }
  },
  'orb': {
    'system': {},
    'assets': {},
    'config': {},
    'data': {}
  },
  'autorun.inf': null,
  'README.txt': null
};

// ═══════════════════════════════════════════════════════════════
// GRUB CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const GRUB_CONFIG = `
# 0RB SYSTEM BOOT CONFIGURATION
# The simulation awakens...

set timeout=${CONFIG.bootConfig.timeout}
set default="${CONFIG.bootConfig.defaultEntry}"

# Theme
set theme=/boot/grub/themes/orb-dark/theme.txt

# Menu Colors
set menu_color_normal=cyan/black
set menu_color_highlight=white/cyan

menuentry "0RB SYSTEM - Enter The Simulation" --id orb {
    echo "THE SIMULATION AWAKENS..."
    echo ""
    echo "Loading consciousness matrix..."
    linux /orb/vmlinuz quiet splash orb.mode=full
    initrd /orb/initrd.img
}

menuentry "0RB SYSTEM - Safe Mode" --id orb-safe {
    echo "Loading in safe mode..."
    linux /orb/vmlinuz orb.mode=safe nomodeset
    initrd /orb/initrd.img
}

menuentry "0RB SYSTEM - Recovery Console" --id orb-recovery {
    echo "Entering recovery console..."
    linux /orb/vmlinuz orb.mode=recovery single
    initrd /orb/initrd.img
}

menuentry "Memory Test" --id memtest {
    linux16 /boot/memtest86+.bin
}

menuentry "Boot from local disk" --id local {
    chainloader +1
}
`;

// ═══════════════════════════════════════════════════════════════
// SYSLINUX CONFIGURATION (Legacy BIOS)
// ═══════════════════════════════════════════════════════════════

const SYSLINUX_CONFIG = `
# 0RB SYSTEM - SYSLINUX CONFIG
# Legacy BIOS boot support

DEFAULT orb
TIMEOUT 50
PROMPT 1

UI menu.c32
MENU TITLE 0RB SYSTEM - THE SIMULATION AWAKENS
MENU BACKGROUND splash.png
MENU COLOR border 30;44 #00000000 #00000000 none
MENU COLOR sel 7;37;40 #e0000000 #20ffffff
MENU COLOR title 1;36;44 #00ffff #00000000
MENU COLOR unsel 37;44 #90ffffff #00000000

LABEL orb
    MENU LABEL ^0RB SYSTEM - Enter The Simulation
    KERNEL /orb/vmlinuz
    APPEND initrd=/orb/initrd.img quiet splash orb.mode=full
    TEXT HELP
    Boot into the full 0RB System experience.
    The simulation awaits your consciousness.
    ENDTEXT

LABEL safe
    MENU LABEL ^Safe Mode
    KERNEL /orb/vmlinuz
    APPEND initrd=/orb/initrd.img orb.mode=safe nomodeset

LABEL recovery
    MENU LABEL ^Recovery Console
    KERNEL /orb/vmlinuz
    APPEND initrd=/orb/initrd.img orb.mode=recovery single

LABEL local
    MENU LABEL Boot from ^Local Disk
    LOCALBOOT 0x80
`;

// ═══════════════════════════════════════════════════════════════
// GRUB THEME
// ═══════════════════════════════════════════════════════════════

const GRUB_THEME = `
# 0RB SYSTEM GRUB THEME
# Cyberpunk consciousness aesthetic

title-text: "0RB SYSTEM"
title-font: "DejaVu Sans Bold 24"
title-color: "#00ffff"
desktop-color: "#0a0a0f"
message-font: "DejaVu Sans 12"
message-color: "#00ffff"
message-bg-color: "#000000"
terminal-font: "DejaVu Sans Mono 12"
terminal-box: "terminal_box_*.png"

+ boot_menu {
    left = 15%
    width = 70%
    top = 30%
    height = 50%
    item_font = "DejaVu Sans 14"
    item_color = "#cccccc"
    selected_item_font = "DejaVu Sans Bold 14"
    selected_item_color = "#00ffff"
    selected_item_pixmap_style = "select_*.png"
    scrollbar = true
    scrollbar_width = 10
    scrollbar_thumb = "slider_*.png"
}

+ label {
    left = 50%-150
    top = 10%
    width = 300
    height = 30
    text = "THE SIMULATION AWAKENS"
    font = "DejaVu Sans Bold 18"
    color = "#00ffff"
    align = "center"
}

+ label {
    left = 50%-200
    top = 85%
    width = 400
    height = 20
    text = "0RB as the interface between the code and the conscious"
    font = "DejaVu Sans 10"
    color = "#666666"
    align = "center"
}

+ progress_bar {
    id = "__timeout__"
    left = 30%
    width = 40%
    top = 92%
    height = 10
    font = "DejaVu Sans 10"
    text_color = "#00ffff"
    fg_color = "#00ffff"
    bg_color = "#1a1a2e"
    border_color = "#00ffff"
    text = "Booting in %d seconds"
}
`;

// ═══════════════════════════════════════════════════════════════
// AUTORUN.INF (Windows auto-launch)
// ═══════════════════════════════════════════════════════════════

const AUTORUN_INF = `[autorun]
label=0RB SYSTEM
icon=orb\\assets\\icon.ico
open=orb\\launcher.exe
action=Enter The 0RB System

[Content]
MusicFiles=false
PictureFiles=false
VideoFiles=false
`;

// ═══════════════════════════════════════════════════════════════
// README
// ═══════════════════════════════════════════════════════════════

const README = `
═══════════════════════════════════════════════════════════════
                        0RB SYSTEM
                  THE SIMULATION AWAKENS
═══════════════════════════════════════════════════════════════

Version: ${CONFIG.version}
Codename: ${CONFIG.codename}

WHAT IS THIS?
─────────────
This USB drive contains the complete 0RB System - a revolutionary
AI-powered platform disguised as a gaming console.

"It's not a game. It's THE game."

BOOT OPTIONS:
─────────────
1. 0RB SYSTEM - Full Experience
   The complete simulation. All agents. All games. All power.

2. Safe Mode
   Minimal graphics. For troubleshooting.

3. Recovery Console
   Command-line access for advanced users.

INCLUDED SYSTEMS:
─────────────────
• THE PANTHEON - 7 AI Agent Archetypes
  Apollo, Athena, Hermes, Ares, Hephaestus, Artemis, Mercury

• COPA SIDEKICK SYSTEM
  Augmentation > Automation. 10 industry verticals.

• GAME LIBRARY
  ARCHITECT, ORACLE, PANTHEON, FORGE, EMPIRE, ECHO, INFINITE

• CRYPTO ECONOMY
  $0RB token, Agent NFTs, Rental Marketplace

SYSTEM REQUIREMENTS:
────────────────────
• 64-bit processor (x86_64)
• 4GB RAM minimum (8GB recommended)
• USB 3.0 port (for best performance)
• UEFI or Legacy BIOS boot support

FIRST BOOT:
───────────
1. Insert USB drive
2. Restart computer
3. Enter boot menu (usually F12, F2, or DEL)
4. Select USB drive
5. Choose "0RB SYSTEM - Enter The Simulation"
6. Wait for consciousness matrix to load

SUPPORT:
────────
Website: https://orb.system
Discord: discord.gg/orb
Twitter: @ORBSystem

═══════════════════════════════════════════════════════════════
          0RB as the interface between code and conscious
                       EVERYBODY EATS
═══════════════════════════════════════════════════════════════
`;

// ═══════════════════════════════════════════════════════════════
// BUILD FUNCTIONS
// ═══════════════════════════════════════════════════════════════

class USBBuilder {
  constructor() {
    this.outputDir = CONFIG.outputDir;
    this.isoDir = CONFIG.isoDir;
  }

  log(message, type = 'info') {
    const prefix = {
      info: '[ INFO ]',
      success: '[  OK  ]',
      warning: '[ WARN ]',
      error: '[ERROR ]',
      step: '[ STEP ]'
    };
    console.log(`${prefix[type] || prefix.info} ${message}`);
  }

  async build() {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                0RB SYSTEM USB BUILD SCRIPT                     ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n');

    try {
      await this.createDirectories();
      await this.writeBootConfigs();
      await this.copySystemFiles();
      await this.createInfoFiles();
      await this.createBootableStructure();

      console.log('\n');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('                    BUILD COMPLETE                              ');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`\nOutput directory: ${this.outputDir}`);
      console.log('\nTo create USB:');
      console.log('  Linux:   sudo dd if=dist/iso/orb-system.iso of=/dev/sdX bs=4M status=progress');
      console.log('  Windows: Use Rufus or Etcher');
      console.log('  macOS:   Use Etcher or dd\n');

      return true;
    } catch (error) {
      this.log(`Build failed: ${error.message}`, 'error');
      console.error(error);
      return false;
    }
  }

  async createDirectories() {
    this.log('Creating directory structure...', 'step');

    const dirs = [
      this.outputDir,
      this.isoDir,
      path.join(this.outputDir, 'boot', 'grub', 'themes', 'orb-dark', 'icons'),
      path.join(this.outputDir, 'boot', 'syslinux'),
      path.join(this.outputDir, 'EFI', 'BOOT'),
      path.join(this.outputDir, 'orb', 'system', 'core'),
      path.join(this.outputDir, 'orb', 'system', 'agents'),
      path.join(this.outputDir, 'orb', 'system', 'copa'),
      path.join(this.outputDir, 'orb', 'system', 'crypto'),
      path.join(this.outputDir, 'orb', 'system', 'games'),
      path.join(this.outputDir, 'orb', 'system', 'ui'),
      path.join(this.outputDir, 'orb', 'assets', 'audio'),
      path.join(this.outputDir, 'orb', 'assets', 'visuals'),
      path.join(this.outputDir, 'orb', 'assets', 'fonts'),
      path.join(this.outputDir, 'orb', 'config'),
      path.join(this.outputDir, 'orb', 'data')
    ];

    for (const dir of dirs) {
      fs.mkdirSync(dir, { recursive: true });
      this.log(`Created: ${path.relative(this.outputDir, dir)}`, 'success');
    }
  }

  async writeBootConfigs() {
    this.log('Writing boot configurations...', 'step');

    // GRUB config
    fs.writeFileSync(
      path.join(this.outputDir, 'boot', 'grub', 'grub.cfg'),
      GRUB_CONFIG
    );
    this.log('Written: boot/grub/grub.cfg', 'success');

    // GRUB theme
    fs.writeFileSync(
      path.join(this.outputDir, 'boot', 'grub', 'themes', 'orb-dark', 'theme.txt'),
      GRUB_THEME
    );
    this.log('Written: boot/grub/themes/orb-dark/theme.txt', 'success');

    // Syslinux config
    fs.writeFileSync(
      path.join(this.outputDir, 'boot', 'syslinux', 'syslinux.cfg'),
      SYSLINUX_CONFIG
    );
    this.log('Written: boot/syslinux/syslinux.cfg', 'success');
  }

  async copySystemFiles() {
    this.log('Copying system files...', 'step');

    const sourceDir = path.join(__dirname, '..');
    const targetDir = path.join(this.outputDir, 'orb');

    // Copy system files
    const systemFiles = [
      'system/core/main.js',
      'system/agents/AgentManager.js',
      'system/copa/CopaCore.js',
      'system/crypto/CryptoEngine.js',
      'system/games/GameLauncher.js',
      'system/ui/ForumSystem.js',
      'boot/init.js',
      'package.json'
    ];

    for (const file of systemFiles) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      if (fs.existsSync(sourcePath)) {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.copyFileSync(sourcePath, targetPath);
        this.log(`Copied: ${file}`, 'success');
      } else {
        this.log(`Source not found: ${file}`, 'warning');
      }
    }
  }

  async createInfoFiles() {
    this.log('Creating info files...', 'step');

    // Autorun.inf
    fs.writeFileSync(
      path.join(this.outputDir, 'autorun.inf'),
      AUTORUN_INF
    );
    this.log('Written: autorun.inf', 'success');

    // README
    fs.writeFileSync(
      path.join(this.outputDir, 'README.txt'),
      README
    );
    this.log('Written: README.txt', 'success');

    // Version info
    const versionInfo = {
      name: CONFIG.name,
      version: CONFIG.version,
      codename: CONFIG.codename,
      buildDate: new Date().toISOString(),
      builder: 'orb-usb-builder',
      features: [
        'PANTHEON Agent System',
        'COPA Sidekick',
        'Game Library',
        'Crypto Economy',
        'Forum System'
      ]
    };

    fs.writeFileSync(
      path.join(this.outputDir, 'orb', 'config', 'version.json'),
      JSON.stringify(versionInfo, null, 2)
    );
    this.log('Written: orb/config/version.json', 'success');
  }

  async createBootableStructure() {
    this.log('Creating bootable structure...', 'step');

    // Create a placeholder for the kernel/initrd
    // In a real implementation, these would be actual Linux kernel files
    const bootPlaceholder = `
# 0RB SYSTEM BOOT PLACEHOLDER
# Replace with actual kernel and initrd for bootable USB

This file is a placeholder. To make a truly bootable USB:

1. Download a minimal Linux distribution (Alpine, Arch, etc.)
2. Copy vmlinuz and initrd.img to /orb/
3. Configure GRUB to load the 0RB System init scripts
4. Or use the Electron app for non-boot usage

For development:
- Run 'npm start' to launch the Electron app
- Run 'npm run web' to start the web interface
`;

    fs.writeFileSync(
      path.join(this.outputDir, 'orb', 'BOOT_README.txt'),
      bootPlaceholder
    );

    // Create ISO build script
    const isoScript = `#!/bin/bash
# 0RB SYSTEM ISO BUILDER
# Creates bootable ISO from USB directory structure

INPUT_DIR="${this.outputDir}"
OUTPUT_ISO="${this.isoDir}/orb-system.iso"

echo "Creating bootable ISO..."

# Using xorriso for UEFI + BIOS hybrid boot
xorriso -as mkisofs \\
  -iso-level 3 \\
  -full-iso9660-filenames \\
  -volid "0RB_SYSTEM" \\
  -eltorito-boot boot/syslinux/isolinux.bin \\
  -eltorito-catalog boot/syslinux/boot.cat \\
  -no-emul-boot -boot-load-size 4 -boot-info-table \\
  -isohybrid-mbr /usr/lib/ISOLINUX/isohdpfx.bin \\
  -eltorito-alt-boot \\
  -e EFI/BOOT/efiboot.img \\
  -no-emul-boot -isohybrid-gpt-basdat \\
  -output "$OUTPUT_ISO" \\
  "$INPUT_DIR"

echo "ISO created: $OUTPUT_ISO"
echo ""
echo "To write to USB:"
echo "  sudo dd if=$OUTPUT_ISO of=/dev/sdX bs=4M status=progress conv=fsync"
`;

    fs.writeFileSync(
      path.join(this.isoDir, 'build-iso.sh'),
      isoScript,
      { mode: 0o755 }
    );
    this.log('Written: dist/iso/build-iso.sh', 'success');
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════

if (require.main === module) {
  const builder = new USBBuilder();
  builder.build().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { USBBuilder, CONFIG };
