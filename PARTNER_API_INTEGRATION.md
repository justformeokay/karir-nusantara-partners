# Karir Nusantara Partners - API Integration Documentation

## 📋 Overview

This document provides a comprehensive analysis of the `karir-nusantara-partners` frontend project and defines the required backend API endpoints for full integration with `karir-nusantara-api`.

**Current Date**: February 4, 2026  
**Project Status**: Frontend UI Complete, Backend Integration Required

---

## 📁 STEP 1: FRONTEND STRUCTURE ANALYSIS

### Project Stack
- **Framework**: React + TypeScript + Vite
- **State Management**: React Query (@tanstack/react-query)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **Charts**: Recharts

### Directory Structure

```
karir-nusantara-partners/
├── src/
│   ├── App.tsx                 # Main router setup
│   ├── main.tsx                # Entry point
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── CommissionChart.tsx
│   │   │   ├── CompaniesChart.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/                 # shadcn UI components
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── mock-data.ts        # ⚠️ MOCK DATA - To be replaced
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ReferralLink.tsx
│   │   ├── Companies.tsx
│   │   ├── Transactions.tsx
│   │   ├── Payouts.tsx
│   │   ├── Profile.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   └── types/
│       └── index.ts            # TypeScript interfaces
```

---

## 📄 STEP 2: PAGE-BY-PAGE ANALYSIS

### 1. Login Page (`/login`)

**File**: `src/pages/Login.tsx`

**Purpose**: Partner authentication

**Data Requirements**:
- Email input
- Password input

**User Actions**:
- Submit login form
- Navigate to forgot password (not yet implemented)

**Current Implementation**:
```typescript
// Uses mock authentication in AuthContext.tsx
const login = async (email: string, password: string) => {
  // Simulates API delay, always returns mockUser
}
```

**Required API**:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/partner/auth/login` | Authenticate partner |
| POST | `/api/partner/auth/logout` | Logout / revoke token |
| POST | `/api/partner/auth/refresh` | Refresh JWT token |

---

### 2. Dashboard Page (`/dashboard`)

**File**: `src/pages/Dashboard.tsx`

**Purpose**: Overview of partner performance

**Data Required**:
```typescript
interface DashboardStats {
  totalCompanies: number;        // Total referred companies
  totalTransactions: number;     // Total transactions
  totalCommission: number;       // Total commission earned (IDR)
  availableBalance: number;      // Balance ready for payout
  paidCommission: number;        // Already paid out
}

interface MonthlyData {
  month: string;                 // e.g., "Jan", "Feb"
  commission: number;            // Commission for that month
  companies: number;             // Companies registered that month
}
```

**Charts**:
1. **CommissionChart**: Area chart showing monthly commission growth
2. **CompaniesChart**: Bar chart showing monthly company registrations

**Required API**:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/partner/dashboard/stats` | Get dashboard statistics |
| GET | `/api/partner/dashboard/monthly` | Get monthly chart data |

---

### 3. Referral Link Page (`/referral-link`)

**File**: `src/pages/ReferralLink.tsx`

**Purpose**: Display referral code and link for sharing

**Data Required**:
```typescript
interface ReferralInfo {
  referralCode: string;          // e.g., "AHMAD2024"
  referralLink: string;          // Full URL with ref parameter
}
```

**Features**:
- Copy link to clipboard
- Copy code to clipboard
- QR code generation (uses external API: qrserver.com)
- Download QR code

**Required API**:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/partner/referral` | Get referral code and link |

---

### 4. Companies Page (`/companies`)

**File**: `src/pages/Companies.tsx`

**Purpose**: List all companies referred by the partner

**Data Required**:
```typescript
interface Company {
  id: string;
  name: string;
  registrationDate: string;      // ISO date
  status: 'active' | 'inactive';
  totalJobPosts: number;
  totalRevenue: number;          // Revenue from this company
  commissionEarned: number;      // 40% of revenue
}
```

**Features**:
- Search by company name
- Pagination (15 items per page)
- Summary stats:
  - Total companies count
  - Total revenue generated
  - Total commission (40%)

**Required API**:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/partner/companies` | Get paginated companies list |
| GET | `/api/partner/companies/summary` | Get companies summary stats |

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 15)
- `search` (optional: company name search)

---

### 5. Transactions Page (`/transactions`)

**File**: `src/pages/Transactions.tsx`

**Purpose**: View all commission transactions

**Data Required**:
```typescript
interface Transaction {
  id: string;
  date: string;                  // ISO date
  companyName: string;
  companyId: string;
  jobQuota: number;              // Number of job posts purchased
  amount: number;                // Transaction amount (company paid)
  commission: number;            // 40% commission
  status: 'pending' | 'paid';
}
```

**Features**:
- Search by company name
- Filter by status (all/pending/paid)
- Pagination (15 items per page)
- Summary stats:
  - Total commission
  - Pending commission
  - Paid commission

**Required API**:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/partner/transactions` | Get paginated transactions |
| GET | `/api/partner/transactions/summary` | Get transaction summary |

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 15)
- `search` (optional)
- `status` (optional: 'pending' | 'paid')

---

### 6. Payouts Page (`/payouts`)

**File**: `src/pages/Payouts.tsx`

**Purpose**: View payout information and status

**Data Required**:
```typescript
interface PayoutInfo {
  availableBalance: number;      // Ready for payout
  pendingPayout: number;         // Being processed
  paidAmount: number;            // Lifetime payouts
  lastPayoutDate?: string;       // ISO date
}

interface BankAccount {
  bankName: string;
  accountNumber: string;         // Masked: ****4521
  accountHolder: string;
}
```

**Features**:
- Balance display (available, pending, paid)
- Bank account info (read-only)
- Download reports (PDF/CSV)
- Payout schedule info

**Required API**:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/partner/payouts` | Get payout information |
| GET | `/api/partner/payouts/history` | Get payout history |
| GET | `/api/partner/payouts/export` | Export report (PDF/CSV) |

---

### 7. Profile Page (`/profile`)

**File**: `src/pages/Profile.tsx`

**Purpose**: View and manage partner profile

**Data Required**:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  accountStatus: 'active' | 'inactive' | 'pending';
  bankAccount?: BankAccount;
  createdAt: string;
}
```

**Features**:
- View profile info (read-only)
- View bank account (managed by admin)
- Update display name
- Change password

**Required API**:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/partner/profile` | Get partner profile |
| PATCH | `/api/partner/profile` | Update display name |
| POST | `/api/partner/password/change` | Change password |

---

## 🗄️ STEP 3: DATABASE ANALYSIS

### Current Database State

The existing `karir_nusantara` database **DOES NOT** have referral partner tables. Current tables include:

**Existing Tables**:
- `users` (roles: job_seeker, company, admin)
- `companies`
- `company_quotas`
- `payments`
- `jobs`
- `applications`
- And others...

### ⚠️ MISSING: Referral Partner Tables

The following tables need to be created:

---

### New Table: `referral_partners`

```sql
CREATE TABLE `referral_partners` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `referral_code` varchar(20) NOT NULL UNIQUE,
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 40.00 COMMENT 'Commission percentage',
  `status` enum('active','inactive','pending','suspended') NOT NULL DEFAULT 'pending',
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_number` varchar(50) DEFAULT NULL,
  `bank_account_holder` varchar(255) DEFAULT NULL,
  `is_bank_verified` tinyint(1) NOT NULL DEFAULT 0,
  `total_referrals` int(11) NOT NULL DEFAULT 0 COMMENT 'Cached count',
  `total_commission` bigint(20) NOT NULL DEFAULT 0 COMMENT 'Cached total',
  `available_balance` bigint(20) NOT NULL DEFAULT 0 COMMENT 'Ready for payout',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  UNIQUE KEY `uk_referral_code` (`referral_code`),
  KEY `idx_status` (`status`),
  KEY `idx_referral_code` (`referral_code`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### New Table: `partner_referrals`

Links partners to referred companies.

```sql
CREATE TABLE `partner_referrals` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `partner_id` bigint(20) UNSIGNED NOT NULL COMMENT 'referral_partners.id',
  `company_id` bigint(20) UNSIGNED NOT NULL COMMENT 'companies.id',
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Company has been verified',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_partner_company` (`partner_id`, `company_id`),
  KEY `idx_partner_id` (`partner_id`),
  KEY `idx_company_id` (`company_id`),
  FOREIGN KEY (`partner_id`) REFERENCES `referral_partners` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### New Table: `partner_commissions`

Tracks commission earned per transaction.

```sql
CREATE TABLE `partner_commissions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `partner_id` bigint(20) UNSIGNED NOT NULL,
  `referral_id` bigint(20) UNSIGNED NOT NULL COMMENT 'partner_referrals.id',
  `payment_id` bigint(20) UNSIGNED NOT NULL COMMENT 'payments.id',
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_amount` bigint(20) NOT NULL COMMENT 'Original payment amount',
  `commission_rate` decimal(5,2) NOT NULL COMMENT 'Rate at time of transaction',
  `commission_amount` bigint(20) NOT NULL COMMENT 'Calculated commission',
  `job_quota` int(11) NOT NULL COMMENT 'Number of job posts',
  `status` enum('pending','approved','paid','cancelled') NOT NULL DEFAULT 'pending',
  `approved_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `payout_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_partner_id` (`partner_id`),
  KEY `idx_referral_id` (`referral_id`),
  KEY `idx_payment_id` (`payment_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`partner_id`) REFERENCES `referral_partners` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`referral_id`) REFERENCES `partner_referrals` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### New Table: `partner_payouts`

Tracks payout history.

```sql
CREATE TABLE `partner_payouts` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `partner_id` bigint(20) UNSIGNED NOT NULL,
  `amount` bigint(20) NOT NULL,
  `bank_name` varchar(100) NOT NULL COMMENT 'Snapshot at payout time',
  `bank_account_number` varchar(50) NOT NULL,
  `bank_account_holder` varchar(255) NOT NULL,
  `status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
  `transfer_ref` varchar(100) DEFAULT NULL COMMENT 'Bank transfer reference',
  `processed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_partner_id` (`partner_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`partner_id`) REFERENCES `referral_partners` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### Modify: `users` Table

Add 'partner' to role enum:

```sql
ALTER TABLE `users` 
MODIFY `role` enum('job_seeker','company','admin','partner') NOT NULL DEFAULT 'job_seeker';
```

---

### Modify: `companies` Table

Add referral tracking:

```sql
ALTER TABLE `companies`
ADD COLUMN `referred_by` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'referral_partners.id',
ADD COLUMN `referral_code_used` varchar(20) DEFAULT NULL COMMENT 'Code used at registration',
ADD KEY `idx_referred_by` (`referred_by`),
ADD FOREIGN KEY (`referred_by`) REFERENCES `referral_partners` (`id`) ON DELETE SET NULL;
```

---

## 🔌 STEP 4: COMPLETE API ENDPOINT SPECIFICATION

### Base URL
```
https://api.karirnusantara.id/api/partner
```

### Authentication
All endpoints require JWT Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

### Authentication APIs

#### POST `/api/partner/auth/login`

**Purpose**: Authenticate partner and get JWT token

**Request Body**:
```json
{
  "email": "partner@example.com",
  "password": "securepassword"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "1",
      "name": "Ahmad Pratama",
      "email": "ahmad.pratama@email.com",
      "referralCode": "AHMAD2024",
      "accountStatus": "active",
      "createdAt": "2024-01-15T00:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
    "expiresIn": 3600
  }
}
```

**Response (401)**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### POST `/api/partner/auth/logout`

**Purpose**: Revoke refresh token

**Request Body**:
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST `/api/partner/auth/refresh`

**Purpose**: Get new access token

**Request Body**:
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

---

### Dashboard APIs

#### GET `/api/partner/dashboard/stats`

**Purpose**: Get dashboard statistics

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "totalCompanies": 24,
    "totalTransactions": 156,
    "totalCommission": 47850000,
    "availableBalance": 12500000,
    "paidCommission": 35350000
  }
}
```

---

#### GET `/api/partner/dashboard/monthly`

**Purpose**: Get monthly chart data (last 7 months)

**Response (200)**:
```json
{
  "success": true,
  "data": [
    { "month": "Jul", "commission": 3200000, "companies": 2 },
    { "month": "Aug", "commission": 4500000, "companies": 3 },
    { "month": "Sep", "commission": 5100000, "companies": 4 },
    { "month": "Oct", "commission": 6800000, "companies": 5 },
    { "month": "Nov", "commission": 8200000, "companies": 4 },
    { "month": "Dec", "commission": 9500000, "companies": 6 },
    { "month": "Jan", "commission": 10550000, "companies": 5 }
  ]
}
```

---

### Referral APIs

#### GET `/api/partner/referral`

**Purpose**: Get referral code and link

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "referralCode": "AHMAD2024",
    "referralLink": "https://karirnusantara.id/register?ref=AHMAD2024",
    "commissionRate": 40
  }
}
```

---

### Companies APIs

#### GET `/api/partner/companies`

**Purpose**: Get paginated list of referred companies

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 15)
- `search` (string, optional)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "1",
        "name": "PT Teknologi Maju",
        "registrationDate": "2024-01-20T00:00:00Z",
        "status": "active",
        "totalJobPosts": 45,
        "totalRevenue": 22500000,
        "commissionEarned": 9000000
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 24,
      "itemsPerPage": 15
    }
  }
}
```

---

#### GET `/api/partner/companies/summary`

**Purpose**: Get companies summary statistics

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "totalCompanies": 24,
    "activeCompanies": 20,
    "totalRevenue": 119750000,
    "totalCommission": 47900000
  }
}
```

---

### Transactions APIs

#### GET `/api/partner/transactions`

**Purpose**: Get paginated commission transactions

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 15)
- `search` (string, optional)
- `status` (string, optional: 'pending' | 'paid')

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "1",
        "date": "2025-01-28T00:00:00Z",
        "companyName": "PT Teknologi Maju",
        "companyId": "1",
        "jobQuota": 10,
        "amount": 5000000,
        "commission": 2000000,
        "status": "pending"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 11,
      "totalItems": 156,
      "itemsPerPage": 15
    }
  }
}
```

---

#### GET `/api/partner/transactions/summary`

**Purpose**: Get transaction summary

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "totalCommission": 47850000,
    "pendingCommission": 3000000,
    "paidCommission": 44850000,
    "totalTransactions": 156
  }
}
```

---

### Payouts APIs

#### GET `/api/partner/payouts`

**Purpose**: Get payout information

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "balance": {
      "availableBalance": 12500000,
      "pendingPayout": 3000000,
      "paidAmount": 35350000,
      "lastPayoutDate": "2025-01-20T00:00:00Z"
    },
    "bankAccount": {
      "bankName": "Bank Central Asia",
      "accountNumber": "****4521",
      "accountHolder": "Ahmad Pratama",
      "isVerified": true
    },
    "schedule": {
      "processingDay": 20,
      "minimumPayout": 500000,
      "transferTime": "1-3 Business Days"
    }
  }
}
```

---

#### GET `/api/partner/payouts/history`

**Purpose**: Get payout history

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 15)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "payouts": [
      {
        "id": "1",
        "amount": 7600000,
        "status": "completed",
        "transferRef": "TRF123456",
        "processedAt": "2025-01-20T10:00:00Z",
        "createdAt": "2025-01-18T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 42,
      "itemsPerPage": 15
    }
  }
}
```

---

#### GET `/api/partner/payouts/export`

**Purpose**: Export payout report

**Query Parameters**:
- `format` ('pdf' | 'csv')
- `startDate` (ISO date, optional)
- `endDate` (ISO date, optional)

**Response (200)**: File download

---

### Profile APIs

#### GET `/api/partner/profile`

**Purpose**: Get partner profile

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Ahmad Pratama",
    "email": "ahmad.pratama@email.com",
    "referralCode": "AHMAD2024",
    "accountStatus": "active",
    "bankAccount": {
      "bankName": "Bank Central Asia",
      "accountNumber": "****4521",
      "accountHolder": "Ahmad Pratama"
    },
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

#### PATCH `/api/partner/profile`

**Purpose**: Update partner name

**Request Body**:
```json
{
  "name": "Ahmad Pratama Updated"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

#### POST `/api/partner/password/change`

**Purpose**: Change password

**Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🔒 STEP 5: SECURITY & AUTHORIZATION

### JWT Token Structure

```json
{
  "sub": "partner_1",
  "email": "partner@example.com",
  "role": "partner",
  "partnerId": 1,
  "referralCode": "AHMAD2024",
  "iat": 1706745600,
  "exp": 1706749200
}
```

### Authorization Rules

1. **Partner Role Isolation**:
   - Partners can ONLY access `/api/partner/*` endpoints
   - Partner tokens CANNOT access admin or company APIs
   - Validate `role === 'partner'` on every request

2. **Data Ownership**:
   - Partners can ONLY see their own referrals
   - All queries must filter by `partner_id`
   - Commission values are READ-ONLY

3. **Financial Security**:
   - Commission calculations happen server-side only
   - Bank account updates require admin approval
   - Payouts are processed by admin only

4. **Middleware Chain**:
   ```go
   router.Use(
     middleware.RateLimiter,
     middleware.JWTAuth,
     middleware.PartnerOnly,
     middleware.AuditLog,
   )
   ```

---

## 📊 STEP 6: DATA FLOW

### Commission Calculation Flow

```
1. Company registers with referral code
   └─> Create partner_referrals record
   └─> Link companies.referred_by to partner

2. Company makes payment (confirmed)
   └─> Create partner_commissions record
   └─> Calculate: commission = amount × rate (40%)
   └─> Status: 'pending'
   └─> Update partner.available_balance

3. Admin processes payout
   └─> Create partner_payouts record
   └─> Update commissions status to 'paid'
   └─> Deduct from available_balance
```

### Caching Strategy

| Data | Caching | Duration |
|------|---------|----------|
| Dashboard stats | Redis | 5 minutes |
| Monthly charts | Redis | 15 minutes |
| Companies list | No cache | Real-time |
| Transactions | No cache | Real-time |
| Profile | Redis | 30 minutes |

### Pagination

- Default: 15 items per page
- Max: 100 items per page
- Total count included in response

---

## 🚀 STEP 7: IMPLEMENTATION ROADMAP

### Phase 1: Database Setup
1. [ ] Add 'partner' role to users table
2. [ ] Create `referral_partners` table
3. [ ] Create `partner_referrals` table
4. [ ] Create `partner_commissions` table
5. [ ] Create `partner_payouts` table
6. [ ] Add `referred_by` to companies table

### Phase 2: Core APIs
1. [ ] Partner authentication (login/logout/refresh)
2. [ ] Profile endpoints (GET/PATCH)
3. [ ] Referral code endpoint
4. [ ] Dashboard stats endpoint

### Phase 3: Data APIs
1. [ ] Companies list with pagination
2. [ ] Transactions list with filtering
3. [ ] Payout information endpoint
4. [ ] Monthly chart data endpoint

### Phase 4: Integration
1. [ ] Update frontend AuthContext to use real API
2. [ ] Create API service layer in frontend
3. [ ] Replace mock data with API calls
4. [ ] Add error handling and loading states

### Phase 5: Advanced Features
1. [ ] Payout export (PDF/CSV)
2. [ ] Email notifications
3. [ ] Admin partner management
4. [ ] Webhook for company registration

---

## 📝 NOTES & RECOMMENDATIONS

### Frontend Adjustments Needed

1. **AuthContext.tsx**: Replace mock login with API call
2. **Add API Service**: Create `src/lib/api.ts` for all API calls
3. **Error States**: Add error boundaries and toast notifications
4. **Loading States**: Add skeleton loaders for data tables
5. **Token Refresh**: Implement automatic token refresh logic

### Backend Module Structure

```
internal/modules/partner/
├── handler.go          # HTTP handlers
├── service.go          # Business logic
├── repository.go       # Database queries
├── models.go           # Domain models
├── dto.go              # Request/Response DTOs
└── routes.go           # Route definitions
```

### Existing Code Reuse

Can reuse from existing modules:
- JWT authentication from `internal/modules/auth`
- Pagination utilities from `internal/shared`
- Error handling patterns from existing handlers
- Database connection from `internal/database`

---

## ✅ CHECKLIST

- [ ] Database migrations created
- [ ] Partner module structure created
- [ ] Authentication endpoints implemented
- [ ] Dashboard endpoints implemented
- [ ] Companies endpoints implemented
- [ ] Transactions endpoints implemented
- [ ] Payouts endpoints implemented
- [ ] Profile endpoints implemented
- [ ] Frontend API integration complete
- [ ] Testing complete
- [ ] Documentation updated

---

**Document Version**: 1.0  
**Created**: February 4, 2026  
**Author**: GitHub Copilot (Claude Opus 4.5)
