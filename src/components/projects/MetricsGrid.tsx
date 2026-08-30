import React from "react";
import { Metric } from "@/lib/content";

interface MetricsGridProps {
  metrics: Metric[];
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-4)]">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="p-[var(--spacing-5)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-neutral-50)]"
        >
          {/* Delta — the headline number */}
          {metric.delta && (
            <p
              className="text-[length:var(--text-heading-h2)] leading-[var(--text-heading-h2--line-height)] font-[number:var(--font-weight-bold)] text-[var(--color-text-primary)] tabular-nums"
              aria-label={`${metric.label}: ${metric.delta}`}
            >
              {metric.delta}
            </p>
          )}

          {/* Before → After */}
          {(metric.before || metric.after) && (
            <div className="mt-[var(--spacing-2)] flex items-center gap-[var(--spacing-2)] text-[length:var(--text-body-s)] font-mono text-[var(--color-text-muted)]">
              {metric.before && (
                <>
                  <span className="line-through opacity-60">{metric.before}</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
              <span className="text-[var(--color-text-secondary)] font-[number:var(--font-weight-medium)]">
                {metric.after}
              </span>
            </div>
          )}

          {/* No delta — just the "after" as the headline */}
          {!metric.delta && !metric.before && (
            <p
              className="text-[length:var(--text-heading-h2)] leading-[var(--text-heading-h2--line-height)] font-[number:var(--font-weight-bold)] text-[var(--color-text-primary)] tabular-nums"
              aria-label={`${metric.label}: ${metric.after}`}
            >
              {metric.after}
            </p>
          )}

          {/* Label */}
          <p className="mt-[var(--spacing-2)] text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-muted)] uppercase tracking-wider">
            {metric.label}
          </p>
        </div>
      ))}
    </div>
  );
}
