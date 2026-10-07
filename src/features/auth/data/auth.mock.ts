import { appConfig } from '../../../config/appConfig'
import type { AdminUser } from '../types/auth.types'

export const mockAdminUser: AdminUser = {
  id: 'admin-kinvo-001',
  name: appConfig.admin.name,
  email: 'admin@kinvo.app',
  role: appConfig.admin.role,
  avatar: appConfig.admin.avatar,
}

export const authStorageKey = 'kinvo-admin-auth-session'
