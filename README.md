# 🎖️ Military & Security Services Pension Fund (MSSPF) Portal
### Sultanate of Oman | Integrated Multi-Portal Administration Suite

https://mssf-portal.vercel.app/calculator

Welcome to the official repository of the **MSSPF Client Website & Multi-Portal Administration Platform**. This platform is a state-of-the-art, high-fidelity Angular 21 application built to represent a prestigious, government-grade administrative environment for the Sultanate of Oman.

The system is designed with **Tailwind CSS v4** and incorporates a luxurious design system reflecting the dignity of national service: a tailored palette of military brown (`#3E321A`), olive gold (`#9E9B46`), sand cream (`#FAF6F0`), and golden amber highlights (`#D39D55`), fully responsive layouts, smooth micro-animations, and complete bidirectionality (English LTR and Arabic RTL with physical mirroring).

---

## 🚀 Architectural Narrative: Your Engineering Journey (For Recruiters)

*When speaking with recruiters, technical leads, or hiring managers, use the narrative below to explain how you conceived, designed, and executed this complex system.*

### "How I Built the MSSPF Multi-Portal Platform from Scratch"

> "To build a modern web platform representing the Sultanate of Oman's Military and Security Services Pension Fund (MSSPF), I followed a meticulous, component-driven development methodology. The project requirements demanded a government-grade digital experience serving seven separate portals under a single cohesive brand. Here is how I brought this project to life, step by step:
>
> 1. **Framework Selection & Setup**: 
>    I chose **Angular 21** as the core framework because of its strict typing, reliable dependency injection, and native support for enterprise-grade modular routing. I initialized a strict **Standalone Workspace** (strictly no `NgModule` declarations) to keep the bundle lightweight, modular, and optimized.
>
> 2. **Luxurious Styling & Layout Bidirectionality**:
>    I set up **Tailwind CSS v4** as the styling foundation. Tailwind v4 allows defining custom themes directly in the global css entry point (`src/styles.css`). I defined CSS custom properties for a military-inspired palette: military brown (`#3E321A`), olive gold (`#9E9B46`), gold borders, and elegant serif typography (`Playfair Display` for headlines, `Noto Naskh Arabic` for RTL typography, and `Source Sans 3` for text body). 
>    Crucially, since the application must support both English and Arabic, I designed a custom `LanguageService` that dynamically toggles the HTML `dir` attribute (`ltr` or `rtl`). Tailwind v4 automatically handles text alignment, but I wrote physical mirror utilities (such as `flip-rtl` using `transform: scaleX(-1)`) to dynamically adjust navigation arrows and layout flow.
>
> 3. **Signals-Based Reactive State Management**:
>    Instead of utilizing heavy external state libraries, I leveraged **Angular Signals**. I built a collection of specialized services inside `core/services/` to manage reactive data flow:
>    * `LanguageService` to compute layout directions and return correct dictionary key translations.
>    * `AuthService` to manage unauthenticated and authenticated sessions (linked via Civil ID and mock OTP).
>    * `PensionService` to store and calculate Omani pension entitlement values using mathematical rank vectors and service duration multipliers.
>    * `ChatService` simulating a real-time reactive live helpdesk using RxJS streaming behaviors.
>
> 4. **16 Reusable Shared Standalone Components**:
>    To keep the codebase DRY (Don't Repeat Yourself), I built a robust design system containing 16 core components inside `src/app/shared/`:
>    * **Toast Stack**: Dynamic sliding notices loaded app-wide to give users feedback on operations.
>    * **Interactive Header (Navbar) & Sidebar**: Designed with a responsive slide-out **Mobile Drawer**, reducing congestion on smaller screens and ensuring clear text sizes, while integrating the official crest logo.
>    * **Circular OTP Input & Countdown**: A secure form control that automatically blocks inputs when a timer expires.
>    * **Interactive Pension Calculator Component**: A Signal-powered tool that live-estimates net pensions based on salary, service years, and military rank.
>    * **PDF Viewer Previewer**: Mocking official entitlement certification sheets before download.
>    * **Slots Picker & Calendar**: An interactive week-day calendar grid allowing retirees to book appointments.
>    * **Steppers & Timelines**: To render multi-step claim wizards (like the Funeral Claim flow) and audit trails.
>
> 5. **7 Lazy-Loaded Portal Gateways**:
>    I structured the application routing around 7 key user-specific portals, all lazily loaded to ensure an excellent first-contentful paint:
>    * **Public SEO Website**: General home, about, news listing, interactive calculators, FAQ, and inquiries.
>    * **Retiree Guarded Portal**: Requiring Civil ID & OTP. Contains dashboards, bank account modifications, appointment bookings, certificate mock downloads, and a live-chat room.
>    * **Visitor Portal**: Incorporating a draft-saved claim wizard utilizing `localStorage` to preserve progress.
>    * **Company Registrar**: Providing registration workflows for military contractors.
>    * **Commercial Bank Gateway**: A dedicated dashboard for Omani banks to coordinate loan deductions.
>    * **Ministry of Labor Integration**: Query-only government clearance interface.
>    * **Court & Judicial Executions**: Allowing judicial authorities to upload court-ordered child support deductions.
>
> 6. **Production Compilation & Polish**:
>    I resolved strict compiler configurations (handling index signatures dynamically via bracket access to comply with strict TypeScript) and achieved a 100% successful production build compile with zero errors."

---

## 📂 Codebase Directory & Functional Map

The project is structured under a strict standalone architecture:

```
msspf-portal/
├── public/
│   ├── favicon.ico
│   ├── logo.png               <-- Official MSSPF crest logo
│   └── oman_bg.png            <-- Breathtaking Omani sunset stock photo
├── src/
│   ├── app/
│   │   ├── core/              <-- Core singletons, guards, and services
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts     <-- Secures retiree portal routes
│   │   │   └── services/
│   │   │       ├── auth.service.ts   <-- Simulates ROP OTP & Face auth state
│   │   │       ├── chat.service.ts   <-- Real-time RxJS simulated support desk
│   │   │       ├── language.service.ts <-- Multi-lingual RTL/LTR dictionary
│   │   │       └── pension.service.ts  <-- Pension calculation matrices
│   │   ├── portals/           <-- 7 Lazy-loaded sub-portals
│   │   │   ├── public/        <-- SEO Landing, About, News, Calculator
│   │   │   ├── retiree/       <-- Authenticated dashboard, appointments, IBANs
│   │   │   ├── visitor/       <-- claim wizard (funeral claims with local draft saving)
│   │   │   ├── company/       <-- Contractor registration
│   │   │   ├── bank/          <-- Loan directives
│   │   │   ├── ministry/      <-- Labor clearance checks
│   │   │   └── court/         <-- Judicial executions
│   │   ├── shared/            <-- 16 standalone shared components
│   │   ├── app.config.ts      <-- Client-side routing configuration
│   │   ├── app.css
│   │   ├── app.html           <-- Root template shell
│   │   └── app.ts
│   ├── index.html             <-- HTML entrypoint
│   ├── main.ts                <-- Bootstrap file
│   └── styles.css             <-- Tailwind CSS v4 custom theme declarations
└── package.json               <-- Dependencies & dev scripts
```

---

## 🔑 Page Explanations & Mock Credentials

### 1. Public Website (`/`)
* **Hero Banner**: Breathtaking background image of Muscat at sunset, with primary military brown blending and elegant gold ribboning. Holds the core core value proposition.
* **Pension Estimator**: Live estimator widget. Try setting service years to `20`, salary to `1200`, and rank to `Major General` to observe high-value Omani pensions!
* **Quick Services**: Navigation grids to the sub-portals.
* **News & Publications**: Official bulletin board.

### 2. Retiree Portal & Login (`/retiree`)
* **Authentication**: Realized via Royal Oman Police integration mockup.
  * **Mock Civil ID**: Any 8-digit number (e.g., `12345678`, `87654321`).
  * **Mock OTP Code**: Click "Send verification code". Any 6-digit number works, but you can enter `123456` or any sequence.
  * **Face Recognition**: Toggle the secure webcam pass mockup to authenticate instantly without an OTP!
* **Retiree Dashboard**: Renders welcoming data from mock retirees (e.g., *Lt. Colonel Salim Al-Harthy* or *Major Maryam Al-Balushi*). Shows last paid pension and military loyalty benefits.
* **IBAN Updates**: Updates bank records. Note: Strict validation ensures Omani IBAN formats (starting with `OM` followed by 22 alphanumeric digits).
* **Certificates**: Renders an illustrated table. Click "View PDF" to open a custom, beautiful mock PDF Entitlements sheet with military gold stamps, downloadable instantly.
* **Appointments**: Interactive calendar slot-picker. Choose any weekday (Sunday - Thursday) and pick a time slot (e.g., `09:30 AM`). It will dynamically register and display in your appointments list!
* **Live Chat Room**: Simulated live interface with a military helpdesk officer. Send messages and watch the officer respond with automated, context-aware answers.

### 3. Visitor Portal & Funeral Claims (`/visitor`)
* **Funeral Expense Claims Wizard**: A detailed, 5-step reactive wizard designed for legal claimants after the passing of a servicemember.
* **Local Draft Saving**: If the visitor partially fills the form and leaves, it uses `localStorage` to save the draft. Returning visitors see a notification and can instantly restore their draft!
* **Upload Mocking**: Supports uploading files (Death Certificate, Heir Verification). Click upload to see instant progress bars and confirmation checks.

### 4. B2B & Government Gateways (`/company`, `/bank`, `/ministry`, `/court`)
* **Company Registration**: Allows suppliers to register using Omani CR numbers and military classification files.
* **Partner Bank Gateway**: Allows commercial banks to file loan deduction parameters (strict verification rules applied).
* **Ministry of Labor**: Integrated search portal allowing query-clearance checks on active retiree list.
* **Court Judicial Executions**: Allows judges to record child support deductions against specific Civil IDs.

---

## 🛠️ Execution & Deployment Guide

To run the application locally, follow these steps:

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### 2. Install Dependencies
Navigate to the root directory and install packages:
```bash
npm install
```

### 3. Start the Development Server
Run the local dev server using the Angular CLI command:
```bash
npm start
```
*Note: The script serves the site at `http://localhost:4200/`.*

### 4. Build for Production
To build a highly optimized production bundle, run:
```bash
npm run build
```
This compiles the application and stores the static assets under the `dist/msspf-portal/` folder, ready to be hosted on any static host or web server.

---

## 🌐 Next Steps: Connecting a Headless Backend (Supabase or Appwrite)

To transform this interactive client mockup into a live, production-grade application backed by a secure datastore, you can integrate **Supabase** or **Appwrite**. Below is a complete implementation blueprint.

### Approach 1: Integrating Supabase (Recommended)

#### 1. Setup Database Schema
In the Supabase console, create the following SQL tables:

```sql
-- 1. Retirees Table
create table public.retirees (
  id uuid default gen_random_uuid() primary key,
  civil_id text unique not null,
  full_name_en text not null,
  full_name_ar text not null,
  rank text not null,
  iban text not null,
  last_pension_amount decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Appointments Table
create table public.appointments (
  id uuid default gen_random_uuid() primary key,
  retiree_id uuid references public.retirees(id) on delete cascade,
  channel text not null,
  appointment_date date not null,
  time_slot text not null,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Funeral Claims Table
create table public.funeral_claims (
  id uuid default gen_random_uuid() primary key,
  deceased_civil_id text not null,
  deceased_name text not null,
  applicant_civil_id text not null,
  applicant_name text not null,
  applicant_phone text not null,
  applicant_iban text not null,
  death_cert_url text,
  heir_cert_url text,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### 2. Install Supabase JS SDK
Install the SDK in your Angular workspace:
```bash
npm install @supabase/supabase-js
```

#### 3. Configure Supabase Service
Create an Angular core service (`src/app/core/services/supabase.service.ts`) to initialize connection parameters:

```typescript
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly supabaseUrl = 'YOUR_SUPABASE_URL';
  private readonly supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  // Fetch Retiree details via Civil ID
  async getRetireeProfile(civilId: string) {
    const { data, error } = await this.supabase
      .from('retirees')
      .select('*')
      .eq('civil_id', civilId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Update Retiree IBAN
  async updateRetireeIban(retireeId: string, newIban: string, bankName: string) {
    const { data, error } = await this.supabase
      .from('retirees')
      .update({ iban: newIban })
      .eq('id', retireeId);

    if (error) throw error;
    return data;
  }

  // Book an Appointment
  async bookAppointment(appointment: { retiree_id: string; channel: string; appointment_date: string; time_slot: string }) {
    const { data, error } = await this.supabase
      .from('appointments')
      .insert([appointment]);

    if (error) throw error;
    return data;
  }

  // Save Funeral Claim
  async submitFuneralClaim(claim: any) {
    const { data, error } = await this.supabase
      .from('funeral_claims')
      .insert([claim]);

    if (error) throw error;
    return data;
  }

  // Upload claim documents to Supabase Storage Bucket
  async uploadClaimDoc(file: File, folder: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from('claim-documents')
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrlData } = this.supabase.storage
      .from('claim-documents')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
}
```

#### 4. Bind Services to UI Components
Replace the static mock database calls inside `auth.service.ts` or `claim.component.ts` with calls to `SupabaseService`. Convert your existing Signals state dynamically to bind to Async/Await responses. For example:

```typescript
// Inside auth.service.ts
readonly currentUser = signal<Retiree | null>(null);

async loginWithCivilId(civilId: string) {
  try {
    const profile = await this.supabaseService.getRetireeProfile(civilId);
    this.currentUser.set(profile);
    return true;
  } catch (error) {
    console.error('Failed to load database profile:', error);
    return false;
  }
}
```

---

### Approach 2: Integrating Appwrite

#### 1. Install Appwrite SDK
```bash
npm install appwrite
```

#### 2. Configure Appwrite Service
Create an Angular core service (`src/app/core/services/appwrite.service.ts`):

```typescript
import { Injectable } from '@angular/core';
import { Client, Databases, Storage, ID, Query } from 'appwrite';

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {
  private client: Client;
  private databases: Databases;
  private storage: Storage;
  
  private readonly dbId = 'msspf_database';
  private readonly collectionRetirees = 'retirees';
  private readonly collectionAppointments = 'appointments';
  private readonly bucketDocuments = 'claim_docs';

  constructor() {
    this.client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('YOUR_APPWRITE_PROJECT_ID');

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async getRetireeProfile(civilId: string) {
    const response = await this.databases.listDocuments(
      this.dbId,
      this.collectionRetirees,
      [Query.equal('civil_id', civilId)]
    );
    if (response.documents.length === 0) throw new Error('Retiree not found');
    return response.documents[0];
  }

  async bookAppointment(retireeId: string, channel: string, date: string, slot: string) {
    return await this.databases.createDocument(
      this.dbId,
      this.collectionAppointments,
      ID.unique(),
      { retiree_id: retireeId, channel, date, slot }
    );
  }

  async uploadDocument(file: File) {
    const uploadedFile = await this.storage.createFile(
      this.bucketDocuments,
      ID.unique(),
      file
    );
    return this.storage.getFileView(this.bucketDocuments, uploadedFile.$id);
  }
}
```

---

## 🎖️ Authors & Sultanate Governance Standard
This system has been built in accordance with the **Digital Oman Strategy (eOman)** and the **Oman Vision 2040** directives for high-fidelity electronic portal administration. It reflects supreme respect for Omani veterans and families of the Military and Security Forces.
