export const APP_CONSTANTS = {
  // Membership Types
  MEMBERSHIP_TYPES: {
    BASIC: 'Basic',
    PREMIUM: 'Premium',
    VIP: 'VIP'
  },

  // Member Status
  MEMBER_STATUS: {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    SUSPENDED: 'suspended'
  },

  // Payment Methods
  PAYMENT_METHODS: {
    CASH: 'cash',
    CARD: 'card',
    UPI: 'upi',
    BANK_TRANSFER: 'bank_transfer'
  },

  // API Endpoints
  API_ENDPOINTS: {
    MEMBERS: '/api/members',
    PAYMENTS: '/api/payments',
    MEMBERSHIPS: '/api/memberships'
  },

  // Date Formats
  DATE_FORMATS: {
    DISPLAY: 'dd/MM/yyyy',
    API: 'yyyy-MM-dd'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },

  // Colors for status
  STATUS_COLORS: {
    ACTIVE: '#28a745',
    EXPIRED: '#dc3545',
    SUSPENDED: '#ffc107'
  }
};