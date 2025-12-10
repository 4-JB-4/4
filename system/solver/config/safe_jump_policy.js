// File: system/solver/config/safe_jump_policy.js
// Purpose: Store maximum safe jumps, execution parameters, and oversight enforcement
// Usage: Import in your UnlimitedSolver runtime to enforce jump policies

const SafeJumpPolicy = {
  // 1. Complexity Growth Control
  MAX_COMPLEXITY_JUMP: 2, // max allowed increase per axis per iteration

  // 2. Chain / Transformation Limits
  MAX_CHAIN_LENGTH: 5, // max number of transformations in one strategy chain

  // 3. Strategy Generation Limits
  MAX_STRATEGIES_PER_GENERATION: 500, // max number of candidate strategies generated per wave

  // 4. Memory / Priority Boosting
  PRIORITY_BOOST_LIMIT: 1.5, // max multiplier for previously successful hypotheses

  // 5. Validation Safety
  VALIDATION_TIME_BUDGET_MS: 300, // max ms per strategy validation

  // 6. Oversight Enforcement
  HUMAN_OVERSIGHT_REQUIRED: true, // always require human start/stop for execution

  // 7. Logging / Monitoring
  LOG_LEVEL: 'verbose', // options: 'verbose', 'info', 'warn', 'error'
  LOG_STRATEGY_PROGRESS: true, // log each strategy attempt
  LOG_MEMORY_CHANGES: true, // log memory updates

  // 8. Bottleneck Detection
  ENABLE_FLOW_SYNC_MONITOR: true, // tracks chains and identifies slow points
  FLOW_SYNC_THRESHOLD_MS: 150, // warning if individual step exceeds this

  // 9. Development Mode Flags
  DEVELOPMENT_MODE: true, // keeps solver in supervised mode
  ALLOW_HYPOTHESIS_EXPLORATION: true, // yes, you can explore aggressively
  WARN_ON_LARGE_JUMPS: true, // flag jumps that are at max limits

  // 10. Safety Enforcement Hooks
  onUnsafeJump: (jumpDetail) => {
    console.warn('[SAFETY WARNING] Attempted unsafe jump:', jumpDetail);
    // Optionally: block or modify jump here
  },

  onAutonomyAttempt: (actionDetail) => {
    console.error('[SAFETY WARNING] Detected unsupervised action:', actionDetail);
    // Enforce HUMAN_OVERSIGHT_REQUIRED
  }
};

// Export for runtime usage
module.exports = SafeJumpPolicy;
