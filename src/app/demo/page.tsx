"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Header from "@/section/header";
import NewFooter from "@/section/newfooter";
import {
  Building2,
  BookOpen,
  Book,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ChevronDown,
  Settings,
  Users,
  Activity,
  History as HistoryIcon,
  TrendingUp,
  Printer,
  Play,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  DollarSign,
  X,
  RefreshCw,
  FileText,
  LayoutDashboard,
  UserCog,
  Wrench,
  HelpCircle,
  Bell,
  LogOut,
  Trash2,
  Check,
  Eye,
  EyeOff,
  User,
  Shield,
  Download,
  Pencil,
  Menu,
} from "lucide-react";
import { toast } from "sonner";
import { faqItems } from "@/components/faq/faq-data";

// Business categories mock
const CATEGORIES = [
  { id: "RETAIL_STORE", label: "Retail Store" },
  { id: "RESTAURANT", label: "Restaurant" },
  { id: "SERVICE_BUSINESS", label: "Service Business" },
  { id: "FREELANCING", label: "Freelancing" },
  { id: "ONLINE_BUSINESS", label: "Online Business" },
];

// Transaction Categories for the form pills
const TX_CATEGORIES = [
  "parking",
  "Product sales",
  "Rent",
  "Rental income",
  "Salaries",
  "TRANSFER TO WORKERS",
  "Transportation",
];

// Payment modes for the form pills
const PAYMENT_MODES = ["Bank Transfer", "Cash", "Mobile Payment", "Online", "UPI"];

interface Transaction {
  id: string;
  cashbookId: string;
  type: "in" | "out" | "transfer";
  amount: number;
  remarks: string;
  category: string;
  partyName: string;
  paymentMode: string;
  date: string;
  balanceAfter: number;
  verified: boolean;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "PARTNER" | "STAFF";
  status: "Active" | "Pending";
}

export default function DemoPage() {
  // Step navigation (0 to 3) per guide section
  const [stepOverview, setStepOverview] = useState(0);
  const [stepTeam, setStepTeam] = useState(0);
  const [stepReports, setStepReports] = useState(0);
  const [stepLogs, setStepLogs] = useState(0);
  const [stepSettings, setStepSettings] = useState(0);
  const [stepFAQs, setStepFAQs] = useState(0);

  // Active Menu in the Sidebar
  const [activeMenu, setActiveMenu] = useState("Overview");

  // Mobile responsiveness states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [teamMobileTab, setTeamMobileTab] = useState<"members" | "settings" | "rules">("members");
  const [reportsMobileTab, setReportsMobileTab] = useState<"selector" | "content">("selector");

  // Close sidebar drawer and reset mobile view tabs when active menu shifts
  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setTeamMobileTab("members");
    setReportsMobileTab("selector");
  }, [activeMenu]);

  // Amount Mask/Reveal state (from screenshot 'Show' / 'Hide')
  const [maskAmounts, setMaskAmounts] = useState(true);

  // Split-pane active form: null, "cash_in", "cash_out", "transfer"
  const [activeAction, setActiveAction] = useState<"cash_in" | "cash_out" | "transfer" | null>(null);

  // Simulated App State
  const [businesses, setBusinesses] = useState([
    { id: "b1", name: "lifestyle outfit of mens and ladies...", category: "ONLINE_BUSINESS", bookCount: 3 },
    { id: "b2", name: "fabron metal", category: "MANUFACTURING", bookCount: 1 },
    { id: "b3", name: "raj paper cup", category: "RETAIL_STORE", bookCount: 0 },
  ]);
  const [activeBusinessId, setActiveBusinessId] = useState("b1");

  const [cashbooks, setCashbooks] = useState([
    { id: "c1", name: "parking", businessId: "b1" },
    { id: "c2", name: "raw material", businessId: "b1" },
    { id: "c3", name: "workers", businessId: "b1" },
    { id: "c4", name: "Factory Vault", businessId: "b2" },
  ]);
  const [activeCashbookId, setActiveCashbookId] = useState("c1");

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "t1",
      cashbookId: "c1",
      type: "out",
      amount: 50,
      remarks: "Transfer to another book",
      category: "TRANSFER TO WORKERS",
      partyName: "Self",
      paymentMode: "Cash",
      date: "16 Jul 2026 • 13:52:11",
      balanceAfter: 5820,
      verified: false,
    },
    {
      id: "t2",
      cashbookId: "c1",
      type: "out",
      amount: 150,
      remarks: "Self",
      category: "Product sales",
      partyName: "Self",
      paymentMode: "Cash",
      date: "16 Jul 2026 • 13:29:36",
      balanceAfter: 5870,
      verified: false,
    },
    {
      id: "t3",
      cashbookId: "c1",
      type: "in",
      amount: 400,
      remarks: "Self",
      category: "Product sales",
      partyName: "Customer A",
      paymentMode: "Cash",
      date: "16 Jul 2026 • 13:29:21",
      balanceAfter: 6020,
      verified: true,
    },
    {
      id: "t4",
      cashbookId: "c1",
      type: "in",
      amount: 80,
      remarks: "Self",
      category: "parking",
      partyName: "Partner B",
      paymentMode: "Cash",
      date: "16 Jul 2026 • 11:52:11",
      balanceAfter: 5620,
      verified: true,
    },
    {
      id: "t5",
      cashbookId: "c1",
      type: "in",
      amount: 40,
      remarks: "Self",
      category: "parking",
      partyName: "Partner C",
      paymentMode: "Cash",
      date: "16 Jul 2026 • 11:51:54",
      balanceAfter: 5540,
      verified: true,
    },
    {
      id: "t6",
      cashbookId: "c1",
      type: "out",
      amount: 100,
      remarks: "Self",
      category: "Transportation",
      partyName: "Self",
      paymentMode: "Cash",
      date: "13 Jul 2026 • 12:43:45",
      balanceAfter: 5500,
      verified: false,
    },
    {
      id: "t7",
      cashbookId: "c1",
      type: "in",
      amount: 400,
      remarks: "Self",
      category: "Product sales",
      partyName: "Self",
      paymentMode: "Cash",
      date: "11 Jul 2026 • 12:09:16",
      balanceAfter: 5600,
      verified: true,
    },
    {
      id: "t8",
      cashbookId: "c1",
      type: "in",
      amount: 100,
      remarks: "Self",
      category: "Transportation",
      partyName: "Self",
      paymentMode: "Cash",
      date: "07 Jul 2026 • 12:32:05",
      balanceAfter: 5200,
      verified: true,
    },
  ]);

  // Team Management mock state (Screenshot 1)
  const [members, setMembers] = useState<Member[]>([
    { id: "m1", name: "Anjar Alam", email: "alamanjar966@gmail.com", role: "OWNER", status: "Active" },
    { id: "m2", name: "ajey52", email: "ajey52@gmail.com", role: "STAFF", status: "Active" },
  ]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"OWNER" | "PARTNER" | "STAFF">("STAFF");
  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  // Accordion active states in Team Management Guide card
  const [teamAccordion, setTeamAccordion] = useState<"roles" | "books" | "add" | null>("roles");

  // Activity logs mock state (Screenshot 3)
  const [logsList, setLogsList] = useState([
    { id: "l1", action: "Accounting book created by user", user: "Anjar Alam", type: "Created", timestamp: "7/10/2026 at 03:40 PM" },
    { id: "l2", action: "Accounting book created by user", user: "Anjar Alam", type: "Created", timestamp: "7/7/2026 at 12:29 PM" },
    { id: "l3", action: "Accounting book created by user", user: "Anjar Alam", type: "Created", timestamp: "7/7/2026 at 12:17 PM" },
  ]);
  const [activeLogFilter, setActiveLogFilter] = useState("All Activity");
  const [logsSearchQuery, setLogsSearchQuery] = useState("");

  // Business settings state
  const [bizSettingsName, setBizSettingsName] = useState("lifestyle outfit of mens and ladies...");
  const [bizSettingsCat, setBizSettingsCat] = useState("ONLINE_BUSINESS");

  // FAQ Accordion index state
  const [faqIndex, setFaqIndex] = useState<number | null>(0);
  const [faqSearchQuery, setFaqSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    if (!faqSearchQuery.trim()) return faqItems;
    const query = faqSearchQuery.toLowerCase();
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [faqSearchQuery]);

  const groupedFaqs = useMemo(() => {
    const grouped: Record<string, typeof faqItems> = {};
    filteredFaqs.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [filteredFaqs]);

  // Dropdown states
  const [isBizDropdownOpen, setIsBizDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [bizSearchQuery, setBizSearchQuery] = useState("");
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Form Inputs
  const [newBizName, setNewBizName] = useState("");
  const [newBizCat, setNewBizCat] = useState("ONLINE_BUSINESS");
  const [newBookName, setNewBookName] = useState("");

  // Ledger Add Entry Forms Inputs (matching Screenshot 2)
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState("parking");
  const [formPartyName, setFormPartyName] = useState("");
  const [formPaymentMode, setFormPaymentMode] = useState("Cash");
  const [formAdditionalInfo, setFormAdditionalInfo] = useState("");
  const [transferTargetId, setTransferTargetId] = useState("");

  // Report filters (Screenshot 2)
  const [reportType, setReportType] = useState<"business" | "book">("business");
  const [reportPeriod, setReportPeriod] = useState("This month");
  const [reportTxType, setReportTxType] = useState("All Types");
  const [reportCategory, setReportCategory] = useState("All Categories");
  const [reportPaymentMode, setReportPaymentMode] = useState("All Payment Modes");

  // Report Loading States
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Click outside handlers refs
  const bizDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bizDropdownRef.current && !bizDropdownRef.current.contains(event.target as Node)) {
        setIsBizDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Derived Values
  const activeBusiness = useMemo(
    () => businesses.find((b) => b.id === activeBusinessId) || businesses[0],
    [businesses, activeBusinessId]
  );

  const filteredCashbooks = useMemo(
    () => cashbooks.filter((c) => c.businessId === activeBusinessId),
    [cashbooks, activeBusinessId]
  );

  // Sync active cashbook when switching businesses
  useEffect(() => {
    if (filteredCashbooks.length > 0) {
      const matches = filteredCashbooks.find((c) => c.id === activeCashbookId);
      if (!matches) {
        setActiveCashbookId(filteredCashbooks[0].id);
      }
    }
  }, [filteredCashbooks, activeBusinessId, activeCashbookId]);

  const filteredTransactions = useMemo(
    () => transactions.filter((t) => t.cashbookId === activeCashbookId),
    [transactions, activeCashbookId]
  );

  // Calculate Net totals
  const stats = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    filteredTransactions.forEach((tx) => {
      if (tx.type === "in") totalIn += tx.amount;
      else totalOut += tx.amount;
    });
    return {
      inflow: totalIn,
      outflow: totalOut,
      balance: totalIn - totalOut,
    };
  }, [filteredTransactions]);

  // Destination Cashbooks for Transfer
  const transferOptions = useMemo(() => {
    return filteredCashbooks.filter((c) => c.id !== activeCashbookId);
  }, [filteredCashbooks, activeCashbookId]);

  // Set default transfer target cashbook when dropdown changes
  useEffect(() => {
    if (transferOptions.length > 0) {
      setTransferTargetId(transferOptions[0].id);
    } else {
      setTransferTargetId("");
    }
  }, [transferOptions]);

  // Reset demo states to default
  const handleReset = () => {
    setStepOverview(0);
    setStepTeam(0);
    setStepReports(0);
    setStepLogs(0);
    setStepSettings(0);
    setStepFAQs(0);
    setActiveMenu("Overview");
    setMaskAmounts(true);
    setActiveAction(null);
    setSelectedMemberId(null);
    setBizSettingsName("lifestyle outfit of mens and ladies...");
    setBizSettingsCat("ONLINE_BUSINESS");
    setFaqIndex(0);
    setFaqSearchQuery("");
    setMembers([
      { id: "m1", name: "Anjar Alam", email: "alamanjar966@gmail.com", role: "OWNER", status: "Active" },
      { id: "m2", name: "ajey52", email: "ajey52@gmail.com", role: "STAFF", status: "Active" },
    ]);
    setBusinesses([
      { id: "b1", name: "lifestyle outfit of mens and ladies...", category: "ONLINE_BUSINESS", bookCount: 3 },
      { id: "b2", name: "fabron metal", category: "MANUFACTURING", bookCount: 1 },
      { id: "b3", name: "raj paper cup", category: "RETAIL_STORE", bookCount: 0 },
    ]);
    setActiveBusinessId("b1");
    setCashbooks([
      { id: "c1", name: "parking", businessId: "b1" },
      { id: "c2", name: "raw material", businessId: "b1" },
      { id: "c3", name: "workers", businessId: "b1" },
      { id: "c4", name: "Factory Vault", businessId: "b2" },
    ]);
    setActiveCashbookId("c1");
    setTransactions([
      {
        id: "t1",
        cashbookId: "c1",
        type: "out",
        amount: 50,
        remarks: "Transfer to another book",
        category: "TRANSFER TO WORKERS",
        partyName: "Self",
        paymentMode: "Cash",
        date: "16 Jul 2026 • 13:52:11",
        balanceAfter: 5820,
        verified: false,
      },
      {
        id: "t2",
        cashbookId: "c1",
        type: "out",
        amount: 150,
        remarks: "Self",
        category: "Product sales",
        partyName: "Self",
        paymentMode: "Cash",
        date: "16 Jul 2026 • 13:29:36",
        balanceAfter: 5870,
        verified: false,
      },
      {
        id: "t3",
        cashbookId: "c1",
        type: "in",
        amount: 400,
        remarks: "Self",
        category: "Product sales",
        partyName: "Customer A",
        paymentMode: "Cash",
        date: "16 Jul 2026 • 13:29:21",
        balanceAfter: 6020,
        verified: true,
      },
      {
        id: "t4",
        cashbookId: "c1",
        type: "in",
        amount: 80,
        remarks: "Self",
        category: "parking",
        partyName: "Partner B",
        paymentMode: "Cash",
        date: "16 Jul 2026 • 11:52:11",
        balanceAfter: 5620,
        verified: true,
      },
      {
        id: "t5",
        cashbookId: "c1",
        type: "in",
        amount: 40,
        remarks: "Self",
        category: "parking",
        partyName: "Partner C",
        paymentMode: "Cash",
        date: "16 Jul 2026 • 11:51:54",
        balanceAfter: 5540,
        verified: true,
      },
      {
        id: "t6",
        cashbookId: "c1",
        type: "out",
        amount: 100,
        remarks: "Self",
        category: "Transportation",
        partyName: "Self",
        paymentMode: "Cash",
        date: "13 Jul 2026 • 12:43:45",
        balanceAfter: 5500,
        verified: false,
      },
      {
        id: "t7",
        cashbookId: "c1",
        type: "in",
        amount: 400,
        remarks: "Self",
        category: "Product sales",
        partyName: "Self",
        paymentMode: "Cash",
        date: "11 Jul 2026 • 12:09:16",
        balanceAfter: 5600,
        verified: true,
      },
      {
        id: "t8",
        cashbookId: "c1",
        type: "in",
        amount: 100,
        remarks: "Self",
        category: "Transportation",
        partyName: "Self",
        paymentMode: "Cash",
        date: "07 Jul 2026 • 12:32:05",
        balanceAfter: 5200,
        verified: true,
      },
    ]);
    setLogsList([
      { id: "l1", action: "Accounting book created by user", user: "Anjar Alam", type: "Created", timestamp: "7/10/2026 at 03:40 PM" },
      { id: "l2", action: "Accounting book created by user", user: "Anjar Alam", type: "Created", timestamp: "7/7/2026 at 12:29 PM" },
      { id: "l3", action: "Accounting book created by user", user: "Anjar Alam", type: "Created", timestamp: "7/7/2026 at 12:17 PM" },
    ]);
    setDownloadComplete(false);
    toast.info("Demo simulator reset to initial state!");
  };

  // Actions handlers
  const handleCreateBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim()) {
      toast.error("Please enter a business title!");
      return;
    }
    const newId = `biz_${Date.now()}`;
    const newBiz = {
      id: newId,
      name: newBizName,
      category: newBizCat,
      bookCount: 0,
    };
    setBusinesses([...businesses, newBiz]);
    setActiveBusinessId(newId);
    setNewBizName("");
    setShowBusinessModal(false);
    toast.success(`Business "${newBiz.name}" created successfully!`);
    
    // Automatically advance Overview tutorial
    if (activeMenu === "Overview") {
      setStepOverview(1);
      setTimeout(() => {
        setShowBookModal(true);
      }, 500);
    }
  };

  const handleCreateBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookName.trim()) {
      toast.error("Please enter a cashbook name!");
      return;
    }
    const newId = `cb_${Date.now()}`;
    const newBook = {
      id: newId,
      name: newBookName,
      businessId: activeBusinessId,
    };
    setCashbooks([...cashbooks, newBook]);
    
    // Update bookCount for this business
    setBusinesses(businesses.map(b => b.id === activeBusinessId ? { ...b, bookCount: b.bookCount + 1 } : b));
    
    setActiveCashbookId(newId);
    setNewBookName("");
    setShowBookModal(false);
    toast.success(`Cashbook "${newBook.name}" added to list!`);

    // Advance tutorial step
    if (activeMenu === "Overview" && stepOverview === 1) {
      setStepOverview(2);
      setActiveAction("cash_in");
    }
  };

  const handleCreateTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid positive amount!");
      return;
    }

    let finalRemarks = formAdditionalInfo.trim() || "Self";
    let finalType: "in" | "out" | "transfer" = "in";
    
    if (activeAction === "cash_out") {
      finalType = "out";
    } else if (activeAction === "transfer") {
      finalType = "transfer";
      const targetBook = cashbooks.find((c) => c.id === transferTargetId);
      finalRemarks = `Transfer to ${targetBook ? targetBook.name : "another book"}`;
    }

    const currentBalance = stats.balance;
    const balanceAfter = finalType === "in" ? currentBalance + amt : currentBalance - amt;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      cashbookId: activeCashbookId,
      type: finalType === "transfer" ? "out" : finalType,
      amount: amt,
      remarks: finalRemarks,
      category: activeAction === "transfer" ? "transfer" : formCategory,
      partyName: formPartyName.trim() || "Self",
      paymentMode: activeAction === "transfer" ? "Cash" : formPaymentMode,
      date: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).replace(/\//g, " ").replace(",", " •"),
      balanceAfter,
      verified: false,
    };

    if (activeAction === "transfer" && transferTargetId) {
      const destTxs = transactions.filter((t) => t.cashbookId === transferTargetId);
      const destBalance = destTxs.reduce((acc, curr) => curr.type === "in" ? acc + curr.amount : acc - curr.amount, 0);

      const incomingTx: Transaction = {
        id: `tx_in_${Date.now()}`,
        cashbookId: transferTargetId,
        type: "in",
        amount: amt,
        remarks: `Received from ${cashbooks.find((c) => c.id === activeCashbookId)?.name || "another book"}`,
        category: "transfer",
        partyName: "Self",
        paymentMode: "Cash",
        date: newTx.date,
        balanceAfter: destBalance + amt,
        verified: false,
      };

      setTransactions([newTx, incomingTx, ...transactions]);
    } else {
      setTransactions([newTx, ...transactions]);
    }

    // Reset Inputs
    setFormAmount("");
    setFormPartyName("");
    setFormAdditionalInfo("");
    setActiveAction(null);
    toast.success(`Entry saved successfully!`);

    // Advance tutorial step
    if (activeMenu === "Overview" && stepOverview === 2) {
      setStepOverview(3);
    }
  };

  // Inline Verify Toggle Handler
  const handleVerifyToggle = (txId: string) => {
    setTransactions(
      transactions.map((tx) =>
        tx.id === txId ? { ...tx, verified: !tx.verified } : tx
      )
    );
    const item = transactions.find((tx) => tx.id === txId);
    if (item) {
      toast.success(item.verified ? "Marked as unverified" : "Transaction verified!");
    }
  };

  // Team Management Add Member Submit
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      toast.error("Please fill all details!");
      return;
    }
    const newMem: Member = {
      id: `m_${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      status: "Pending",
    };
    setMembers([...members, newMem]);
    setNewMemberName("");
    setNewMemberEmail("");
    setShowMemberModal(false);
    toast.success(`Invited ${newMem.name} as ${newMem.role}!`);
    setSelectedMemberId(newMem.id);

    // Advance tutorial step
    if (activeMenu === "Team Management" && stepTeam === 0) {
      setStepTeam(1);
    }
  };

  // Role modification on member settings
  const handleUpdateMemberRole = (role: "OWNER" | "PARTNER" | "STAFF") => {
    if (!selectedMemberId) return;
    setMembers(members.map((m) => m.id === selectedMemberId ? { ...m, role } : m));
    toast.success("Role updated successfully.");

    if (activeMenu === "Team Management" && stepTeam === 2) {
      setStepTeam(3);
    }
  };

  const handleRemoveMember = () => {
    if (!selectedMemberId) return;
    const item = members.find(m => m.id === selectedMemberId);
    setMembers(members.filter((m) => m.id !== selectedMemberId));
    setSelectedMemberId(null);
    toast.success(`${item?.name} removed from team.`);
  };

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
      toast.success("PDF Report generated & downloaded successfully!");
    }, 2000);
  };

  // Filters search queries
  const filteredBusinessesList = useMemo(() => {
    return businesses.filter((b) =>
      b.name.toLowerCase().includes(bizSearchQuery.toLowerCase())
    );
  }, [businesses, bizSearchQuery]);

  const filteredMembersList = useMemo(() => {
    return members.filter((m) =>
      m.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(teamSearchQuery.toLowerCase())
    );
  }, [members, teamSearchQuery]);

  const filteredLogsList = useMemo(() => {
    let list = logsList;
    if (activeLogFilter !== "All Activity") {
      list = logsList.filter(l => l.type === activeLogFilter);
    }
    return list.filter(l => l.action.toLowerCase().includes(logsSearchQuery.toLowerCase()));
  }, [logsList, activeLogFilter, logsSearchQuery]);

  const selectedMember = useMemo(() => {
    return members.find(m => m.id === selectedMemberId) || null;
  }, [members, selectedMemberId]);

  // Mask formatter helper
  const renderAmount = (amt: number, prefix: string = "") => {
    if (maskAmounts) {
      return `${prefix}₹ • • • •`;
    }
    return `${prefix}₹ ${amt.toLocaleString("en-IN")}`;
  };

  const handleAmountMaskToggle = () => {
    setMaskAmounts(!maskAmounts);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />

      {/* Hero / Header Section */}
      <section className="relative overflow-hidden bg-slate-955 py-16 px-6 md:px-12 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive App Simulator
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Experience TallyCash Pro <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Sandbox</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Select a sidebar tab inside the mock console below to experience all application sections, with live synced guides.
          </p>
        </div>
      </section>

      {/* Simulator Workspace Section */}
      <section className="flex-1 max-w-full w-full mx-auto p-2 md:p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Step-by-Step Interactive Guide (Column span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-955 bg-opacity-70 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              Tutorial Guide: {activeMenu}
            </h2>

            {/* Guides dynamically switch based on active menu */}
            
            {activeMenu === "Overview" && (
              <div className="space-y-2.5">
                {[
                  { title: "Create a Business", desc: "Set up a new company profile.", step: 0, click: () => { setStepOverview(0); setShowBusinessModal(true); } },
                  { title: "Add Cash Books", desc: "Define ledgers like 'parking' or 'raw material'.", step: 1, click: () => { setStepOverview(1); setShowBookModal(true); } },
                  { title: "Record Cash Flow", desc: "Enter details inside Cash In, Out or Transfer.", step: 2, click: () => { setStepOverview(2); setActiveAction("cash_in"); } },
                  { title: "Verify transaction records", desc: "Click the inline Verify buttons to approve items.", step: 3, click: () => { setStepOverview(3); } },
                ].map((item, idx) => {
                  const isCurrent = stepOverview === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setStepOverview(idx)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrent ? "bg-slate-800/80 border-blue-500/50" : "border-transparent hover:bg-slate-800/20 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          stepOverview > idx ? "bg-emerald-500 text-slate-955" : "bg-blue-600 text-white"
                        }`}>
                          {stepOverview > idx ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed pl-7">{item.desc}</p>
                      {isCurrent && (
                        <button
                          onClick={(e) => { e.stopPropagation(); item.click(); }}
                          className="mt-2.5 ml-7 px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] cursor-pointer border-0"
                        >
                          Execute action
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeMenu === "Team Management" && (
              <div className="space-y-2.5">
                {[
                  { title: "Invite Team Members", desc: "Click 'Add Member +' on the top right.", step: 0, click: () => { setStepTeam(0); setShowMemberModal(true); } },
                  { title: "Select a Partner", desc: "Click on 'ajey52' or a member to details.", step: 1, click: () => { setStepTeam(1); if (members.length > 0) setSelectedMemberId(members[members.length - 1].id); } },
                  { title: "Learn Roles permissions", desc: "Toggle business role cards in guide rules.", step: 2, click: () => { setStepTeam(2); setTeamAccordion("roles"); } },
                  { title: "Modify permissions role", desc: "Alter dropdown selection to Staff or Partner.", step: 3, click: () => { setStepTeam(3); if (selectedMemberId) handleUpdateMemberRole("PARTNER"); } },
                ].map((item, idx) => {
                  const isCurrent = stepTeam === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setStepTeam(idx)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrent ? "bg-slate-800/80 border-blue-500/50" : "border-transparent hover:bg-slate-800/20 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          stepTeam > idx ? "bg-emerald-500 text-slate-955" : "bg-blue-600 text-white"
                        }`}>
                          {stepTeam > idx ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed pl-7">{item.desc}</p>
                      {isCurrent && (
                        <button
                          onClick={(e) => { e.stopPropagation(); item.click(); }}
                          className="mt-2.5 ml-7 px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] cursor-pointer border-0"
                        >
                          Execute action
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeMenu === "Reports" && (
              <div className="space-y-2.5">
                {[
                  { title: "Choose report scale", desc: "Select Business or Book reports.", step: 0, click: () => { setStepReports(0); setReportType(reportType === "business" ? "book" : "business"); } },
                  { title: "Configure filters", desc: "Adjust Category or Payment modes.", step: 1, click: () => { setStepReports(1); setReportPaymentMode("UPI"); } },
                  { title: "Audit inflows / outflow", desc: "Observe 'You Gave' and 'You Got' counts.", step: 2, click: () => { setStepReports(2); toast.info("Auditing cash outflow vs inflow."); } },
                  { title: "Export Statement", desc: "Click 'Download PDF' at the top right.", step: 3, click: () => { setStepReports(3); handleDownloadReport(); } },
                ].map((item, idx) => {
                  const isCurrent = stepReports === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setStepReports(idx)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrent ? "bg-slate-800/80 border-blue-500/50" : "border-transparent hover:bg-slate-800/20 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          stepReports > idx ? "bg-emerald-500 text-slate-955" : "bg-blue-600 text-white"
                        }`}>
                          {stepReports > idx ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed pl-7">{item.desc}</p>
                      {isCurrent && (
                        <button
                          onClick={(e) => { e.stopPropagation(); item.click(); }}
                          className="mt-2.5 ml-7 px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] cursor-pointer border-0"
                        >
                          Execute action
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeMenu === "Activity Logs" && (
              <div className="space-y-2.5">
                {[
                  { title: "Select activity filter", desc: "Switch from All to Created or Deleted logs.", step: 0, click: () => { setStepLogs(0); setActiveLogFilter("Created"); } },
                  { title: "Review details timestamp", desc: "Check author audit line details.", step: 1, click: () => { setStepLogs(1); toast.info("Reviewing audit log timestamps."); } },
                  { title: "Search log history", desc: "Filter by descriptions like 'Accounting book'.", step: 2, click: () => { setStepLogs(2); setLogsSearchQuery("Accounting"); } },
                ].map((item, idx) => {
                  const isCurrent = stepLogs === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setStepLogs(idx)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrent ? "bg-slate-800/80 border-blue-500/50" : "border-transparent hover:bg-slate-800/20 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          stepLogs > idx ? "bg-emerald-500 text-slate-955" : "bg-blue-600 text-white"
                        }`}>
                          {stepLogs > idx ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed pl-7">{item.desc}</p>
                      {isCurrent && (
                        <button
                          onClick={(e) => { e.stopPropagation(); item.click(); }}
                          className="mt-2.5 ml-7 px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] cursor-pointer border-0"
                        >
                          Execute action
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeMenu === "Business Settings" && (
              <div className="space-y-2.5">
                {[
                  { title: "Verify business parameters", desc: "Check name and category settings.", step: 0, click: () => { setStepSettings(0); toast.info("Reviewing business properties."); } },
                  { title: "Verify sandbox lock", desc: "Settings are locked/read-only inside sandbox console.", step: 1, click: () => { setStepSettings(1); toast.warning("Settings updates are mock-locked."); } },
                ].map((item, idx) => {
                  const isCurrent = stepSettings === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setStepSettings(idx)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrent ? "bg-slate-800/80 border-blue-500/50" : "border-transparent hover:bg-slate-800/20 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          stepSettings > idx ? "bg-emerald-500 text-slate-955" : "bg-blue-600 text-white"
                        }`}>
                          {stepSettings > idx ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed pl-7">{item.desc}</p>
                      {isCurrent && (
                        <button
                          onClick={(e) => { e.stopPropagation(); item.click(); }}
                          className="mt-2.5 ml-7 px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] cursor-pointer border-0"
                        >
                          Execute action
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeMenu === "FAQ's" && (
              <div className="space-y-2.5">
                {[
                  { title: "Browse support articles", desc: "Click standard accordions in layout list.", step: 0, click: () => { setStepFAQs(0); setFaqIndex(1); } },
                  { title: "Clear sandbox data", desc: "Reset simulator console layout flow.", step: 1, click: () => { setStepFAQs(1); handleReset(); } },
                ].map((item, idx) => {
                  const isCurrent = stepFAQs === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setStepFAQs(idx)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrent ? "bg-slate-800/80 border-blue-500/50" : "border-transparent hover:bg-slate-800/20 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          stepFAQs > idx ? "bg-emerald-500 text-slate-955" : "bg-blue-600 text-white"
                        }`}>
                          {stepFAQs > idx ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed pl-7">{item.desc}</p>
                      {isCurrent && (
                        <button
                          onClick={(e) => { e.stopPropagation(); item.click(); }}
                          className="mt-2.5 ml-7 px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] cursor-pointer border-0"
                        >
                          Execute action
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* Right Side: High Fidelity Dashboard Simulator (Column span 9) */}
        <div className="lg:col-span-9 flex flex-col min-w-0 bg-[#0B1320] rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden h-[600px] relative select-none">
          
          {/* Main Simulated Panel */}
          <div className="flex-1 flex overflow-hidden min-h-0 relative">
            
            {/* Mobile Sidebar backdrop overlay */}
            {isMobileSidebarOpen && (
              <div
                onClick={() => setIsMobileSidebarOpen(false)}
                className="lg:hidden absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-25 animate-in fade-in duration-150"
              />
            )}
            
            {/* Sidebar Navigator Mock - w-52 for width optimization */}
            <div className={`
              w-52 bg-[#0B1320] border-r border-slate-800/20 p-3 flex flex-col justify-between shrink-0 transition-transform duration-200 z-30
              absolute lg:relative inset-y-0 left-0 lg:translate-x-0 h-full
              ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
              <div className="space-y-4">
                {/* Top Brand Header */}
                <div className="flex items-center justify-between px-1 py-1">
                  <div className="flex items-center gap-2 text-left">
                    <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain shrink-0" />
                    <span className="text-[15px] font-bold tracking-tight text-white font-sans">
                      TallyCash<span className="text-[#10b981]">Pro</span>
                    </span>
                  </div>
                  <div className="text-white/60 hover:text-white cursor-pointer transition-colors">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Business Selector Dropdown Anchor */}
                <div className="relative" ref={bizDropdownRef}>
                  <button
                    onClick={() => setIsBizDropdownOpen(!isBizDropdownOpen)}
                    className="w-full flex items-center justify-between bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer rounded-full p-1 pl-1.5 pr-2.5 shadow-md h-[40px] border border-slate-200 outline-none"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="flex aspect-square size-7 items-center justify-center rounded-full bg-[#3b82f6] text-white font-extrabold shrink-0 text-[10px] uppercase font-sans">
                        {activeBusiness.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="font-bold text-[10.5px] text-slate-800 truncate block leading-tight">
                          {activeBusiness.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold truncate block mt-0.5">
                          {activeBusiness.bookCount} Books
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="size-3 text-slate-500 shrink-0" />
                  </button>

                  {/* High Fidelity Business Selector Dropdown */}
                  {isBizDropdownOpen && (
                    <div className="absolute w-[200px] max-h-[380px] overflow-y-auto rounded-2xl p-1.5 shadow-2xl bg-white z-[50] mt-2 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Search box */}
                      <div className="px-2 py-1">
                        <input
                          type="text"
                          placeholder="Search businesses..."
                          value={bizSearchQuery}
                          onChange={(e) => setBizSearchQuery(e.target.value)}
                          className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded-lg outline-none focus:border-slate-400 bg-slate-50 text-slate-800 font-semibold"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Business items */}
                      <div className="flex flex-col gap-0.5">
                        {filteredBusinessesList.map((biz) => {
                          const isSelected = biz.id === activeBusinessId;
                          return (
                            <div
                              key={biz.id}
                              onClick={() => {
                                setActiveBusinessId(biz.id);
                                setIsBizDropdownOpen(false);
                                setBizSearchQuery("");
                                toast.info(`Switched to "${biz.name}"`);
                              }}
                              className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                                isSelected ? "bg-slate-50 font-bold text-slate-900" : "hover:bg-slate-50 text-slate-700 font-medium"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="flex aspect-square size-6 items-center justify-center rounded-full bg-[#3b82f6] text-white font-extrabold shrink-0 text-[9px] uppercase font-sans">
                                  {biz.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col text-left min-w-0">
                                  <span className="font-bold text-[10px] truncate block leading-tight text-slate-800">
                                    {biz.name}
                                  </span>
                                  <span className="text-[8px] text-slate-400 font-medium block mt-0.5">
                                    {biz.bookCount} Books
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="size-3 text-slate-400 shrink-0" />
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-2 border-t border-slate-100 mt-1">
                        <button
                          onClick={() => {
                            setIsBizDropdownOpen(false);
                            setShowBusinessModal(true);
                          }}
                          className="w-full flex items-center justify-center gap-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-[10px] rounded-full py-1 px-2.5 transition-colors cursor-pointer border-0"
                        >
                          <span>New Business</span>
                          <Plus className="size-2.5 text-white stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Navigation Options */}
                <div className="space-y-1 pt-1">
                  {[
                    { label: "Overview", icon: Book },
                    { label: "Team Management", icon: UserCog },
                    { label: "Reports", icon: Printer },
                    { label: "Activity Logs", icon: Activity },
                    { label: "Business Settings", icon: Wrench },
                    { label: "FAQ's", icon: HelpCircle },
                  ].map((item, idx) => {
                    const isActive = activeMenu === item.label;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveMenu(item.label);
                        }}
                        className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 h-9 transition-all duration-200 border-0 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-[#0088FF] to-[#1DB46B] text-white font-bold shadow-md"
                            : "text-white/70 hover:bg-white/5 hover:text-white font-semibold"
                        }`}
                      >
                        <item.icon className={`size-4 ${isActive ? "text-white" : "text-white/60"}`} />
                        <span className="text-[12px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Profile Footer Menu */}
              <div className="relative pt-3 border-t border-white/5" ref={profileDropdownRef}>
                <div className="flex items-center gap-1.5 w-full">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex-1 flex items-center gap-2 text-left hover:bg-white/5 p-1 rounded-xl transition-all duration-200 border-0 cursor-pointer min-w-0"
                  >
                    <div className="flex aspect-square size-7 items-center justify-center rounded-full bg-[#3b82f6] text-white font-extrabold shrink-0 text-[10px] uppercase font-sans">
                      AA
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="font-semibold text-[11px] text-white truncate block leading-tight">
                        Anjar Alam
                      </span>
                      <span className="text-[8.5px] text-white/40 truncate block mt-0.5 font-semibold">
                        alamanjar966@gmail.com
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="size-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border-0 cursor-pointer shrink-0"
                  >
                    <LogOut className="size-3.5" />
                  </button>
                </div>

                {isProfileDropdownOpen && (
                  <div className="absolute w-48 bottom-full left-0 mb-2 bg-[#0B1320] border border-white/10 text-white rounded-xl shadow-2xl p-1.5 z-[50] animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="font-normal px-2 py-1.5">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-[11px] font-bold text-white leading-none">Anjar Alam</p>
                        <p className="text-[8px] text-white/40 truncate leading-none mt-1 font-semibold">
                          alamanjar966@gmail.com
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/5 my-1 h-[1px]" />
                    {["Settings", "Profile", "Log out"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          if (opt === "Log out") {
                            setShowLogoutConfirm(true);
                          } else {
                            toast.info(`Triggered mock "${opt}" option.`);
                          }
                        }}
                        className="text-[11px] font-semibold hover:bg-white/10 hover:text-white rounded-lg cursor-pointer px-2 py-1.5 transition-colors"
                      >
                        {opt}
                      </div>
                    ))}
                    <div className="bg-white/5 my-1 h-[1px]" />
                    <div
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        toast.error("Sandbox account cannot be deleted.");
                      }}
                      className="text-[11px] font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg cursor-pointer px-2 py-1.5 transition-colors"
                    >
                      Delete Account
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Simulated Workspace Content Panel */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden min-h-0 text-slate-800">
              
              {/* Mobile top bar to toggle sidebar */}
              <div className="lg:hidden flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-[#0B1320] text-white shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white border-0 cursor-pointer outline-none flex items-center justify-center"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-[11px] tracking-tight">
                    TallyCash Pro <span className="text-emerald-400">Sandbox</span>
                  </span>
                </div>
                <div className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {activeMenu}
                </div>
              </div>
              
              {/* SANDBOX 1: OVERVIEW */}
              {activeMenu === "Overview" && (
                <div className="relative flex-1 flex overflow-hidden">
                  
                  {/* Left Column: Ledger Dashboard (Takes up 65-70%) */}
                  <div className="flex-1 flex flex-col min-w-0 border-r border-slate-100">
                    
                    {/* Top title bar with Mask Toggle */}
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                      <span className="font-extrabold text-[13px] text-slate-800 uppercase tracking-tight truncate max-w-[200px]">
                        {activeBusiness.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Show / Hide Toggle Button */}
                        <button
                          onClick={handleAmountMaskToggle}
                          className="h-8 px-3 rounded-full border border-slate-200 text-[11px] font-bold bg-white text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
                        >
                          {maskAmounts ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>Show</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                              <span>Hide</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => toast.info("Configure business settings.")}
                          className="h-8 px-3 rounded-full border border-slate-200 text-[11px] font-bold bg-white text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-500" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => setShowBookModal(true)}
                          className="h-8 px-3 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer outline-none border-0"
                        >
                          <Plus className="w-3 h-3 text-white stroke-[2.5]" />
                          <span>New Book</span>
                        </button>
                      </div>
                    </div>

                    {/* Ledger Tabs */}
                    <div className="px-5 py-1.5 border-b border-slate-100 bg-white flex items-center shrink-0">
                      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
                        {filteredCashbooks.map((book) => {
                          const isActive = book.id === activeCashbookId;
                          return (
                            <button
                              key={book.id}
                              onClick={() => {
                                setActiveCashbookId(book.id);
                                setActiveAction(null);
                              }}
                              className={`relative pb-2 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer outline-none border-0 bg-transparent ${
                                isActive ? "text-blue-600 font-bold" : "text-gray-400 hover:text-gray-800"
                              }`}
                            >
                              <span>{book.name}</span>
                              {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="px-5 py-2.5 border-b border-slate-100 flex flex-col gap-2 bg-white shrink-0">
                      <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search Transactions..."
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-slate-400 text-xs font-semibold text-slate-800 bg-slate-50/50"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {["View By", "Category", "Payment Mode"].map((filter, i) => (
                          <button
                            key={i}
                            onClick={() => toast.info(`Filter by "${filter}" trigger.`)}
                            className="h-7 px-2.5 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 bg-white flex items-center gap-1 hover:bg-slate-50 cursor-pointer outline-none"
                          >
                            <span>{filter}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Flow cards */}
                    <div className="px-5 py-3 border-b border-slate-100 bg-white grid grid-cols-3 gap-3 md:gap-4 shrink-0 items-center">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Cash In</span>
                        </div>
                        <div className="text-sm font-extrabold text-slate-800 truncate">
                          {renderAmount(stats.inflow)}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Cash Out</span>
                        </div>
                        <div className="text-sm font-extrabold text-slate-800 truncate">
                          {renderAmount(stats.outflow)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Balance</span>
                          </div>
                          <div className="text-sm font-extrabold text-slate-800 truncate">
                            {renderAmount(stats.balance)}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveMenu("Reports");
                            setStepReports(3);
                          }}
                          className="h-8 px-2.5 rounded-full border border-blue-200 text-[10px] font-bold text-blue-600 bg-blue-50/50 flex items-center gap-1 hover:bg-blue-50 cursor-pointer shrink-0 outline-none border-0"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View report</span>
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Entity List (Ledger transactions table) */}
                    <div className="flex-1 overflow-y-auto max-h-[350px] p-5 space-y-3 bg-slate-50/30">
                      <div className="grid grid-cols-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider pb-1 px-1">
                        <div className="col-span-2">Entity</div>
                        <div className="text-center">Cash In / Out</div>
                        <div className="text-right">Balance</div>
                      </div>

                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx) => {
                          const isIn = tx.type === "in";
                          return (
                            <div
                              key={tx.id}
                              className="bg-white border border-slate-100 rounded-xl p-3 grid grid-cols-4 items-center shadow-sm gap-2 animate-in fade-in-50 duration-150 text-left"
                            >
                              <div className="col-span-2 space-y-1.5 min-w-0">
                                <div className="text-[10px] text-slate-400 font-semibold">{tx.date}</div>
                                <div className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-[9px] font-bold text-blue-600">
                                  Bal. {renderAmount(tx.balanceAfter)}
                                </div>
                                <div className="text-[11px] font-semibold text-slate-700 truncate block mt-0.5">
                                  {tx.paymentMode} • {tx.remarks}
                                </div>
                              </div>

                              <div className="text-center font-extrabold text-[12px]">
                                {isIn ? (
                                  <span className="text-emerald-500">{renderAmount(tx.amount, "+ ")}</span>
                                ) : (
                                  <span className="text-rose-500">{renderAmount(tx.amount, "- ")}</span>
                                )}
                              </div>

                              <div className="flex flex-col items-end gap-1.5 justify-center">
                                <span className="font-extrabold text-[11px] text-slate-800">
                                  {renderAmount(tx.balanceAfter)}
                                </span>
                                {tx.verified ? (
                                  <button
                                    onClick={() => handleVerifyToggle(tx.id)}
                                    className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-transparent border-0 outline-none cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Verified</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleVerifyToggle(tx.id)}
                                    className="h-5 px-2 rounded border border-blue-200 text-[9px] font-bold text-blue-600 bg-white hover:bg-blue-50 cursor-pointer outline-none"
                                  >
                                    Verify
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-12 text-center flex flex-col items-center justify-center bg-white border border-slate-100 rounded-xl">
                          <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                          <span className="font-bold text-xs text-slate-400">No Transactions Found</span>
                          <p className="text-slate-450 text-[10px] mt-1 font-semibold">
                            Add a flow entry below to populate this book statement.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer buttons */}
                    <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-3 gap-3 shrink-0">
                      <button
                        onClick={() => {
                          setActiveAction("cash_in");
                          setFormAmount("");
                        }}
                        className={`h-10 rounded-xl font-extrabold text-xs text-white flex items-center justify-center gap-1.5 transition-all outline-none border-0 cursor-pointer ${
                          activeAction === "cash_in" ? "bg-emerald-700 shadow-inner" : "bg-emerald-600 hover:bg-emerald-500"
                        }`}
                      >
                        <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                        <span>Cash In</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setActiveAction("cash_out");
                          setFormAmount("");
                        }}
                        className={`h-10 rounded-xl font-extrabold text-xs text-white flex items-center justify-center gap-1.5 transition-all outline-none border-0 cursor-pointer ${
                          activeAction === "cash_out" ? "bg-rose-700 shadow-inner" : "bg-rose-500 hover:bg-rose-500"
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        <span>Cash Out</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveAction("transfer");
                          setFormAmount("");
                        }}
                        className={`h-10 rounded-xl font-extrabold text-xs text-white flex items-center justify-center gap-1.5 transition-all outline-none border-0 cursor-pointer ${
                          activeAction === "transfer" ? "bg-blue-700 shadow-inner" : "bg-blue-600 hover:bg-blue-500"
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Transfer</span>
                      </button>
                    </div>

                  </div>

                  {/* Right Column: Dynamic Form Panel (Split pane) */}
                  <div className={`
                    ${activeAction === null ? "hidden md:flex md:w-[280px]" : "absolute inset-y-0 right-0 z-20 w-full sm:w-[280px] md:relative md:w-[280px] md:z-0 bg-slate-50 border-l border-slate-150 shadow-xl md:shadow-none flex flex-col overflow-y-auto"}
                    shrink-0 bg-slate-50/50 relative animate-in fade-in duration-200
                  `}>
                    {activeAction === null ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="relative">
                          <div className="absolute -inset-1 rounded-full bg-blue-100 blur-sm opacity-50 animate-pulse" />
                          <FileText className="w-14 h-14 text-slate-300 relative" />
                        </div>
                        <span className="font-bold text-xs text-slate-500 mt-4">No Books Selected</span>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] leading-relaxed font-semibold">
                          Select an action (Cash In, Cash Out, Transfer) in the footer to add entries.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 flex flex-col gap-4 text-left">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                          <h3 className="font-extrabold text-xs text-slate-700 tracking-tight">
                            {activeAction === "cash_in" && "Add Cash In Entry"}
                            {activeAction === "cash_out" && "Add Cash Out Entry"}
                            {activeAction === "transfer" && "Add Transfer Entry"}
                          </h3>
                          <button
                            onClick={() => setActiveAction(null)}
                            className="text-slate-400 hover:text-slate-600 p-1 border-0 bg-transparent outline-none cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleCreateTxSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Amount</label>
                            <input
                              type="number"
                              placeholder="Enter Here"
                              required
                              value={formAmount}
                              onChange={(e) => setFormAmount(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 text-xs font-semibold text-slate-800 bg-white"
                            />
                          </div>

                          {activeAction !== "transfer" ? (
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                              <div className="flex flex-wrap gap-1.5">
                                {TX_CATEGORIES.map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormCategory(cat)}
                                    className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer outline-none ${
                                      formCategory === cat
                                        ? "border-blue-600 bg-blue-50 text-blue-600"
                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Transfer To</label>
                              {transferOptions.length > 0 ? (
                                <select
                                  value={transferTargetId}
                                  onChange={(e) => setTransferTargetId(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 text-xs font-semibold text-slate-800 bg-white"
                                >
                                  {transferOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                      {opt.name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <p className="text-[10px] text-slate-400 font-bold italic">
                                  Create another cashbook first to enable transfers.
                                </p>
                              )}
                            </div>
                          )}

                          {activeAction !== "transfer" && (
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Party Name</label>
                              <input
                                type="text"
                                placeholder="Search"
                                value={formPartyName}
                                onChange={(e) => setFormPartyName(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 text-xs font-semibold text-slate-800 bg-white"
                              />
                            </div>
                          )}

                          {activeAction !== "transfer" && (
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Mode</label>
                              <div className="flex flex-wrap gap-1.5">
                                {PAYMENT_MODES.map((mode) => (
                                  <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setFormPaymentMode(mode)}
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer outline-none ${
                                      formPaymentMode === mode
                                        ? "border-blue-600 bg-blue-50 text-blue-600"
                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                                  >
                                    {mode}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Date *</label>
                            <div className="text-[11px] text-slate-600 font-bold bg-slate-100/50 p-2 rounded-lg border border-slate-100 text-left">
                              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Additional Information / Remarks</label>
                            <textarea
                              placeholder="Enter Here"
                              rows={2}
                              value={formAdditionalInfo}
                              onChange={(e) => setFormAdditionalInfo(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 text-xs font-semibold text-slate-800 bg-white resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={activeAction === "transfer" && transferOptions.length === 0}
                            className={`w-full py-2.5 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer outline-none border-0 ${
                              activeAction === "cash_in" ? "bg-emerald-600 hover:bg-emerald-500" :
                              activeAction === "cash_out" ? "bg-rose-500 hover:bg-rose-500" :
                              "bg-blue-600 hover:bg-blue-500"
                            }`}
                          >
                            Save {activeAction === "transfer" ? "Transfer" : "Entry"}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SANDBOX 2: TEAM MANAGEMENT (Screenshot 1) */}
              {activeMenu === "Team Management" && (
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/20 text-slate-850">
                  {/* Top Switch tabs */}
                  <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-bold">
                      <button className="px-4 py-1.5 rounded-full bg-white shadow-sm text-blue-600 flex items-center gap-1 border-0">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Business</span>
                      </button>
                      <button className="px-4 py-1.5 rounded-full text-slate-500 hover:text-slate-800 bg-transparent border-0 cursor-pointer">
                        <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                        <span>Books</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setShowMemberModal(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm border-0 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Add Member</span>
                    </button>
                  </div>

                  {/* Mobile Tab Selector for Team columns */}
                  <div className="md:hidden flex border-b border-slate-100 bg-slate-50/40 p-1.5 shrink-0 gap-1">
                    {[
                      { id: "members", label: "Members" },
                      { id: "settings", label: "Settings" },
                      { id: "rules", label: "Roles Guide" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTeamMobileTab(tab.id as any)}
                        className={`flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg border-0 transition-colors cursor-pointer ${
                          teamMobileTab === tab.id
                            ? "bg-white text-blue-600 shadow-xs"
                            : "bg-transparent text-slate-505 text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Main split grid */}
                  <div className="flex-1 grid grid-cols-12 overflow-hidden min-h-0 text-left">
                    
                    {/* Left Panel: Members list (4 cols) */}
                    <div className={`col-span-12 md:col-span-4 border-r border-slate-100 bg-white flex flex-col min-h-0 ${teamMobileTab === "members" ? "flex" : "hidden md:flex"}`}>
                      <div className="p-4 border-b border-slate-100 shrink-0 space-y-3">
                        <h4 className="font-extrabold text-xs text-slate-800">Business Members</h4>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search Members..."
                            value={teamSearchQuery}
                            onChange={(e) => setTeamSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg outline-none text-[11px] font-semibold text-slate-800 bg-slate-50"
                          />
                        </div>
                        <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">
                          {filteredMembersList.length} Members Found
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredMembersList.map((m) => {
                          const isActive = m.id === selectedMemberId;
                          return (
                            <div
                              key={m.id}
                              onClick={() => {
                                setSelectedMemberId(m.id);
                                if (stepTeam === 1) {
                                  setStepTeam(2);
                                }
                              }}
                              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                                isActive ? "bg-blue-50 text-blue-900" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-[#fce8e6] text-[#c5221f] font-bold shrink-0 text-xs font-sans">
                                  {m.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col text-left min-w-0">
                                  <span className="font-bold text-[11.5px] truncate block leading-tight">
                                    {m.name}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-semibold truncate block mt-0.5">
                                    {m.email}
                                  </span>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase ${
                                m.role === "OWNER" ? "bg-amber-100 text-amber-700" : m.role === "PARTNER" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"
                              }`}>
                                {m.role}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Middle Panel: Member Settings Configuration (4 cols) */}
                    <div className={`col-span-12 md:col-span-4 border-r border-slate-100 bg-white flex flex-col p-5 overflow-y-auto ${teamMobileTab === "settings" ? "flex" : "hidden md:flex"}`}>
                      <h4 className="font-extrabold text-xs text-slate-800 pb-3 border-b border-slate-100">Member Settings</h4>
                      
                      {selectedMember ? (
                        <div className="space-y-5 pt-4 text-xs font-semibold text-slate-700">
                          <div className="flex flex-col items-center text-center space-y-2 pb-3 border-b border-slate-100">
                            <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-[#e8f0fe] text-[#1a73e8] font-bold text-base font-sans">
                              {selectedMember.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-800 text-sm">{selectedMember.name}</h5>
                              <p className="text-[10px] text-slate-400 mt-0.5">{selectedMember.email}</p>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Access Role</label>
                            {selectedMember.role === "OWNER" ? (
                              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500">
                                Primary Owner (Root Permission)
                              </div>
                            ) : (
                              <select
                                value={selectedMember.role}
                                onChange={(e) => {
                                  handleUpdateMemberRole(e.target.value as any);
                                }}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 text-xs font-semibold text-slate-800 bg-white"
                              >
                                <option value="PARTNER">PARTNER</option>
                                <option value="STAFF">STAFF</option>
                              </select>
                            )}
                          </div>

                          {selectedMember.role !== "OWNER" && (
                            <button
                              onClick={handleRemoveMember}
                              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors border-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove from Business</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                          <Users className="w-10 h-10 text-slate-200" />
                          <span className="font-bold text-[11px] text-slate-400 mt-3">No Member Selected</span>
                          <p className="text-[9px] text-slate-400 mt-1 max-w-[150px] leading-relaxed">
                            Select a member from the left panel to configure their business-level access role.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Panel: Business Roles Guide & Rules (4 cols) */}
                    <div className={`col-span-12 md:col-span-4 bg-slate-50/20 p-5 flex flex-col overflow-y-auto ${teamMobileTab === "rules" ? "flex" : "hidden md:flex"}`}>
                      <h4 className="font-extrabold text-[11px] text-slate-500 uppercase tracking-wider pb-3">Business Roles Guide & Rules</h4>
                      
                      <div className="space-y-2">
                        {/* Dropdown Card 1 */}
                        <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => setTeamAccordion(teamAccordion === "roles" ? null : "roles")}
                            className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border-0 outline-none cursor-pointer"
                          >
                            <div className="flex items-center gap-2 text-blue-600">
                              <Shield className="w-4 h-4" />
                              <span>Business Roles & Permissions</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${teamAccordion === "roles" ? "rotate-180" : ""}`} />
                          </button>

                          {teamAccordion === "roles" && (
                            <div className="p-3 border-t border-slate-100 bg-slate-50/30 space-y-2.5 text-[10px] text-left">
                              {/* OWNER */}
                              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/30">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-amber-800">OWNER</span>
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[8px]">Business Level</span>
                                </div>
                                <p className="text-slate-500 mt-1 leading-relaxed">
                                  Primary account holder. Full access and ownership of all books, logs, and business settings.
                                </p>
                              </div>
                              {/* PARTNER */}
                              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/30">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-blue-800">PARTNER</span>
                                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[8px]">Business Level</span>
                                </div>
                                <p className="text-slate-500 mt-1 leading-relaxed">
                                  Full access to manage books, members, and business operations.
                                </p>
                              </div>
                              {/* STAFF */}
                              <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/30">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-emerald-800">STAFF</span>
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[8px]">Business Level</span>
                                </div>
                                <p className="text-slate-500 mt-1 leading-relaxed">
                                  Team member with access based on assigned book permissions.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Dropdown Card 2 */}
                        <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => setTeamAccordion(teamAccordion === "books" ? null : "books")}
                            className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border-0 outline-none cursor-pointer"
                          >
                            <div className="flex items-center gap-2 text-slate-700">
                              <BookOpen className="w-4 h-4 text-slate-400" />
                              <span>Book Access Levels</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${teamAccordion === "books" ? "rotate-180" : ""}`} />
                          </button>

                          {teamAccordion === "books" && (
                            <div className="p-3 border-t border-slate-100 bg-slate-50/30 text-[10px] text-slate-500 text-left leading-relaxed">
                              Staff members can only view or edit transactions inside cashbooks they have been explicitly added to. Owners and Partners can manage all cashbooks.
                            </div>
                          )}
                        </div>

                        {/* Dropdown Card 3 */}
                        <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => setTeamAccordion(teamAccordion === "add" ? null : "add")}
                            className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border-0 outline-none cursor-pointer"
                          >
                            <div className="flex items-center gap-2 text-slate-700">
                              <UserCog className="w-4 h-4 text-slate-400" />
                              <span>How to Add & Manage Members</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${teamAccordion === "add" ? "rotate-180" : ""}`} />
                          </button>

                          {teamAccordion === "add" && (
                            <div className="p-3 border-t border-slate-100 bg-slate-50/30 text-[10px] text-slate-500 text-left leading-relaxed">
                              Click the 'Add Member' button, insert the user's name, email, and choose their role. The user will be invited to your workspace.
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* SANDBOX 3: REPORTS (Screenshot 2) */}
              {activeMenu === "Reports" && (
                <div className="flex-1 flex overflow-hidden bg-slate-50/20 text-slate-800 animate-in fade-in duration-200">
                  
                  {/* Left reports pane (4 cols mock layout) */}
                  <div className={`
                    w-52 border-r border-slate-100 bg-white flex flex-col shrink-0 text-left min-h-0
                    ${reportsMobileTab === "selector" ? "w-full" : "hidden md:flex"}
                  `}>
                    <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
                      <h4 className="font-extrabold text-xs text-slate-800">Reports</h4>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search Books..."
                          className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg outline-none text-[11px] font-semibold text-slate-800 bg-slate-50"
                        />
                      </div>
                      <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                        3 Books Found
                      </div>
                    </div>

                    <div className="flex-1 p-2 space-y-1">
                      {/* <button
                        onClick={() => { setReportType("business"); setReportsMobileTab("content"); }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left cursor-pointer transition-colors border-0 ${
                          reportType === "business" ? "bg-blue-50 text-blue-700 font-bold" : "bg-transparent text-slate-600 hover:bg-slate-50 font-semibold"
                        }`}
                      >
                        <Building2 className={`w-4 h-4 ${reportType === "business" ? "text-blue-600" : "text-slate-400"}`} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11.5px] truncate">Business Reports</span>
                          <span className="text-[8px] text-slate-400 truncate mt-0.5">All Customer all transactions</span>
                        </div>
                      </button> */}

                      <button
                        onClick={() => { setReportType("book"); setReportsMobileTab("content"); }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left cursor-pointer transition-colors border-0 ${
                          reportType === "book" ? "bg-blue-50 text-blue-700 font-bold" : "bg-transparent text-slate-600 hover:bg-slate-50 font-semibold"
                        }`}
                      >
                        <BookOpen className={`w-4 h-4 ${reportType === "book" ? "text-blue-600" : "text-slate-400"}`} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11.5px] truncate">Books Reports</span>
                          <span className="text-[8px] text-slate-400 truncate mt-0.5">All Customer all transactions</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Right Reports Panel Content area */}
                  <div className={`
                    flex-1 flex flex-col overflow-y-auto text-left
                    ${reportsMobileTab === "content" ? "flex" : "hidden md:flex"}
                  `}>
                    
                    {/* Top action bar */}
                    <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Mobile Back Button */}
                        <button
                          type="button"
                          onClick={() => setReportsMobileTab("selector")}
                          className="md:hidden h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer outline-none shrink-0"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                        
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-extrabold text-[13px] text-slate-800 truncate">
                            Lifestyle Outfit Of Mens And Ladies Wear
                          </h4>
                          <span className="text-[9px] text-slate-400 font-bold tracking-tight">
                            All Customer all transactions
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toast.info("Excel statement downloading...")}
                          className="h-8 px-3 rounded-full border border-slate-200 bg-white text-slate-700 text-[10px] font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer outline-none"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Excel</span>
                        </button>
                        <button
                          onClick={handleDownloadReport}
                          className="h-8 px-3 rounded-full border border-slate-250 bg-white text-slate-700 text-[10px] font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer outline-none"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Filter Dropdown rows */}
                    <div className="p-6 border-b border-slate-100 bg-white space-y-4 shrink-0 text-xs font-bold text-slate-600">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Business Name</label>
                          <select className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-slate-400 text-xs font-semibold text-slate-800">
                            <option>Lifestyle Outfit Of Mens And Ladies Wear</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Period</label>
                          <select
                            value={reportPeriod}
                            onChange={(e) => setReportPeriod(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-slate-400 text-xs font-semibold text-slate-800"
                          >
                            <option>This month</option>
                            <option>Last 30 Days</option>
                            <option>Custom Date Range</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                          <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-[11px] font-bold text-slate-600">
                            01 Jul 2026 - 18 Jul 2026
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Transaction Type</label>
                          <select
                            value={reportTxType}
                            onChange={(e) => setReportTxType(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-slate-400 text-xs font-semibold text-slate-800"
                          >
                            <option>All Types</option>
                            <option>Inflow</option>
                            <option>Outflow</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                          <select
                            value={reportCategory}
                            onChange={(e) => setReportCategory(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-slate-400 text-xs font-semibold text-slate-800"
                          >
                            <option>All Categories</option>
                            <option>parking</option>
                            <option>Product sales</option>
                            <option>Salaries</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Mode</label>
                          <select
                            value={reportPaymentMode}
                            onChange={(e) => setReportPaymentMode(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-slate-400 text-xs font-semibold text-slate-800"
                          >
                            <option>All Payment Modes</option>
                            <option>Cash</option>
                            <option>UPI</option>
                            <option>Bank Transfer</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Metric Balance Cards */}
                    <div className="p-6 bg-slate-50/30 flex flex-col gap-4">
                      <div className="text-[10px] font-bold text-slate-450 uppercase">Total 3 books</div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#fce8e6] border border-[#f5c6cb] rounded-xl p-4 text-left">
                          <div className="text-[10px] font-bold text-rose-700 uppercase">You Gave</div>
                          <div className="text-xl font-extrabold text-[#c5221f] mt-1 font-mono">₹ 300.00</div>
                        </div>

                        <div className="bg-[#e6f4ea] border border-[#c3e6cb] rounded-xl p-4 text-left">
                          <div className="text-[10px] font-bold text-emerald-700 uppercase">You Got</div>
                          <div className="text-xl font-extrabold text-[#137333] mt-1 font-mono">₹ 6,120.00</div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-left">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Net Balance</div>
                          <div className="text-xl font-extrabold text-blue-400 mt-1 font-mono">₹ 5,820.00</div>
                        </div>
                      </div>

                      {/* Transactions list table */}
                      <h4 className="font-extrabold text-xs text-slate-700 uppercase mt-4">Transactions Ledger (Active Book)</h4>
                      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden text-[11px] shadow-sm">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100 text-[9px] font-extrabold text-slate-400 uppercase bg-slate-50/50">
                              <th className="p-3">Date & Time</th>
                              <th className="p-3">Party</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Payment Mode</th>
                              <th className="p-3">Remark</th>
                              <th className="p-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.slice(0, 5).map((tx) => {
                              const isIn = tx.type === "in";
                              return (
                                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50/30">
                                  <td className="p-3 text-slate-500 font-semibold">{tx.date}</td>
                                  <td className="p-3 font-bold text-slate-700">{tx.partyName || "-"}</td>
                                  <td className="p-3">
                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                      {tx.category}
                                    </span>
                                  </td>
                                  <td className="p-3 text-slate-500">{tx.paymentMode}</td>
                                  <td className="p-3 text-slate-600 font-medium">{tx.remarks}</td>
                                  <td className={`p-3 text-right font-extrabold ${isIn ? "text-emerald-600" : "text-rose-600"}`}>
                                    {isIn ? `+ ₹${tx.amount.toFixed(2)}` : `- ₹${tx.amount.toFixed(2)}`}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* SANDBOX 4: ACTIVITY LOGS (Screenshot 3) */}
              {activeMenu === "Activity Logs" && (
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/20 text-slate-800 animate-in fade-in duration-200">
                  {/* Top header bar */}
                  <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveMenu("Overview")}
                        className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer outline-none"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                      <h3 className="font-extrabold text-sm text-slate-800">Activity & Logs</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsBizDropdownOpen(true)}
                        className="h-8 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-[11px] font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer outline-none"
                      >
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Switch Business</span>
                      </button>
                      <button
                        onClick={handleReset}
                        className="h-8 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-[11px] font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer outline-none"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {/* Audit numeric status cards */}
                  <div className="p-6 border-b border-slate-100 bg-white grid grid-cols-4 gap-4 shrink-0">
                    {[
                      { label: "TOTAL LOGS", val: filteredLogsList.length, icon: Activity, bg: "bg-slate-100 text-slate-700" },
                      { label: "CREATED", val: filteredLogsList.filter(l => l.type === "Created").length, icon: Plus, bg: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
                      { label: "UPDATED", val: filteredLogsList.filter(l => l.type === "Updated").length, icon: RefreshCw, bg: "bg-blue-50 text-blue-600 border border-blue-100" },
                      { label: "DELETED", val: filteredLogsList.filter(l => l.type === "Deleted").length, icon: Trash2, bg: "bg-rose-50 text-rose-600 border border-rose-100" },
                    ].map((card, i) => (
                      <div key={i} className="bg-white border border-slate-150 p-4 rounded-xl flex items-center gap-3.5 shadow-sm text-left">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${card.bg}`}>
                          <card.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{card.label}</div>
                          <div className="text-xl font-extrabold text-slate-800 mt-1 font-mono">{card.val}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Filters & logs list */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    <div className="flex items-center justify-between gap-4 shrink-0">
                      <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search logs by description or user..."
                          value={logsSearchQuery}
                          onChange={(e) => setLogsSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg outline-none text-xs font-semibold text-slate-800 bg-white"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                        {["All Activity", "Created", "Updated", "Deleted"].map((filter) => {
                          const isActive = activeLogFilter === filter;
                          return (
                            <button
                              key={filter}
                              onClick={() => { setActiveLogFilter(filter); }}
                              className={`px-3 py-1.5 rounded-md border-0 cursor-pointer ${
                                isActive ? "bg-[#0c1624] text-white" : "text-slate-500 hover:text-slate-800 bg-transparent"
                              }`}
                            >
                              {filter}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline items list */}
                    <div className="space-y-3">
                      {filteredLogsList.map((log) => (
                        <div
                          key={log.id}
                          className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col gap-2 shadow-sm text-left animate-in fade-in-50 duration-150"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                              {log.type}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold tracking-tight">{log.timestamp}</span>
                          </div>
                          
                          <div className="text-xs font-bold text-slate-700 mt-1">{log.action}</div>
                          
                          <div className="flex items-center gap-1.5 mt-1 border-t border-slate-55 pt-2 text-[10px] text-slate-550">
                            <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-extrabold uppercase shrink-0 text-[9px] font-sans">
                              {log.user.slice(0, 2)}
                            </div>
                            <span className="font-extrabold text-slate-600">{log.user}</span>
                            <span className="h-1 w-1 bg-slate-300 rounded-full" />
                            <span className="font-semibold text-slate-400">TIMESTAMP {log.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* SANDBOX 5: BUSINESS SETTINGS */}
              {activeMenu === "Business Settings" && (
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/20 text-slate-805 text-left animate-in fade-in duration-200">
                  {/* Top Header bar with Back Arrow */}
                  <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveMenu("Overview")}
                        className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer outline-none"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                      <h3 className="font-extrabold text-sm text-slate-800">Business Settings</h3>
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {/* Business summary card */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden text-left">
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white font-sans uppercase">
                            {activeBusiness.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h2 className="text-base font-extrabold text-slate-900 truncate uppercase">
                                  {activeBusiness.name}
                                </h2>
                                <div className="text-xs text-slate-500 mt-0.5 font-semibold">
                                  {filteredCashbooks.length} Books
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setBizSettingsName(activeBusiness.name);
                                  setBizSettingsCat(activeBusiness.category);
                                  toast.info("Edit business settings (simulated).");
                                }}
                                className="shrink-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg border-0 bg-transparent cursor-pointer outline-none"
                                aria-label="Edit business"
                              >
                                <Pencil className="h-4 w-4 text-rose-500" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              Status
                            </p>
                            <p className="text-xs font-extrabold text-emerald-600 mt-0.5">
                              Active
                            </p>
                          </div>
                          <div className="border-x border-slate-100 px-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              Your role
                            </p>
                            <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                              Owner
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              Category
                            </p>
                            <p className="text-xs font-extrabold text-slate-900 mt-0.5 capitalize truncate">
                              {CATEGORIES.find(c => c.id === activeBusiness.category)?.label || "Service Business"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Settings menu list */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100 text-left">
                      {[
                        {
                          icon: <HistoryIcon className="h-5 w-5" />,
                          iconBg: "bg-blue-50 text-blue-600",
                          title: "Activity & Logs",
                          subtitle: "Track all changes, activities and transaction history",
                          action: () => setActiveMenu("Activity Logs")
                        },
                        {
                          icon: <Users className="h-5 w-5" />,
                          iconBg: "bg-blue-50 text-blue-600",
                          title: "Team Management",
                          subtitle: "Invite members and manage roles for this business",
                          action: () => setActiveMenu("Team Management")
                        },
                        {
                          icon: <Trash2 className="h-5 w-5" />,
                          iconBg: "bg-blue-50 text-blue-600",
                          title: "Deleted books",
                          subtitle: "Restore books removed from this business (15 days)",
                          action: () => toast.info("Restore deleted books from backup logs.")
                        },
                        {
                          icon: <Trash2 className="h-5 w-5" />,
                          iconBg: "bg-rose-50 text-rose-600",
                          title: "Delete business",
                          subtitle: "Permanently remove this business and all data (owner only)",
                          destructive: true,
                          action: () => {
                            toast.error("Deletion of business is simulated-only.");
                          }
                        }
                      ].map((row, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={row.action}
                          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50/90 border-0 bg-transparent cursor-pointer outline-none animate-in fade-in duration-100"
                        >
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${row.iconBg}`}>
                            {row.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-extrabold ${row.destructive ? "text-rose-600" : "text-slate-900"}`}>
                              {row.title}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-snug">{row.subtitle}</p>
                          </div>
                          <ChevronRight className={`h-4 w-4 shrink-0 ${row.destructive ? "text-rose-350" : "text-slate-400"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SANDBOX 6: FAQ'S */}
              {activeMenu === "FAQ's" && (
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/20 text-slate-805 text-left animate-in fade-in duration-200">
                  {/* Search Header */}
                  <div className="px-6 py-4 border-b border-slate-100 bg-white space-y-3 shrink-0">
                    <h3 className="font-extrabold text-sm text-slate-800">FAQ & Help</h3>
                    <p className="text-xs text-slate-450 font-medium">Get answers to your questions</p>
                    
                    {/* Search Input matching real FAQ screen */}
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={faqSearchQuery}
                        onChange={(e) => {
                          setFaqSearchQuery(e.target.value);
                          setFaqIndex(null);
                        }}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 text-xs font-semibold text-slate-805 bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Accordion Group Categories */}
                  <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {filteredFaqs.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="font-bold text-xs text-slate-700">No results found</h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">Try searching with different keywords</p>
                      </div>
                    ) : (
                      Object.entries(groupedFaqs).map(([category, items]) => (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center mb-2">
                            <div className="w-1 h-4 bg-blue-600 rounded-full mr-2"></div>
                            <h4 className="font-extrabold text-xs text-slate-900">{category}</h4>
                          </div>

                          <div className="space-y-2">
                            {items.map((faq, idx) => {
                              const globalIndex = faqItems.indexOf(faq);
                              const isOpen = faqIndex === globalIndex;
                              return (
                                <div key={idx} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                  <button
                                    onClick={() => setFaqIndex(isOpen ? null : globalIndex)}
                                    className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-700 bg-transparent border-0 outline-none cursor-pointer text-left font-sans"
                                  >
                                    <span className={isOpen ? "text-blue-600" : ""}>{faq.question}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`} />
                                  </button>
                                  {isOpen && (
                                    <div className="px-4 pb-4 animate-in fade-in duration-100">
                                      <div className="pt-3 border-t border-slate-50 text-slate-500 text-[11px] leading-relaxed whitespace-pre-line font-medium">
                                        {faq.answer}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* SIMULATOR GLOBAL POP-UP MODALS */}
          
          {/* Modal 1: Create Business */}
          {showBusinessModal && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-40">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="font-bold text-sm text-white">Add New Business</h3>
                  <button onClick={() => setShowBusinessModal(false)} className="text-slate-500 hover:text-slate-300 border-0 bg-transparent outline-none cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleCreateBusinessSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Business Title</label>
                    <input
                      type="text"
                      placeholder="e.g. My Cafe"
                      value={newBizName}
                      onChange={(e) => setNewBizName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs outline-none focus:border-blue-500 text-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block block">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.slice(0, 4).map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => setNewBizCat(cat.id)}
                          className={`flex items-center gap-1.5 p-1.5 rounded-full border cursor-pointer select-none truncate ${
                            newBizCat === cat.id ? "border-blue-500 bg-blue-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-850"
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0 uppercase font-sans">
                            {cat.label[0]}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-300 truncate">{cat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 outline-none"
                  >
                    Add Business
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Modal 2: Create Cashbook */}
          {showBookModal && (
            <div className="absolute inset-0 bg-slate-955 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-40">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="font-bold text-sm text-white">Create Cash Book</h3>
                  <button onClick={() => setShowBookModal(false)} className="text-slate-500 hover:text-slate-300 border-0 bg-transparent outline-none cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleCreateBookSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Cashbook Name</label>
                    <input
                      type="text"
                      placeholder="e.g. UPI QR Counter, Bank Account"
                      value={newBookName}
                      onChange={(e) => setNewBookName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-955 bg-slate-950 border border-slate-800 rounded-lg text-xs outline-none focus:border-blue-500 text-white font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 outline-none"
                  >
                    Add Cash Book
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Modal 3: Invite Team Member */}
          {showMemberModal && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-40">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-slate-200 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="font-bold text-sm text-white">Invite Team Member</h3>
                  <button onClick={() => setShowMemberModal(false)} className="text-slate-500 hover:text-slate-300 border-0 bg-transparent outline-none cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleAddMemberSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Member Name</label>
                    <input
                      type="text"
                      placeholder="Enter Member Name"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs outline-none focus:border-blue-500 text-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Member Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs outline-none focus:border-blue-500 text-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Access Role</label>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs outline-none focus:border-blue-500 text-white font-semibold"
                    >
                      <option value="STAFF">STAFF</option>
                      <option value="PARTNER">PARTNER</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 outline-none"
                  >
                    Send Invitation
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Simulated Sign Out Alert Confirmation Pop-up */}
          {showLogoutConfirm && (
            <div className="absolute inset-0 bg-slate-955 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
              <div className="w-[300px] rounded-2xl border border-white/10 bg-[#0B1320] p-5 gap-0 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0088FF] to-[#1DB46B] text-white shadow-md shadow-[#0088FF]/15">
                  <LogOut className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold tracking-tight text-white">Sign out from Sandbox?</h4>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    This will reset your simulated dashboard logs and go back to landing page.
                  </p>
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 h-9 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      toast.info("Logged out from simulated environment.");
                      window.location.href = "/";
                    }}
                    className="flex-1 h-9 rounded-xl bg-gradient-to-r from-[#0088FF] to-[#1DB46B] text-xs font-bold text-white cursor-pointer border-0"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Overlay success report card */}
          {downloadComplete && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in duration-200">
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Report Downloaded!</h3>
              <p className="text-slate-400 text-xs mt-1.5 max-w-sm font-medium">
                Statement generated for <strong>{activeBusiness.name}</strong>.
              </p>
              
              {/* PDF Preview outline */}
              <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-xl p-4 mt-4 text-left space-y-2 text-[10px] font-medium text-slate-300">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white uppercase text-[8px] tracking-wider">TallyCash Audit Statement</span>
                  <span className="text-slate-500">Page 1 of 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Business Unit:</span>
                  <span className="font-semibold text-white">{activeBusiness.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Net Balance:</span>
                  <span className="font-bold text-emerald-400">₹{stats.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Inflow:</span>
                  <span className="font-bold text-emerald-400">₹{stats.inflow.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Outflow:</span>
                  <span className="font-bold text-rose-400">₹{stats.outflow.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setDownloadComplete(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer border-0 outline-none"
                >
                  Back to Sandbox
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer border-0 outline-none"
                >
                  Restart Demo Flow
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Simulator features block */}
      <section className="bg-slate-955 bg-slate-950 py-16 px-6 md:px-12 border-t border-slate-800 mt-12">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Full Application Capabilities</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              The live application includes features built for professional teams, distributors, and retail businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Real-time Ledgers</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Record receipts, calculate taxes, and maintain clear cash balance flow sheets across multiple cash points simultaneously.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Multi-Partner Collaboration</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Invite team members, assign permissions (Admin, Editor, Viewer), and review change records in real-time.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <HistoryIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">15-Day Trash Recovery</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Deleted books or incorrect ledger logs can be easily audited, tracked, and restored within 15 days of removal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}
