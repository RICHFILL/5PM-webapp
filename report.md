Frontend UAT Remediation Guide
Project

Investment / Fintech Platform

Purpose

This document provides implementation instructions for the frontend team to address the UAT findings identified during testing.

UAT-005: Weak Password Policy During Registration

Priority: Critical

Objective

Improve account security by enforcing strong password requirements and providing users with clear password guidance during registration.

Required Frontend Changes
1. Password Strength Validation UI

Implement real-time password validation while the user types.

Validation Requirements

Password must contain:

Minimum 12 characters
At least one uppercase letter
At least one lowercase letter
At least one number
At least one special character
Example UI
Password Requirements

✓ Minimum 12 characters
✓ One uppercase letter
✓ One lowercase letter
✓ One number
✓ One special character

Requirements should dynamically update as the user types.

2. Password Strength Indicator

Add a password strength meter.

Example:

Weak
Fair
Good
Strong

The indicator should update in real-time.

3. Confirm Password Field

Add:

Password
Confirm Password

Validation should ensure:

Password === Confirm Password

Display an error message when values do not match.

Example:

Passwords do not match.
4. Registration Form Validation

Prevent form submission when:

Password requirements are not met
Password confirmation does not match

Disable submit button until validation passes.

Acceptance Criteria
Password strength meter is visible
Password requirements are shown
Password confirmation field exists
Registration button remains disabled until valid
Users receive clear validation messages
UAT-006: Loan Interest Rate Can Be Edited By Users

Priority: Critical

Objective

Ensure loan interest rates cannot be modified by customers.

Required Frontend Changes
1. Display Interest Rate as Read-Only

Current behaviour allows editing.

Replace editable fields with read-only information.

Incorrect
Interest Rate [Editable Input]
Correct
Interest Rate: 18%

or

Interest Rate
18% per annum
2. Remove Editable Controls

Remove:

Input fields
Dropdowns
Sliders
Hidden editable controls

related to:

Interest Rate
Loan Pricing
Lending Terms
3. Loan Summary Screen

Display:

Loan Amount
Interest Rate
Repayment Period
Monthly Repayment
Total Repayment

as informational values only.

Users should be able to:

View values
Accept terms
Submit application

Users should NOT be able to modify pricing.

4. Improve User Transparency

Add a notice:

Interest rates are determined by the selected loan product and cannot be modified.
Acceptance Criteria
Interest rates are read-only
No editable interest rate controls exist
Loan summary displays correct pricing information
Users can only review and accept terms
UAT-007: Digital REIT Progress Does Not Update

Priority: High

Objective

Ensure users immediately see updated investment progress after purchasing REIT units.

Required Frontend Changes
1. Refresh REIT Data After Purchase

After successful investment:

Refresh REIT details
Refresh progress indicators
Refresh available units
Refresh allocation statistics

Example flow:

Investment Successful
↓
Refresh REIT Pool
↓
Refresh Portfolio
↓
Update Progress Bar
2. Auto-Update Progress Indicators

The following components must update automatically:

Progress bar
Percentage completed
Available units
Allocated units
User holdings

No manual page refresh should be required.

3. Success Feedback

After successful purchase display:

Investment Successful
Your investment has been recorded.
4. Pending Status Support

If investments require approval:

Display:

Pending Approval

or

Your investment is awaiting verification.

Instead of leaving progress unchanged with no explanation.

5. Portfolio Refresh

Automatically update:

Investment history
Portfolio balance
Owned units
Total investment value
Acceptance Criteria
Progress bar updates automatically
Available units reduce after purchase
Portfolio reflects new holdings
Success message appears
Pending investments are clearly communicated
UAT-008: Help Centre / Guidance Articles

Priority: Medium

Objective

Provide educational content and user guidance throughout the platform.

Required Frontend Changes
1. Create Help Centre Module

Add a dedicated Help Centre accessible from:

Main navigation
User dashboard
Settings page
Footer links
2. Help Centre Homepage

Include:

Search
Search Help Articles

Users should be able to search by keyword.

Categories

Display categories such as:

Getting Started
KYC Verification
Wallet
Investments
REIT Pools
Loans
Withdrawals
Referrals
Security
Popular Articles

Display most-viewed articles.

Recently Updated

Display recently updated articles.

3. Article Detail Page

Each article should support:

Rich Content
Headings
Paragraphs
Images
Lists
Callouts
Embedded videos (optional)
4. Responsive Design

Help Centre must work on:

Mobile devices
Tablets
Desktop browsers
5. Suggested Initial Articles
Getting Started
Creating an Account
Email Verification
Completing KYC
Wallet
Funding Wallet
Withdrawal Guide
Transaction History
Investments
Understanding REIT Pools
Purchasing Shares
Portfolio Tracking
Loans
Loan Eligibility
Applying for a Loan
Loan Repayment
Security
Password Management
Two-Factor Authentication
Account Protection
Acceptance Criteria
Help Centre page exists
Search functionality works
Categories are displayed
Articles are mobile responsive
Users can easily navigate between articles
Frontend Delivery Priority
Sprint 1 (Release Blockers)
Critical
UAT-005: Password Policy Improvements
UAT-006: Loan Interest Rate Protection
Sprint 2
High
UAT-007: REIT Progress Auto Updates
Sprint 3
Medium
UAT-008: Help Centre & User Guidance
Definition of Done

The frontend implementation will be considered complete when:

All critical findings are resolved.
Validation and user feedback are fully implemented.
REIT investment data updates without page refresh.
Help Centre is accessible and searchable.
All changes have been tested on mobile and desktop devices.
No UAT findings can be reproduced by testers.