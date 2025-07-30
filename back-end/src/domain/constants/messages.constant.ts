// backend/src/domain/constants/messages.constant.ts
export const MESSAGES = {
  COUNTRY_ADDED: 'Country added successfully',
  ADMIN_CREATED: 'User created successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  OPERATION_SUCCESSFUL: 'Operation completed successfully',
  OPERATION_FAILED: 'Operation failed',
  USER_RETRIEVED: 'User retrieved successfully',
  LOGOUT: 'Logout successful',

  // 🔽 New country-related success messages
  COUNTRY_FETCHED: 'Countries fetched successfully',
  COUNTRY_UPDATED: 'Country updated successfully',
  COUNTRY_DELETED: 'Country deleted successfully',
} as const;
