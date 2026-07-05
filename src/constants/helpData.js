export const categories = [
  { id: "getting-started", label: "Getting Started", icon: "Rocket" },
  { id: "kyc-verification", label: "KYC Verification", icon: "Shield" },
  { id: "wallet", label: "Wallet", icon: "Wallet" },
  { id: "investments", label: "Investments", icon: "TrendingUp" },
  { id: "reit-pools", label: "REIT Pools", icon: "Building" },
  { id: "loans", label: "Loans", icon: "Banknote" },
  { id: "withdrawals", label: "Withdrawals", icon: "ArrowRight" },
  { id: "referrals", label: "Referrals", icon: "Users" },
  { id: "security", label: "Security", icon: "Lock" },
];

export const articles = [
  {
    id: "creating-an-account",
    title: "Creating an Account",
    category: "getting-started",
    summary: "Step-by-step guide to creating your 5PM Nexus Invest account.",
    content: `
      <h2>Getting Started with 5PM Nexus Invest</h2>
      <p>Creating an account on 5PM Nexus Invest is quick and straightforward. Follow the steps below to begin your investment journey.</p>
      <h3>Step 1: Visit the Registration Page</h3>
      <p>Click the "Get Started" button on the homepage or navigate directly to the registration page.</p>
      <h3>Step 2: Fill in Your Details</h3>
      <p>Provide your first name, last name, email address, and create a strong password. Your password must be at least 12 characters long and include uppercase, lowercase, numbers, and special characters.</p>
      <h3>Step 3: Verify Your Email</h3>
      <p>After registration, you will receive a verification email. Click the verification link to activate your account.</p>
      <h3>Step 4: Complete Your Profile</h3>
      <p>Once verified, log in and complete your profile information to proceed with KYC verification.</p>
    `,
    views: 1240,
    updatedAt: "2026-06-28",
  },
  {
    id: "email-verification",
    title: "Email Verification",
    category: "getting-started",
    summary: "How to verify your email address and activate your account.",
    content: `
      <h2>Email Verification Guide</h2>
      <p>Email verification is required to activate your account and ensure the security of your investments.</p>
      <h3>How to Verify</h3>
      <p>After registering, check your email inbox for a message from 5PM Nexus Invest. Click the verification link in the email to confirm your address.</p>
      <h3>Didn't Receive the Email?</h3>
      <p>Check your spam or junk folder. If you still cannot find it, you can request a new verification email from your profile settings or the verification page.</p>
    `,
    views: 980,
    updatedAt: "2026-06-25",
  },
  {
    id: "completing-kyc",
    title: "Completing KYC Verification",
    category: "kyc-verification",
    summary: "Understand the KYC process and documents required for verification.",
    content: `
      <h2>KYC Verification Process</h2>
      <p>All investors must complete KYC (Know Your Customer) verification before making any investments. This is a regulatory requirement.</p>
      <h3>Required Documents</h3>
      <ul>
        <li>Valid government-issued ID (Passport, Driver's License, or National ID)</li>
        <li>Proof of address (utility bill or bank statement)</li>
        <li>Selfie photo for facial verification</li>
      </ul>
      <h3>Verification Steps</h3>
      <p>Navigate to the KYC page from your dashboard. Follow the step-by-step process to submit your personal information, address details, and documents. Once submitted, our team will review your application within 24-48 hours.</p>
    `,
    views: 2100,
    updatedAt: "2026-06-30",
  },
  {
    id: "funding-wallet",
    title: "Funding Your Wallet",
    category: "wallet",
    summary: "Learn how to deposit funds into your wallet to start investing.",
    content: `
      <h2>Funding Your Wallet</h2>
      <p>To make investments, you first need to fund your wallet. Here's how it works.</p>
      <h3>Step 1: Navigate to Wallet</h3>
      <p>Go to the Wallet section from your dashboard sidebar.</p>
      <h3>Step 2: Choose Deposit</h3>
      <p>Click on the "Deposit" button and select your preferred funding method.</p>
      <h3>Step 3: Transfer Funds</h3>
      <p>You will receive our designated bank account details. Transfer the desired amount and the funds will be credited to your wallet after confirmation.</p>
    `,
    views: 1560,
    updatedAt: "2026-06-27",
  },
  {
    id: "withdrawal-guide",
    title: "Withdrawal Guide",
    category: "withdrawals",
    summary: "Step-by-step instructions for withdrawing funds from your account.",
    content: `
      <h2>Withdrawal Guide</h2>
      <p>Withdrawing your funds is simple. Follow the steps below to request a withdrawal.</p>
      <h3>Step 1: Go to Wallet</h3>
      <p>Navigate to your Wallet page and click on "Withdraw".</p>
      <h3>Step 2: Enter Amount</h3>
      <p>Specify the amount you wish to withdraw. Ensure it does not exceed your available balance.</p>
      <h3>Step 3: Confirm Bank Details</h3>
      <p>Provide your bank account details where the funds will be sent. Double-check the information to avoid delays.</p>
      <h3>Processing Time</h3>
      <p>Withdrawals are processed within 1-3 business days after approval.</p>
    `,
    views: 890,
    updatedAt: "2026-06-26",
  },
  {
    id: "transaction-history",
    title: "Transaction History",
    category: "wallet",
    summary: "How to view and understand your transaction history on the platform.",
    content: `
      <h2>Transaction History</h2>
      <p>Your transaction history provides a complete record of all activities on your account.</p>
      <h3>Accessing Transaction History</h3>
      <p>Go to your Wallet page and scroll to the transaction history section. You can filter by date range and transaction type.</p>
      <h3>Understanding Transactions</h3>
      <p>Each transaction shows the date, type (deposit, withdrawal, investment, return), amount, and status. Use this to track your financial activities.</p>
    `,
    views: 670,
    updatedAt: "2026-06-24",
  },
  {
    id: "understanding-reit-pools",
    title: "Understanding REIT Pools",
    category: "reit-pools",
    summary: "Learn about Digital REIT Pools and how they work.",
    content: `
      <h2>Understanding REIT Pools</h2>
      <p>Digital REIT Pools allow you to invest in professionally managed real estate portfolios.</p>
      <h3>What is a REIT Pool?</h3>
      <p>A REIT (Real Estate Investment Trust) Pool is a collection of income-generating real estate assets. By purchasing shares, you gain exposure to a diversified property portfolio.</p>
      <h3>How It Works</h3>
      <p>Each pool has a share price, total shares available, and an annual yield. You can buy shares in open pools and earn returns based on the pool's performance.</p>
    `,
    views: 1430,
    updatedAt: "2026-06-29",
  },
  {
    id: "purchasing-shares",
    title: "Purchasing REIT Shares",
    category: "reit-pools",
    summary: "How to buy shares in a Digital REIT Pool.",
    content: `
      <h2>Purchasing REIT Shares</h2>
      <p>Buying shares in a REIT Pool is simple and can be done directly from your dashboard.</p>
      <h3>Step 1: Browse Pools</h3>
      <p>Navigate to the REIT Pools page to see available pools with their share prices, yields, and availability.</p>
      <h3>Step 2: Select a Pool</h3>
      <p>Choose a pool that matches your investment goals and click "Buy Shares".</p>
      <h3>Step 3: Enter Quantity</h3>
      <p>Specify the number of shares you want to purchase. The total cost will be calculated automatically.</p>
      <h3>Step 4: Confirm</h3>
      <p>Review the details and confirm your purchase. Your investment will be recorded immediately.</p>
    `,
    views: 1120,
    updatedAt: "2026-06-28",
  },
  {
    id: "portfolio-tracking",
    title: "Portfolio Tracking",
    category: "investments",
    summary: "Track your investment portfolio and monitor performance.",
    content: `
      <h2>Portfolio Tracking</h2>
      <p>Monitor the performance of all your investments in one place.</p>
      <h3>Your Portfolio Dashboard</h3>
      <p>The Portfolio page gives you a comprehensive view of your investments, including total value, returns, and allocation across different products.</p>
      <h3>Performance Metrics</h3>
      <p>View key metrics such as ROI, growth trends, and return history to make informed decisions about your investments.</p>
    `,
    views: 780,
    updatedAt: "2026-06-23",
  },
  {
    id: "loan-eligibility",
    title: "Loan Eligibility",
    category: "loans",
    summary: "Check if you qualify for an asset-backed loan.",
    content: `
      <h2>Loan Eligibility</h2>
      <p>5PM Nexus Loans allow you to access credit using your investment portfolio as collateral.</p>
      <h3>Eligibility Requirements</h3>
      <ul>
        <li>Active account with completed KYC</li>
        <li>Minimum investment portfolio value</li>
        <li>Good standing with no defaults</li>
      </ul>
      <h3>Loan Amount</h3>
      <p>The loan amount you can access depends on the value of your investment portfolio. Interest rates are determined by the selected loan product.</p>
    `,
    views: 920,
    updatedAt: "2026-06-27",
  },
  {
    id: "applying-for-loan",
    title: "Applying for a Loan",
    category: "loans",
    summary: "Step-by-step guide to applying for a loan on the platform.",
    content: `
      <h2>Applying for a Loan</h2>
      <p>Follow these steps to apply for an asset-backed loan.</p>
      <h3>Step 1: Visit Loans Page</h3>
      <p>Navigate to the Loans section from your dashboard.</p>
      <h3>Step 2: Click Apply</h3>
      <p>Click the "Apply for Loan" button to open the application form.</p>
      <h3>Step 3: Enter Details</h3>
      <p>Provide the loan amount, repayment term, and purpose. The interest rate is determined by the loan product.</p>
      <h3>Step 4: Submit</h3>
      <p>Review your application and submit. You will receive a notification once your application is processed.</p>
    `,
    views: 650,
    updatedAt: "2026-06-26",
  },
  {
    id: "loan-repayment",
    title: "Loan Repayment",
    category: "loans",
    summary: "Understand how loan repayment works on the platform.",
    content: `
      <h2>Loan Repayment</h2>
      <p>Repaying your loan is straightforward and can be managed from your dashboard.</p>
      <h3>Repayment Schedule</h3>
      <p>Your repayment schedule shows the amount due each month. You can view upcoming payments and track your repayment progress on the loan detail page.</p>
      <h3>Making Payments</h3>
      <p>Ensure your wallet has sufficient funds before each payment date. Automatic deductions and manual payment options are available.</p>
    `,
    views: 540,
    updatedAt: "2026-06-25",
  },
  {
    id: "password-management",
    title: "Password Management",
    category: "security",
    summary: "Tips for creating and managing a strong password.",
    content: `
      <h2>Password Management</h2>
      <p>Keeping your account secure starts with a strong password.</p>
      <h3>Creating a Strong Password</h3>
      <p>Use at least 12 characters with a mix of uppercase, lowercase, numbers, and special characters. Avoid using personal information or common words.</p>
      <h3>Updating Your Password</h3>
      <p>You can change your password from your Profile settings. For security reasons, change your password regularly and never share it with anyone.</p>
    `,
    views: 430,
    updatedAt: "2026-06-22",
  },
  {
    id: "two-factor-authentication",
    title: "Two-Factor Authentication",
    category: "security",
    summary: "Learn how to enable 2FA for enhanced account security.",
    content: `
      <h2>Two-Factor Authentication</h2>
      <p>Two-factor authentication (2FA) adds an extra layer of security to your account.</p>
      <h3>Enabling 2FA</h3>
      <p>Go to your Profile settings and navigate to the Security section. Click "Enable 2FA" and follow the instructions to set up your preferred authentication method.</p>
      <h3>Authentication Methods</h3>
      <p>You can use an authenticator app (like Google Authenticator) or SMS-based verification.</p>
    `,
    views: 380,
    updatedAt: "2026-06-21",
  },
  {
    id: "account-protection",
    title: "Account Protection Tips",
    category: "security",
    summary: "Best practices to keep your account safe and secure.",
    content: `
      <h2>Account Protection Tips</h2>
      <p>Follow these best practices to keep your account secure.</p>
      <h3>Do's</h3>
      <ul>
        <li>Use a unique, strong password</li>
        <li>Enable two-factor authentication</li>
        <li>Log out from shared devices</li>
        <li>Monitor your account regularly</li>
      </ul>
      <h3>Don'ts</h3>
      <ul>
        <li>Never share your password</li>
        <li>Avoid using public Wi-Fi for transactions</li>
        <li>Don't click suspicious links</li>
      </ul>
    `,
    views: 310,
    updatedAt: "2026-06-20",
  },
];
