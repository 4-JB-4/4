/**
 * MicroExtract - Micro-Feature Extraction Engine
 * ═══════════════════════════════════════════════════════════════════
 * Extracts micro-level patterns from ARC grids for Beast Mode seeding.
 * Fast, lightweight analysis for candidate generation hints.
 */

class MicroExtract {
  constructor(options = {}) {
    this.options = {
      minBlobSize: options.minBlobSize || 2,
      symmetryThreshold: options.symmetryThreshold || 0.9,
      patternMinReps: options.patternMinReps || 2,
      ...options
    };
  }

  /**
   * Extract all micro-features from a grid
   * @param {Array<Array<number>>} grid - Input grid
   * @returns {Object} Extracted micro-features with rule hints
   */
  extract(grid) {
    const features = {};
    let rule = null;
    let confidence = 0;

    // Run all extractors
    const isolates = this.findIsolates(grid);
    const blobs = this.findBlobs(grid);
    const symmetry = this.detectSymmetry(grid);
    const runs = this.findRunLengths(grid);
    const repeats = this.findRepeatingPatterns(grid);
    const motions = this.detectMotionVectors(grid);

    // Determine dominant rule
    if (isolates.count > 0 && isolates.count < 5) {
      rule = "singleColorIsolate";
      features.isolates = isolates.cells;
      features.topVal = this.getDominantColor(grid);
      confidence = 0.6;
    } else if (blobs.length > 0 && blobs[0].size > 4) {
      rule = "boundingBlobs";
      features.top = blobs.slice(0, 3);
      confidence = 0.5;
    } else if (symmetry.score > this.options.symmetryThreshold) {
      rule = "symmetry";
      features.axis = symmetry.axis;
      features.center = symmetry.center;
      confidence = symmetry.score;
    } else if (runs.hasPattern) {
      rule = "runLengthPatterns";
      features.runs = runs;
      confidence = 0.4;
    } else if (repeats.found) {
      rule = "repeats";
      features.patternHints = repeats.hints;
      confidence = 0.45;
    } else if (motions.detected) {
      rule = "motionVectors";
      features.vectors = motions.vectors;
      confidence = 0.35;
    }

    return {
      rule: rule || "unknown",
      features,
      confidence,
      gridStats: {
        rows: grid.length,
        cols: grid[0]?.length || 0,
        uniqueColors: this.countUniqueColors(grid),
        density: this.calculateDensity(grid)
      }
    };
  }

  /**
   * Find isolated single cells (potential noise or markers)
   */
  findIsolates(grid) {
    const h = grid.length, w = grid[0].length;
    const cells = [];

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (grid[r][c] !== 0) {
          const neighbors = this.getNeighborCount(grid, r, c);
          if (neighbors === 0) {
            cells.push({ r, c, val: grid[r][c] });
          }
        }
      }
    }

    return { count: cells.length, cells };
  }

  /**
   * Find connected blobs with bounding boxes
   */
  findBlobs(grid) {
    const h = grid.length, w = grid[0].length;
    const visited = Array.from({ length: h }, () => Array(w).fill(false));
    const blobs = [];

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (!visited[r][c] && grid[r][c] !== 0) {
          const blob = this.floodFill(grid, visited, r, c);
          if (blob.cells.length >= this.options.minBlobSize) {
            blobs.push(blob);
          }
        }
      }
    }

    // Sort by size descending
    blobs.sort((a, b) => b.size - a.size);
    return blobs;
  }

  floodFill(grid, visited, startR, startC) {
    const h = grid.length, w = grid[0].length;
    const value = grid[startR][startC];
    const cells = [];
    const stack = [[startR, startC]];
    let minR = startR, maxR = startR, minC = startC, maxC = startC;

    while (stack.length > 0) {
      const [r, c] = stack.pop();
      if (r < 0 || r >= h || c < 0 || c >= w) continue;
      if (visited[r][c] || grid[r][c] !== value) continue;

      visited[r][c] = true;
      cells.push({ r, c });
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);

      stack.push([r+1, c], [r-1, c], [r, c+1], [r, c-1]);
    }

    return {
      value,
      cells,
      size: cells.length,
      bbox: [minR, minC, maxR, maxC],
      width: maxC - minC + 1,
      height: maxR - minR + 1
    };
  }

  /**
   * Detect symmetry (horizontal, vertical, diagonal)
   */
  detectSymmetry(grid) {
    const h = grid.length, w = grid[0].length;
    let vScore = 0, hScore = 0, total = 0;

    // Vertical symmetry (left-right mirror)
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < Math.floor(w / 2); c++) {
        total++;
        if (grid[r][c] === grid[r][w - 1 - c]) vScore++;
      }
    }

    // Horizontal symmetry (top-bottom mirror)
    total = 0;
    for (let r = 0; r < Math.floor(h / 2); r++) {
      for (let c = 0; c < w; c++) {
        total++;
        if (grid[r][c] === grid[h - 1 - r][c]) hScore++;
      }
    }

    const vSymmetry = total > 0 ? vScore / total : 0;
    const hSymmetry = total > 0 ? hScore / total : 0;

    if (vSymmetry > hSymmetry && vSymmetry > 0.8) {
      return { score: vSymmetry, axis: 'vertical', center: Math.floor(w / 2) };
    } else if (hSymmetry > 0.8) {
      return { score: hSymmetry, axis: 'horizontal', center: Math.floor(h / 2) };
    }

    return { score: Math.max(vSymmetry, hSymmetry), axis: null, center: null };
  }

  /**
   * Find run-length patterns in rows/columns
   */
  findRunLengths(grid) {
    const h = grid.length, w = grid[0].length;
    const rowRuns = [];
    const colRuns = [];

    // Row runs
    for (let r = 0; r < h; r++) {
      let currentVal = grid[r][0];
      let runLength = 1;
      const runs = [];

      for (let c = 1; c < w; c++) {
        if (grid[r][c] === currentVal) {
          runLength++;
        } else {
          runs.push({ val: currentVal, len: runLength });
          currentVal = grid[r][c];
          runLength = 1;
        }
      }
      runs.push({ val: currentVal, len: runLength });
      rowRuns.push(runs);
    }

    // Column runs
    for (let c = 0; c < w; c++) {
      let currentVal = grid[0][c];
      let runLength = 1;
      const runs = [];

      for (let r = 1; r < h; r++) {
        if (grid[r][c] === currentVal) {
          runLength++;
        } else {
          runs.push({ val: currentVal, len: runLength });
          currentVal = grid[r][c];
          runLength = 1;
        }
      }
      runs.push({ val: currentVal, len: runLength });
      colRuns.push(runs);
    }

    // Check for patterns
    const hasPattern = this.detectRunPattern(rowRuns) || this.detectRunPattern(colRuns);

    return { rowRuns, colRuns, hasPattern };
  }

  detectRunPattern(runs) {
    if (runs.length < 2) return false;
    const first = JSON.stringify(runs[0]);
    let matches = 0;
    for (let i = 1; i < runs.length; i++) {
      if (JSON.stringify(runs[i]) === first) matches++;
    }
    return matches >= this.options.patternMinReps;
  }

  /**
   * Find repeating tile patterns
   */
  findRepeatingPatterns(grid) {
    const h = grid.length, w = grid[0].length;
    const hints = [];

    // Check column period
    for (let period = 1; period <= Math.floor(w / 2); period++) {
      let matches = 0, total = 0;
      for (let r = 0; r < h; r++) {
        for (let c = period; c < w; c++) {
          total++;
          if (grid[r][c] === grid[r][c % period]) matches++;
        }
      }
      if (total > 0 && matches / total > 0.9) {
        hints.push({ axis: 'col', period });
        break;
      }
    }

    // Check row period
    for (let period = 1; period <= Math.floor(h / 2); period++) {
      let matches = 0, total = 0;
      for (let r = period; r < h; r++) {
        for (let c = 0; c < w; c++) {
          total++;
          if (grid[r][c] === grid[r % period][c]) matches++;
        }
      }
      if (total > 0 && matches / total > 0.9) {
        hints.push({ axis: 'row', period });
        break;
      }
    }

    return { found: hints.length > 0, hints };
  }

  /**
   * Detect motion vectors (directional shifts)
   */
  detectMotionVectors(grid) {
    // Simplified: detect if non-zero cells cluster toward an edge
    const h = grid.length, w = grid[0].length;
    let sumR = 0, sumC = 0, count = 0;

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (grid[r][c] !== 0) {
          sumR += r;
          sumC += c;
          count++;
        }
      }
    }

    if (count === 0) return { detected: false, vectors: [] };

    const centerR = sumR / count;
    const centerC = sumC / count;
    const vectors = [];

    // Detect bias toward edges
    if (centerR < h * 0.3) vectors.push([1, 0]);  // Bias toward top → suggest down
    if (centerR > h * 0.7) vectors.push([-1, 0]); // Bias toward bottom → suggest up
    if (centerC < w * 0.3) vectors.push([0, 1]);  // Bias toward left → suggest right
    if (centerC > w * 0.7) vectors.push([0, -1]); // Bias toward right → suggest left

    return { detected: vectors.length > 0, vectors, center: [centerR, centerC] };
  }

  // Helper methods
  getNeighborCount(grid, r, c) {
    const h = grid.length, w = grid[0].length;
    let count = 0;
    const dirs = [[-1,0], [1,0], [0,-1], [0,1]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < h && nc >= 0 && nc < w && grid[nr][nc] !== 0) {
        count++;
      }
    }
    return count;
  }

  getDominantColor(grid) {
    const hist = new Map();
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        const v = grid[r][c];
        if (v !== 0) hist.set(v, (hist.get(v) || 0) + 1);
      }
    }
    let maxVal = 0, maxCount = 0;
    for (const [val, count] of hist) {
      if (count > maxCount) {
        maxCount = count;
        maxVal = val;
      }
    }
    return maxVal;
  }

  countUniqueColors(grid) {
    const colors = new Set();
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        colors.add(grid[r][c]);
      }
    }
    return colors.size;
  }

  calculateDensity(grid) {
    let nonZero = 0, total = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        total++;
        if (grid[r][c] !== 0) nonZero++;
      }
    }
    return total > 0 ? nonZero / total : 0;
  }

  /**
   * Static analyze method for quick extraction
   * @param {Array<Array<number>>} grid - Input grid
   * @param {Object} options - Analysis options
   * @returns {Object} Extracted micro-features with timing
   */
  static analyze(grid, options = {}) {
    const { performance } = require('perf_hooks');
    const start = performance.now();

    const extractor = new MicroExtract({
      mode: options.mode || 'BEAST',
      ...options
    });

    const result = extractor.extract(grid);
    result.elapsed = Math.round(performance.now() - start);
    result.mode = options.mode || 'BEAST';

    return result;
  }
}

module.exports = MicroExtract;
module.exports.MicroExtract = MicroExtract;
