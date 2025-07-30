// backend/src/domain/constants/errorMessages.constant.ts
export const ERRORMESSAGES = {
  INVALID_IMAGE_TYPE: 'Only JPEG and PNG images are allowed',
  IMAGE_SIZE_EXCEEDED: 'Image size must not exceed 5MB',
  ADMIN_NO_ACCESS_TOKEN_PROVIDED: 'No access token provided by ADMIN',
  ADMIN_NOT_FOUND: 'ADMIN not found',
  ADMIN_INVALID_ROLE: 'Invalid role',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  USER_CREATION_FAILED: 'Failed to create user',
  INVALID_CREDENTIALS: 'Invalid email or password',
  LOGIN_FAILED: 'Failed to login',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  USER_NOT_FOUND: 'User not found',
  ADMIN_NOT_AUTHENTICATED: 'ADMIN_NOT_AUTHENTICATED',

  // 🔽 New country-related errors
  COUNTRY_NOT_FOUND: 'Country not found',
  COUNTRY_CREATION_FAILED: 'Failed to create country',
  COUNTRY_UPDATE_FAILED: 'Failed to update country',
  COUNTRY_DELETE_FAILED: 'Failed to delete country',
  COUNTRY_ALREADY_EXISTS: 'Country with this name already exists',

} as const;
