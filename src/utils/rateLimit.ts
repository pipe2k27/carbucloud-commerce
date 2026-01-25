import {
  countRateLimitEntries,
  recordRateLimitEntry,
} from "@/dynamo-db/rate-limits.db";
import { ServerResponse } from "@/constants/api-constants";

export type RateLimitAction = "appointment" | "lead" | "purchase";

export type RateLimitConfig = {
  maxPerDay: number;
  message: string;
};

// Default rate limits per action type
const DEFAULT_LIMITS: Record<RateLimitAction, RateLimitConfig> = {
  appointment: {
    maxPerDay: 3,
    message: "Has alcanzado el límite de citas por día. Intenta mañana.",
  },
  lead: {
    maxPerDay: 5,
    message: "Has alcanzado el límite de consultas por día. Intenta mañana.",
  },
  purchase: {
    maxPerDay: 3,
    message: "Has alcanzado el límite de solicitudes por día. Intenta mañana.",
  },
};

export type RateLimitResult = {
  allowed: boolean;
  reason?: string;
};

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (phone number, email, etc.)
 * @param action - Type of action being performed
 * @param customConfig - Optional custom rate limit configuration
 * @returns RateLimitResult indicating if request is allowed
 */
export async function checkRateLimit(
  identifier: string,
  action: RateLimitAction,
  customConfig?: Partial<RateLimitConfig>
): Promise<RateLimitResult> {
  try {
    // Skip rate limiting if identifier is empty
    if (!identifier || identifier.trim() === "") {
      return { allowed: true };
    }

    const config = {
      ...DEFAULT_LIMITS[action],
      ...customConfig,
    };

    // Count existing entries in the last 24 hours
    const count = await countRateLimitEntries(identifier, action);

    if (count >= config.maxPerDay) {
      console.log(
        `[RateLimit] Blocked: ${identifier} for ${action} (${count}/${config.maxPerDay})`
      );
      return {
        allowed: false,
        reason: config.message,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("[checkRateLimit] Error:", error);
    // Fail open - allow request if rate limiting fails
    return { allowed: true };
  }
}

/**
 * Record a successful action for rate limiting purposes
 * Call this AFTER a successful operation
 * @param identifier - Unique identifier (phone number, email, etc.)
 * @param action - Type of action performed
 */
export async function recordAction(
  identifier: string,
  action: RateLimitAction
): Promise<void> {
  try {
    if (!identifier || identifier.trim() === "") {
      return;
    }
    await recordRateLimitEntry(identifier, action);
  } catch (error) {
    console.error("[recordAction] Error:", error);
    // Don't throw - recording shouldn't break the main flow
  }
}

/**
 * Helper to apply rate limiting to a server action
 * Returns a rate limit error response if blocked, null if allowed
 * @param identifier - Unique identifier
 * @param action - Action type
 * @param customConfig - Optional custom config
 */
export async function applyRateLimit(
  identifier: string,
  action: RateLimitAction,
  customConfig?: Partial<RateLimitConfig>
): Promise<ServerResponse | null> {
  const result = await checkRateLimit(identifier, action, customConfig);

  if (!result.allowed) {
    return {
      status: 429,
      message: result.reason || "Demasiadas solicitudes. Intenta más tarde.",
    };
  }

  return null;
}
