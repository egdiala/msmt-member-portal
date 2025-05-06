import { type ChartConfig } from "@/components/ui/chart";
import { IconX, IconInstagram, IconFacebook } from "@/components/icons";
import LandingPage1 from "../public/assets/landing1.png";
import LandingPage2 from "../public/assets/landing2.png";
import LandingPage3 from "../public/assets/landing3.png";

export const NAV_ITEMS = [
  { id: 1, name: "Dashboard", href: "/home" },
  { id: 2, name: "Appointments", href: "/appointments" },
  { id: 3, name: "Wallet", href: "/wallet" },
  { id: 4, name: "Family & Friends", href: "/family-and-friends" },
  { id: 5, name: "Notifications", href: "/notifications" },
  { id: 6, name: "Profile", href: "/profile" },
];

export const COLORS = ["#DD2418", "#0AA571"];

export const CHART_CONFIG = {
  desktop: {
    label: "Family",
    color: "#DD2418",
  },
  mobile: {
    label: "Friends",
    color: "#0AA571",
  },
} satisfies ChartConfig;

export const NOTIFICATION_TABLE_HEADERS = [
  { key: "date_and_time_added", value: "Date & Time Added" },
  { key: "message", value: "Message" },
];

export const WALLET_TABLE_HEADERS = [
  { key: "date_and_time", value: "Date & Time" },
  { key: "description", value: "Description" },
  { key: "amount", value: "Amount" },
  { key: "type", value: "Type" },
  { key: "status", value: "Status" },
];

export const TRANSACTIONS_FILTER_DATE_OPTIONS = [
  { id: "date-1", name: "Today", value: "today" },
  { id: "date-2", name: "This Month", value: "this-month" },
  { id: "date-3", name: "All Time", value: "all-time" },
  { id: "date-4", name: "Custom Range", value: "custom-range" },
];

export const TRANSACTIONS_FILTER_TYPE_OPTIONS = [
  { id: "type-1", name: "Debit", value: "debit" },
  { id: "type-2", name: "Credit", value: "credit" },
  { id: "type-3", name: "All", value: "" },
];

export const TRANSACTIONS_FILTER_STATUS_OPTIONS = [
  { id: "status-1", name: "Failed", value: "failed" },
  { id: "status-2", name: "Successful", value: "successful" },
  { id: "status-3", name: "All", value: "" },
];

export const FAMILY_AND_FRIENDS_TABLE_HEADERS = [
  { key: "date_and_time", value: "Date & Time" },
  { key: "name", value: "Name" },
  { key: "email", value: "Email address" },
  { key: "relationship", value: "Relationship" },
];

export const FAMILY_AND_FRIENDS_APPOINTMENTS_TABLE_HEADERS = [
  { key: "date_and_time", value: "Date & Time" },
  { key: "consultant", value: "Consultant" },
  { key: "booked_by", value: "Booked By" },
  { key: "status", value: "Status" },
];

export const APPLICATIONS_FILTER_STATUS_OPTIONS = [
  { id: "status-1", name: "Upcoming", value: "upcoming" },
  { id: "status-2", name: "Pending", value: "pending" },
  { id: "status-3", name: "Completed", value: "completed" },
  { id: "status-4", name: "Canceled", value: "canceled" },
];

export const PROVIDERS_TABLE_HEADERS = [
  { key: "name", value: "Name" },
  { key: "specialty", value: "Specialty" },
  { key: "rating", value: "Rating" },
  { key: "type", value: "Type" },
  { key: "charge_from", value: "Charge From" },
];

export const FAVOURITE_PROVIDERS_TABLE_HEADERS = [
  { key: "name", value: "Name" },
  { key: "specialty", value: "Specialty" },
  { key: "rating", value: "Rating" },
];

export const TRANSACTION_STATUS_ENUM: Record<string, string> = {
  successful: "1",
  failed: "2",
};

export const TRANSACTION_TYPE_ENUM: Record<string, string> = {
  credit: "1",
  debit: "2",
};

export const BLUR_VARIANTS = {
  initial: { opacity: 0, filter: "blur(4px)" },
  enter: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
};

export const PROVIDER_FILTER_KEY_MATCH: Record<string, string> = {
  appt_date: "Appointment Date",
  time_zone: "Time Zone",
  user_type: "Provider Type",
  service_offer_id: "Specific Service",
  amount: "Price Range",
  gender: "Gender",
  language: "Language",
  religion: "Religion",
  comm_mode: "Communication Preference",
  service_cat_id: "Provider Type",
};

export const WALLET_FILTER_KEY_MATCH: Record<string, string> = {
  start_date: "Start Date",
  end_date: "End Date",
  transaction_type: "Transaction Type",
  status: "Status",
};

export const WALLET_TRANSACTION_TYPE_FILTER_ENUM: Record<number, string> = {
  1: "Credit",
  2: "Debit",
};

export const WALLET_TRANSACTION_STATUS_FILTER_ENUM: Record<number, string> = {
  1: "Successful",
  2: "Failed",
};

export const LANDING_PAGE_LINKS = [
  {
    id: 1,
    header: "Quick Links",
    links: [
      { id: 1, name: "Home", href: "https://themsmt.com/" },
      { id: 2, name: "About Us", href: "https://themsmt.com/about-us-2/" },
      { id: 3, name: "Services", href: "https://themsmt.com/services-client" },
      { id: 4, name: "Resources", href: "https://themsmt.com/resources/" },
      { id: 5, name: "FAQs", href: "https://themsmt.com/faqs/" },
      { id: 6, name: "Contact Us", href: "https://themsmt.com/contact-us/" },
      { id: 7, name: "Sign up/Login", href: "https://themsmt.com/get-started" },
    ],
  },
  {
    id: 2,
    header: "Services Offered",
    links: [
      {
        id: 1,
        name: "Individual Therapy",
        href: "https://themsmt.com/services-client",
      },
      {
        id: 2,
        name: "Family Therapy",
        href: "https://themsmt.com/services-client",
      },
      {
        id: 3,
        name: "Group Therapy",
        href: "https://themsmt.com/services-client",
      },
      {
        id: 4,
        name: "Medication Management",
        href: "https://themsmt.com/services-client",
      },
      {
        id: 5,
        name: "Psychosocial Evaluations",
        href: "https://themsmt.com/services-client",
      },
      {
        id: 6,
        name: "Psychiatric Evaluations",
        href: "https://themsmt.com/services-client",
      },
      {
        id: 7,
        name: "Addiction Counselling",
        href: "https://themsmt.com/services-client",
      },
    ],
  },
  {
    id: 3,
    header: "Get Involved",
    links: [
      { id: 1, name: "Join Our Team", href: "https://themsmt.com/providers" },
      { id: 2, name: "Partnership", href: "https://themsmt.com/providers" },
    ],
  },
  {
    id: 4,
    header: "Legal Information",
    links: [
      {
        id: 1,
        name: "Terms of Service",
        href: "https://themsmt.com/terms-of-service/",
      },
      {
        id: 2,
        name: "Privacy Policy",
        href: "https://themsmt.com/privacy-policy-2/",
      },
    ],
    sub_section: {
      header: "Follow us on",
      links: [
        { id: 1, icon: IconFacebook, href: "https://themsmt.com/#" },
        { id: 2, icon: IconInstagram, href: "https://themsmt.com/#" },
        { id: 3, icon: IconX, href: "https://themsmt.com/#" },
      ],
    },
  },
];

export const MAIN_SECTION_INFO = [
  {
    id: 1,
    header: "For Individuals",
    description1: `You gain quick, confidential access to trusted mental health professionals through a simple platform.`,
    description2: `Sign up to book a session or log in if you're already a member.`,
    img: LandingPage1,
    color: "bg-[#ACE6E6]",
    bgImg: "../components/assets/BKG.png",
  },
  {
    id: 2,
    header: "For Organizations",
    description1: `A dedicated solution for offering trusted mental health support to employees or clients.`,
    description2: `Enjoy seamless onboarding and integrated care. Register your organization or log in if you're already a partner.`,
    img: LandingPage2,
    color: "bg-[#FFE5D2]",
    bgImg: "../components/assets/BKG2.png",
  },
  {
    id: 3,
    header: "For Consultants",
    description1: `Expand your practice with MSMT by connecting with patients seeking help.`,
    description2: `Our streamlined system simplifies appointment management. Register to join or log in if you're already on board.`,
    img: LandingPage3,
    color: "bg-[#FFF7C0]",
    bgImg: "../components/assets/BKG3.png",
  },
];

export const TOAST_STYLING =
  "flex items-center gap-x-2 p-5 !text-white rounded-md";
