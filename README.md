# 5PM Nexus Invest - Frontend

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env to set VITE_API_URL (default: http://localhost:5056/api/v1)

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

The frontend will be available at `http://localhost:5173`.

---
# 5PM Nexus Invest - Frontend Development Scope & Requirements

## Project Overview

5PM Nexus Invest is a fintech-powered digital wealth and investment platform that enables users to:

* Register and complete KYC
* Fund investment wallets
* Invest in asset-backed opportunities
* Participate in fractional real estate ownership
* Track portfolios and investment performance
* Receive investment distributions
* Download reports and statements

The frontend should focus heavily on:

* Trust
* Transparency
* Simplicity
* Premium fintech experience
* Mobile responsiveness
* Accessibility

---

# Frontend Technology Stack

## Core

* React.js
* Vite

## Styling

* Tailwind CSS

## State Management

* Zustand

## API Communication

* Axios

## Routing

* React Router DOM

## Forms

* React Hook Form
* Zod Validation

## Tables

* TanStack Table

## Charts

* Recharts

## Notifications

* React Hot Toast

## Date Handling

* Day.js

---

# Application Structure

The frontend should be divided into:

## Public Website

Marketing website.

## Investor Portal

Authenticated user dashboard.

## Admin Portal

Administrative dashboard.

---

# Project Folder Structure

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── tables/
│   ├── cards/
│   ├── modals/
│   └── charts/
├── pages/
│   ├── public/
│   ├── auth/
│   ├── investor/
│   └── admin/
├── layouts/
├── routes/
├── services/
├── hooks/
├── store/
├── utils/
├── constants/
├── types/
└── contexts/
```

---

# PHASE 1 – PUBLIC WEBSITE

## Landing Page

Sections:

### Hero

* Headline
* CTA buttons
* Investment highlights

### Why Choose Us

* Trust
* Transparency
* Asset-backed investments

### Investment Products

* Nexus Income Vault
* Fractional Real Estate
* Wealth Plans

### How It Works

1. Register
2. Complete KYC
3. Fund Wallet
4. Invest
5. Earn Returns

### Statistics Section

* Total Investors
* Assets Under Management
* Projects Funded

### Testimonials

### FAQ

### Footer

---

## Additional Public Pages

* About Us
* Investment Opportunities
* How It Works
* Contact Us
* FAQ
* Terms & Conditions
* Privacy Policy

---

# PHASE 2 – AUTHENTICATION

## Pages

### Login

### Register

### Forgot Password

### Reset Password

### Verify Email

### Verify Phone

### Two-Factor Authentication

---

# PHASE 3 – KYC ONBOARDING

## Step 1

Personal Information

Fields:

* First Name
* Last Name
* DOB
* Gender

---

## Step 2

Address Information

Fields:

* Country
* State
* City
* Address

---

## Step 3

Identity Verification

Fields:

* BVN
* NIN

---

## Step 4

Document Upload

Upload:

* Passport
* Government ID
* Utility Bill

---

## Step 5

Selfie Verification

---

## Step 6

KYC Status Page

Status:

* Pending
* Under Review
* Approved
* Rejected

---

# PHASE 4 – INVESTOR DASHBOARD

## Dashboard Overview

Widgets:

* Portfolio Value
* Wallet Balance
* Total Returns
* Active Investments
* Pending Investments

---

## Charts

* Portfolio Growth
* Investment Performance
* Return History

---

## Recent Activity

* Deposits
* Withdrawals
* Investments
* Distributions

---

# PHASE 5 – WALLET MODULE

## Wallet Overview

Display:

* NGN Balance
* USD Balance

---

## Deposit Flow

Features:

* Deposit Instructions
* Deposit Confirmation

---

## Withdrawal Flow

Features:

* Select Wallet
* Amount
* Bank Account
* Confirmation

---

## Transaction History

Filters:

* Deposits
* Withdrawals
* Investments
* Returns

---

# PHASE 6 – INVESTMENT PRODUCTS

## Investment Marketplace

Display:

* Available Investments
* ROI
* Duration
* Minimum Investment

---

## Investment Details

Display:

* Overview
* Benefits
* Risks
* Performance

---

## Invest Flow

Steps:

1. Select Amount
2. Review
3. Confirm Investment

---

# PHASE 7 – FRACTIONAL REAL ESTATE

## Property Listing Page

Cards:

* Property Image
* Property Name
* Location
* ROI
* Funding Progress

---

## Property Details Page

Sections:

* Gallery
* Overview
* Documents
* Funding Progress
* Investment Units

---

## Investment Flow

Purchase Units

---

# PHASE 8 – PORTFOLIO MANAGEMENT

## Active Investments

## Completed Investments

## Investment History

## ROI Breakdown

## Asset Allocation

---

# PHASE 9 – REPORTS & STATEMENTS

Users can:

* Download Portfolio Report
* Download Wallet Statement
* Download Investment Statement

Formats:

* PDF
* CSV

---

# PHASE 10 – NOTIFICATIONS

## Notification Center

Display:

* KYC Updates
* Deposit Updates
* Investment Updates
* Distribution Updates

---

# PHASE 11 – USER PROFILE

Sections:

## Personal Information

## Security Settings

## Bank Accounts

## Notification Preferences

## Uploaded Documents

---

# ADMIN PORTAL

---

## Admin Dashboard

Cards:

* Total Investors
* Total Investments
* Total Deposits
* Total Withdrawals
* AUM
* Pending KYC

---

## User Management

Features:

* Search Investors
* View Profile
* Suspend User
* Activate User

---

## KYC Management

Features:

* Review Documents
* Approve KYC
* Reject KYC

---

## Wallet Management

Features:

* View Wallets
* Approve Deposits
* Approve Withdrawals

---

## Investment Management

Features:

* Create Product
* Edit Product
* Pause Product
* Delete Product

---

## Property Management

Features:

* Add Property
* Edit Property
* Upload Images
* Upload Documents

---

## Distribution Management

Features:

* View Distributions
* Approve Distribution
* Distribution History

---

## Reports

Features:

* Export Reports
* Download Statements

---

# UI/UX Requirements

## Theme

Premium fintech design.

Style Keywords:

* Modern
* Clean
* Minimal
* Professional
* Trustworthy

---

## Responsive Design

Must support:

* Mobile
* Tablet
* Desktop

---

## Loading States

Every API request should have:

* Skeleton Loaders
* Loading Indicators

---

## Error Handling

Display:

* Empty States
* Error States
* Retry Actions

---

# API Integration Standards

All API calls should:

* Use Axios instance
* Use centralized error handling
* Use token interceptors
* Support refresh tokens

---

# Frontend Deliverables

## Public Website

✅

## Investor Dashboard

✅

## Admin Dashboard

✅

## Wallet System

✅

## KYC Flow

✅

## Investment Marketplace

✅

## Fractional Real Estate Module

✅

## Reporting Module

✅

## Notification Module

✅

## Responsive UI

✅

## API Integration

✅

## Production Build

✅

---

# Development Priority Order

1. Design System
2. Authentication
3. KYC Flow
4. Investor Dashboard
5. Wallet Module
6. Investment Marketplace
7. Property Module
8. Portfolio Module
9. Reports
10. Admin Dashboard
11. API Integration
12. Testing & Optimization
