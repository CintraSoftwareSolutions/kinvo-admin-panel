// A catalogue editor, not a billing system: nothing here charges or entitles anybody.

/** Editorial, and separate from is_active (which controls whether the app sees the product). */
export type RolloutState = 'live' | 'promo' | 'draft' | 'grandfathered'

export type PriceVersion = {
  id: string
  amount_minor: number
  currency: string
  effective_from: string
  effective_to: string | null
  note: string | null
}

/** Item of GET /admin/subscription-products */
export type SubscriptionPlan = {
  id: string
  slug: string
  name: string
  /** Not editable by design. */
  tier: string
  /** Not editable by design. */
  billing_cycle: string
  rollout_state: RolloutState
  rollout_note: string | null
  is_active: boolean
  sort_order: number
  /** The open price version. */
  price: Pick<PriceVersion, 'amount_minor' | 'currency' | 'effective_from'> | null
  active_subscribers: number
  /** Yearly prices normalised to a month: not what was billed. */
  mrr_minor: number
  currency: string
  created_at: string
}

export type PlanPatch = {
  name?: string
  rollout_state?: RolloutState
  rollout_note?: string | null
  is_active?: boolean
  sort_order?: number
}
