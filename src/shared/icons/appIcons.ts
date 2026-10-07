import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  ArrowUpDown,
  Ban,
  BadgePercent,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  CreditCard,
  Crown,
  Download,
  Eye,
  EyeOff,
  FileClock,
  FileDown,
  Flag,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  Search,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  UserPlus,
  UserRoundCheck,
  UserRoundCog,
  UsersRound,
  UserX,
  WalletCards,
  X,
} from 'lucide-react'

export type AppIcon = LucideIcon

type IconTree = {
  readonly [key: string]: AppIcon | IconTree
}

const TrustShieldIcon = ShieldAlert

const roleIconsById: Record<string, AppIcon> = {
  'support-lead': UserRoundCog,
  'revenue-ops': CreditCard,
  'trust-specialist': TrustShieldIcon,
  'super-admin': ShieldCheck,
}

const permissionIconsById: Record<string, AppIcon> = {
  'view-profiles': Eye,
  'approve-verification': UserRoundCheck,
  'export-data': FileDown,
  'manage-credits': WalletCards,
  'view-audit-trail': FileClock,
  'moderate-reports': TrustShieldIcon,
  'edit-pricing': CreditCard,
  'assign-operators': UsersRound,
  'launch-campaigns': CalendarDays,
}

export const appIcons = {
  navigation: {
    userManagement: UsersRound,
    contentModeration: Flag,
    dateSuggestions: MapPin,
    subscription: Crown,
    analytics: BarChart3,
  },
  contentModeration: {
    queue: Flag,
    playbook: FileClock,
    escalations: TriangleAlert,
    insights: BarChart3,
    actions: {
      view: Eye,
      approve: CircleCheck,
      restrict: Ban,
    },
  },
  analyticsDashboard: {
    engagement: Activity,
    monetization: BadgePercent,
    retention: CalendarDays,
    channels: BarChart3,
  },
  adminOperations: {
    membershipEditor: Crown,
    venueCuration: MapPin,
    moveStatus: MapPin,
  },
  userManagement: {
    userTable: UsersRound,
    snapshot: Activity,
    roles: ShieldCheck,
    operatorGuide: FileClock,
    membership: CreditCard,
    activityHistory: FileClock,
    permissions: ShieldCheck,
    guardrails: ShieldCheck,
    roleCards: roleIconsById,
    roleSelector: {
      users: UsersRound,
      billing: CreditCard,
      trust: TrustShieldIcon,
      admin: ShieldCheck,
    },
    trustShield: TrustShieldIcon,
    moderateReports: TrustShieldIcon,
    metrics: {
      purple: UsersRound,
      emerald: WalletCards,
      rose: ShieldAlert,
      blue: Activity,
    },
    permissionItems: permissionIconsById,
    permissionState: {
      allowed: CheckCircle2,
      blocked: ShieldAlert,
    },
    guardrailCards: {
      checklist: ClipboardCheck,
      history: FileClock,
      trust: ShieldCheck,
    },
    operatorGuideCards: {
      search: Search,
      sorting: ArrowUpDown,
      loop: ShieldCheck,
    },
  },
  actions: {
    view: Eye,
    more: MoreHorizontal,
    restrict: UserX,
    reviewActivity: ShieldAlert,
    membership: CreditCard,
    export: Download,
    addUser: UserPlus,
    notifications: Bell,
    menu: Menu,
    close: X,
  },
  table: {
    sort: ArrowUpDown,
    previous: ChevronLeft,
    next: ChevronRight,
  },
  forms: {
    search: Search,
  },
  auth: {
    email: Mail,
    password: LockKeyhole,
    showPassword: Eye,
    hidePassword: EyeOff,
    success: CheckCircle2,
    logout: LogOut,
  },
  sidebar: {
    responseSla: ShieldCheck,
  },
} as const satisfies IconTree
