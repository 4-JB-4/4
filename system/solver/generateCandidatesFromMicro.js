/**
 * Beast Mode Transform Seeding
 * ═══════════════════════════════════════════════════════════════════
 * Tiny, fast, aggressive candidate generation from micro-features.
 * Converts extracted micro-patterns into actionable transform candidates.
 */

function generateCandidatesFromMicro(state, micro) {
  const grid = state.grid;
  const rule = micro.rule;
  const cand = [];

  // Micro → simple transforms
  const add = (name, fn) => cand.push({ name, apply: fn });

  switch (rule) {

    case "singleColorIsolate":
      // Try filling isolated spots with dominant color
      if (micro.features.topVal !== undefined) {
        add("fill_isolates", s => {
          const g = s.clone();
          for (const iso of micro.features.isolates || []) {
            g[iso.r][iso.c] = micro.features.topVal;
          }
          return g;
        });
      }
      break;

    case "boundingBlobs":
      // Try border fill around top blob bounding box
      const top = micro.features.top?.[0];
      if (top) {
        const [r0,c0,r1,c1] = top.bbox;
        add("blob_border_fill", s => {
          const g = s.clone();
          for (let c=c0;c<=c1;c++){
            g[r0][c] = top.value;
            g[r1][c] = top.value;
          }
          for (let r=r0;r<=r1;r++){
            g[r][c0] = top.value;
            g[r][c1] = top.value;
          }
          return g;
        });
      }
      break;

    case "runLengthPatterns":
      // try column & row unify
      add("row_simplify", s => {
        const g = s.clone();
        for (let r=0;r<g.length;r++){
          const val = g[r][0];
          for (let c=0;c<g[0].length;c++){
            g[r][c] = val;
          }
        }
        return g;
      });
      add("col_simplify", s => {
        const g = s.clone();
        for (let c=0;c<g[0].length;c++){
          const val = g[0][c];
          for (let r=0;r<g.length;r++){
            g[r][c] = val;
          }
        }
        return g;
      });
      break;

    case "symmetry":
      // mirror grid
      add("mirror_vertical", s => {
        const g = s.clone();
        const h=g.length, w=g[0].length;
        for (let r=0;r<h;r++){
          for (let c=0;c<w;c++){
            g[r][c] = s.grid[r][w-1-c];
          }
        }
        return g;
      });
      add("mirror_horizontal", s => {
        const g = s.clone();
        const h=g.length, w=g[0].length;
        for (let r=0;r<h;r++){
          for (let c=0;c<w;c++){
            g[r][c] = s.grid[h-1-r][c];
          }
        }
        return g;
      });
      break;

    case "motionVectors":
      // try shifting dominant colors in common directions
      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      dirs.forEach(([dr,dc])=>{
        add(`shift_${dr}_${dc}`, s=>{
          const {grid} = s; const h=grid.length,w=grid[0].length;
          const g = Array.from({length:h},()=>Array(w).fill(0));
          for (let r=0;r<h;r++){
            for (let c=0;c<w;c++){
              const nr=r+dr,nc=c+dc;
              if (nr>=0&&nr<h&&nc>=0&&nc<w) g[nr][nc]=grid[r][c];
            }
          }
          return g;
        });
      });
      break;

    case "repeats":
      // try crop/extend periodic pattern
      for (const hint of micro.features.patternHints || []) {
        add(`tile_${hint.axis}_${hint.period}`, s=>{
          const g = s.clone();
          const {h,w} = {h:g.length,w:g[0].length};
          if (hint.axis === 'col') {
            for (let r=0;r<h;r++){
              for (let c=0;c<w;c++){
                g[r][c] = s.grid[r][c % hint.period];
              }
            }
          } else {
            for (let r=0;r<h;r++){
              for (let c=0;c<w;c++){
                g[r][c] = s.grid[r % hint.period][c];
              }
            }
          }
          return g;
        });
      }
      break;
  }

  // If no rule triggered — small nudge
  if (cand.length === 0) {
    add("identity_probe", s => s.clone());
  }

  return cand;
}

module.exports = { generateCandidatesFromMicro };
