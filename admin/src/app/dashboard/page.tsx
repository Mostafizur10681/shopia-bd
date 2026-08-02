"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  FolderTree, 
  Tag, 
  Sliders, 
  ShoppingBag, 
  Receipt, 
  UserCheck, 
  Users, 
  Star, 
  HelpCircle, 
  MapPin, 
  MessageSquare, 
  Headphones, 
  Wallet, 
  CreditCard, 
  FileText, 
  Info, 
  PhoneCall, 
  SlidersHorizontal, 
  UserCog, 
  Settings, 
  Search, 
  LogOut, 
  Bell, 
  ChevronDown, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Activity, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Calendar,
  Clock
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const menuToRouteMap: Record<string, string> = {
  "Dashboard": "/dashboard",
  "All Products": "/all-products",
  "Add Product": "/add-product",
  "Main Category": "/category",
  "Add Category": "/add-category",
  "Edit Category": "/edit-category",
  "Sub Category": "/sub-category",
  "Add Sub Category": "/add-sub-category",
  "Edit Sub Category": "/edit-sub-category",
  "Order List": "/order-list",
  "Payment Status": "/payment-status",
  "Customers": "/customers",
  "Reviews": "/reviews",
  "Reviews List": "/reviews",
  "Add Review": "/add-review",
  "Edit Review": "/edit-review",
  "Settings": "/settings",
};

const routeToMenuMap: Record<string, string> = Object.entries(menuToRouteMap).reduce((acc, [key, val]) => {
  acc[val] = key;
  return acc;
}, {} as Record<string, string>);

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const editIdParam = searchParams.get("id");

  const { admin, isLoading, logout } = useAdminAuth();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (pathname && routeToMenuMap[pathname]) {
      setActiveMenu(routeToMenuMap[pathname]);
    } else if (tabParam) {
      setActiveMenu(tabParam);
    }
  }, [pathname, tabParam]);

  const handleMenuChange = (menuName: string) => {
    setActiveMenu(menuName);
    const targetRoute = menuToRouteMap[menuName] || "/dashboard";
    router.push(targetRoute);
  };

  // Product Management & Form States
  const [productsList, setProductsList] = useState<any[]>([
    {
      id: 1,
      name: "Organic Black Maca Powder (300 gm)",
      slug: "organic-black-maca-powder-300-gm",
      price: 1450,
      original_price: 1800,
      stock: 45,
      main_image: "/prod_maca.png",
      description: "Premium grade organic Maca Powder imported directly. Rich in nutrients and energy boosters.",
      category: "Health & Organic"
    },
    {
      id: 2,
      name: "Mustard Oil (সরিষার তেল 1L)",
      slug: "mustard-oil-1l",
      price: 300,
      original_price: 350,
      stock: 120,
      main_image: "/prod_blackseed.png",
      description: "100% pure cold-pressed mustard oil. Traditional aromatic cooking oil.",
      category: "Groceries & Cooking"
    }
  ]);

  // Form input state
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCategory, setFormCategory] = useState("Health & Organic");
  const [formDescription, setFormDescription] = useState("");
  // Review Management & Form States
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [searchReviewQuery, setSearchReviewQuery] = useState("");
  const [statusReviewFilter, setStatusReviewFilter] = useState("All");
  const [ratingReviewFilter, setRatingReviewFilter] = useState("All");

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [reviewCustomerName, setReviewCustomerName] = useState("");
  const [reviewProductId, setReviewProductId] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewStatus, setReviewStatus] = useState("Pending");
  const [reviewImage, setReviewImage] = useState("");

  const resetReviewForm = () => {
    setEditingReviewId(null);
    setReviewCustomerName("Admin");
    setReviewProductId("");
    setReviewComment("");
    setReviewRating(5);
    setReviewStatus("Pending");
    setReviewImage("");
  };

  const fetchReviews = async () => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (admin?.token) headers["Authorization"] = `Bearer ${admin.token}`;
      let res = await fetch("http://127.0.0.1:8000/api/v1/reviews", { headers });
      if (!res.ok) {
        res = await fetch("http://127.0.0.1:8000/api/v1/admin/reviews", { headers });
      }
      if (res.ok) {
        const data = await res.json();
        const apiReviews = Array.isArray(data) ? data : data.reviews || [];
        setReviewsList(apiReviews);

        if (editIdParam && pathname === "/edit-review") {
          const target = apiReviews.find((rev: any) => rev.id.toString() === editIdParam);
          if (target) {
            setEditingReviewId(target.id);
            setReviewCustomerName(target.customer_name);
            setReviewProductId(target.product_id ? target.product_id.toString() : "");
            setReviewComment(target.comment);
            setReviewRating(target.rating || 5);
            setReviewStatus(target.status || "Pending");
            setReviewImage(target.image || "");
          }
        }
      }
    } catch (e) {
      console.warn("Backend API offline for reviews", e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (pathname === "/edit-review" && editIdParam && reviewsList.length > 0) {
      const target = reviewsList.find((rev: any) => rev.id.toString() === editIdParam);
      if (target) {
        setEditingReviewId(target.id);
        setReviewCustomerName(target.customer_name);
        setReviewProductId(target.product_id ? target.product_id.toString() : "");
        setReviewComment(target.comment);
        setReviewRating(target.rating || 5);
        setReviewStatus(target.status || "Pending");
        setReviewImage(target.image || "");
      }
    }
  }, [pathname, editIdParam, reviewsList]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [searchCategoryQuery, setSearchCategoryQuery] = useState("");
  const [statusCategoryFilter, setStatusCategoryFilter] = useState("All");

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [catParent, setCatParent] = useState("");
  const [catName, setCatName] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catStatus, setCatStatus] = useState("Active");
  const [catMetaTitle, setCatMetaTitle] = useState("");
  const [catMetaDesc, setCatMetaDesc] = useState("");
  const [catImage, setCatImage] = useState("");

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCatParent("");
    setCatName("");
    setCatDescription("");
    setCatStatus("Active");
    setCatMetaTitle("");
    setCatMetaDesc("");
    setCatImage("");
  };

  // Fetch Categories & Sub Categories strictly from Backend API Database
  const fetchCategories = async () => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (admin?.token) {
        headers["Authorization"] = `Bearer ${admin.token}`;
      }

      // 1. Fetch Main Categories
      let catRes = await fetch("http://127.0.0.1:8000/api/v1/categories", { headers });
      if (!catRes.ok) {
        catRes = await fetch("http://127.0.0.1:8000/api/v1/admin/categories", { headers });
      }

      // 2. Fetch Sub Categories from sub_categories table API
      let subRes = await fetch("http://127.0.0.1:8000/api/v1/sub-categories", { headers });
      if (!subRes.ok) {
        subRes = await fetch("http://127.0.0.1:8000/api/v1/admin/sub-categories", { headers });
      }

      let formattedCategories: any[] = [];
      let mainCatsMap: Record<number, string> = {};

      if (catRes.ok) {
        const data = await catRes.json();
        const apiCategories = Array.isArray(data) ? data : data.categories || [];
        apiCategories.forEach((c: any) => {
          mainCatsMap[c.id] = c.name;
          formattedCategories.push({
            id: c.id,
            name: c.name,
            parent_id: null,
            type: "Main Category",
            parent: "—",
            desc: c.description || "No description",
            status: c.is_active === false || c.is_active === 0 ? "Inactive" : "Active",
            date: c.created_at ? c.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            color: "from-blue-600 to-indigo-600",
            image: c.image || null,
            isSubCategoryTable: false
          });
        });
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        const apiSubCategories = Array.isArray(subData) ? subData : subData.sub_categories || [];
        apiSubCategories.forEach((s: any) => {
          const parentName = s.category ? s.category.name : (mainCatsMap[s.category_id] || "—");
          formattedCategories.push({
            id: s.id,
            name: s.name,
            parent_id: s.category_id,
            type: "Sub Category",
            parent: parentName,
            desc: s.description || "No description",
            status: s.is_active === false || s.is_active === 0 ? "Inactive" : "Active",
            date: s.created_at ? s.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            color: "from-purple-600 to-pink-600",
            image: s.image || null,
            isSubCategoryTable: true
          });
        });
      }

      setCategoriesList(formattedCategories);

      // If URL has ?id= query param on /edit-category or /edit-sub-category route, auto-populate form
      if (editIdParam) {
        const target = formattedCategories.find((cat: any) => cat.id.toString() === editIdParam && (
          pathname === "/edit-sub-category" ? cat.isSubCategoryTable : !cat.isSubCategoryTable
        ));
        if (target) {
          setEditingCategoryId(target.id);
          setCatName(target.name);
          setCatParent(target.parent_id ? target.parent_id.toString() : "");
          setCatDescription(target.desc !== "No description" ? target.desc : "");
          setCatStatus(target.status || "Active");
          setCatImage(target.image || "");
        }
      }
    } catch (e) {
      console.warn("Backend API offline for categories", e);
    }
  };

  useEffect(() => {
    if (editIdParam && categoriesList.length > 0) {
      const target = categoriesList.find((cat: any) => cat.id.toString() === editIdParam);
      if (target) {
        setEditingCategoryId(target.id);
        setCatName(target.name);
        setCatParent(target.parent_id ? target.parent_id.toString() : "");
        setCatDescription(target.desc !== "No description" ? target.desc : "");
        setCatStatus(target.status || "Active");
        setCatImage(target.image || "");
      }
    }
  }, [editIdParam, categoriesList]);

  // View Category Modal State
  const [viewCategoryModal, setViewCategoryModal] = useState<{
    isOpen: boolean;
    category: any | null;
  }>({
    isOpen: false,
    category: null,
  });

  const handleViewCategoryClick = (category: any) => {
    setViewCategoryModal({
      isOpen: true,
      category,
    });
  };

  // View Review Modal State
  const [viewReviewModal, setViewReviewModal] = useState<{
    isOpen: boolean;
    review: any | null;
  }>({
    isOpen: false,
    review: null,
  });

  const handleViewReviewClick = (review: any) => {
    setViewReviewModal({
      isOpen: true,
      review,
    });
  };

  const handleEditReviewClick = (review: any) => {
    setEditingReviewId(review.id);
    setReviewCustomerName(review.customer_name);
    setReviewProductId(review.product_id ? review.product_id.toString() : "");
    setReviewComment(review.comment);
    setReviewRating(review.rating || 5);
    setReviewStatus(review.status || "Pending");
    setReviewImage(review.image || "");
    router.push(`/edit-review?id=${review.id}`);
  };

  // Edit Category Trigger
  const handleEditCategoryClick = (category: any) => {
    setEditingCategoryId(category.id);
    setCatName(category.name);
    setCatParent(category.parent_id ? category.parent_id.toString() : "");
    setCatDescription(category.desc !== "No description" ? category.desc : "");
    setCatStatus(category.status || "Active");
    setCatImage(category.image || "");

    const isSub = category.parent_id || category.type === "Sub Category";
    if (isSub) {
      router.push(`/edit-sub-category?id=${category.id}`);
    } else {
      router.push(`/edit-category?id=${category.id}`);
    }
  };

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const triggerConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleDeleteCategory = (id: number, isSubCategoryTable?: boolean) => {
    triggerConfirmation(
      isSubCategoryTable ? "Delete Sub Category" : "Delete Category",
      isSubCategoryTable ? "Are you sure you want to delete this sub category? This action cannot be undone." : "Are you sure you want to delete this category? This action cannot be undone.",
      async () => {
        try {
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (admin?.token) headers["Authorization"] = `Bearer ${admin.token}`;
          const endpoint = isSubCategoryTable ? `http://127.0.0.1:8000/api/v1/sub-categories/${id}` : `http://127.0.0.1:8000/api/v1/categories/${id}`;
          const adminEndpoint = isSubCategoryTable ? `http://127.0.0.1:8000/api/v1/admin/sub-categories/${id}` : `http://127.0.0.1:8000/api/v1/admin/categories/${id}`;

          let res = await fetch(endpoint, {
            method: "DELETE",
            headers
          });
          if (!res.ok) {
            res = await fetch(adminEndpoint, {
              method: "DELETE",
              headers
            });
          }
          if (res.ok) {
            setCategoriesList(prev => prev.filter(c => !(c.id === id && c.isSubCategoryTable === isSubCategoryTable)));
            setSuccessMessage(isSubCategoryTable ? "Sub category deleted successfully!" : "Category deleted successfully!");
            setTimeout(() => setSuccessMessage(null), 8000);
          } else {
            const errData = await res.json().catch(() => ({}));
            setErrorMessage(errData.message || "Failed to delete.");
            setTimeout(() => setErrorMessage(null), 8000);
          }
        } catch (e) {
          console.warn("Failed to delete category on server API:", e);
          setErrorMessage("Network error: Failed to delete.");
          setTimeout(() => setErrorMessage(null), 8000);
        }
      }
    );
  };

  const handleDeleteClick = (id: number) => {
    triggerConfirmation(
      "Delete Product",
      "Are you sure you want to delete this product from inventory? This action cannot be undone.",
      () => {
        setProductsList(productsList.filter(p => p.id !== id));
        setSuccessMessage("Product deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 8000);
      }
    );
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      setErrorMessage("Category Name is required.");
      setTimeout(() => setErrorMessage(null), 8000);
      return;
    }

    const isSubCategoryMode = activeMenu === "Add Sub Category" || activeMenu === "Edit Sub Category" || pathname === "/add-sub-category" || pathname === "/edit-sub-category" || (catParent.trim().length > 0 && activeMenu !== "Add Category");
    
    if (isSubCategoryMode && !catParent.trim()) {
      setErrorMessage("Parent Main Category is required for Sub Category.");
      setTimeout(() => setErrorMessage(null), 8000);
      return;
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (admin?.token) headers["Authorization"] = `Bearer ${admin.token}`;

    if (isSubCategoryMode) {
      // SUB CATEGORY API Calls (Targeting sub_categories table)
      const subData = {
        category_id: parseInt(catParent),
        name: catName.trim(),
        description: catDescription.trim() || null,
        image: catImage || null,
        is_active: catStatus === "Active"
      };

      if (editingCategoryId) {
        try {
          let res = await fetch(`http://127.0.0.1:8000/api/v1/sub-categories/${editingCategoryId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(subData)
          });
          if (!res.ok) {
            res = await fetch(`http://127.0.0.1:8000/api/v1/admin/sub-categories/${editingCategoryId}`, {
              method: "PUT",
              headers,
              body: JSON.stringify(subData)
            });
          }
          if (res.ok) {
            await fetchCategories();
            setSuccessMessage("Sub category updated successfully!");
            setTimeout(() => {
              resetCategoryForm();
              handleMenuChange("Sub Category");
            }, 1500);
            setTimeout(() => setSuccessMessage(null), 8000);
          } else {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.message || (errData.errors ? Object.values(errData.errors).flat().join(" ") : "Failed to update sub category.");
            setErrorMessage(msg);
            setTimeout(() => setErrorMessage(null), 8000);
          }
        } catch (err) {
          setErrorMessage("Network error: Server is unreachable.");
          setTimeout(() => setErrorMessage(null), 8000);
        }
      } else {
        try {
          let res = await fetch("http://127.0.0.1:8000/api/v1/sub-categories", {
            method: "POST",
            headers,
            body: JSON.stringify(subData)
          });
          if (!res.ok) {
            res = await fetch("http://127.0.0.1:8000/api/v1/admin/sub-categories", {
              method: "POST",
              headers,
              body: JSON.stringify(subData)
            });
          }
          if (res.ok) {
            await fetchCategories();
            setSuccessMessage("New sub category created successfully!");
            setTimeout(() => {
              resetCategoryForm();
              handleMenuChange("Sub Category");
            }, 1500);
            setTimeout(() => setSuccessMessage(null), 8000);
          } else {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.message || (errData.errors ? Object.values(errData.errors).flat().join(" ") : "Failed to create sub category.");
            setErrorMessage(msg);
            setTimeout(() => setErrorMessage(null), 8000);
          }
        } catch (err) {
          setErrorMessage("Network error: Server is unreachable.");
          setTimeout(() => setErrorMessage(null), 8000);
        }
      }
    } else {
      // MAIN CATEGORY API Calls (Targeting categories table)
      const catData = {
        name: catName.trim(),
        description: catDescription.trim() || null,
        image: catImage || null,
        is_active: catStatus === "Active"
      };

      if (editingCategoryId) {
        try {
          let res = await fetch(`http://127.0.0.1:8000/api/v1/categories/${editingCategoryId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(catData)
          });
          if (!res.ok) {
            res = await fetch(`http://127.0.0.1:8000/api/v1/admin/categories/${editingCategoryId}`, {
              method: "PUT",
              headers,
              body: JSON.stringify(catData)
            });
          }
          if (res.ok) {
            await fetchCategories();
            setSuccessMessage("Category updated successfully!");
            setTimeout(() => {
              resetCategoryForm();
              handleMenuChange("Main Category");
            }, 1500);
            setTimeout(() => setSuccessMessage(null), 8000);
          } else {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.message || (errData.errors ? Object.values(errData.errors).flat().join(" ") : "Failed to update category.");
            setErrorMessage(msg);
            setTimeout(() => setErrorMessage(null), 8000);
          }
        } catch (err) {
          setErrorMessage("Network error: Server is unreachable.");
          setTimeout(() => setErrorMessage(null), 8000);
        }
      } else {
        try {
          let res = await fetch("http://127.0.0.1:8000/api/v1/categories", {
            method: "POST",
            headers,
            body: JSON.stringify(catData)
          });
          if (!res.ok) {
            res = await fetch("http://127.0.0.1:8000/api/v1/admin/categories", {
              method: "POST",
              headers,
              body: JSON.stringify(catData)
            });
          }
          if (res.ok) {
            await fetchCategories();
            setSuccessMessage("New category created successfully!");
            setTimeout(() => {
              resetCategoryForm();
              handleMenuChange("Main Category");
            }, 1500);
            setTimeout(() => setSuccessMessage(null), 8000);
          } else {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.message || (errData.errors ? Object.values(errData.errors).flat().join(" ") : "Failed to create category.");
            setErrorMessage(msg);
            setTimeout(() => setErrorMessage(null), 8000);
          }
        } catch (err) {
          setErrorMessage("Network error: Server is unreachable.");
          setTimeout(() => setErrorMessage(null), 8000);
        }
      }
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setErrorMessage("Review comment content is required.");
      setTimeout(() => setErrorMessage(null), 8000);
      return;
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (admin?.token) headers["Authorization"] = `Bearer ${admin.token}`;

    const reviewData = {
      customer_name: reviewCustomerName.trim() || "Admin",
      product_id: reviewProductId ? parseInt(reviewProductId) : null,
      comment: reviewComment.trim(),
      rating: parseInt(reviewRating.toString()) || 5,
      status: reviewStatus,
      image: reviewImage || null
    };

    if (editingReviewId) {
      try {
        let res = await fetch(`http://127.0.0.1:8000/api/v1/reviews/${editingReviewId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(reviewData)
        });
        if (!res.ok) {
          res = await fetch(`http://127.0.0.1:8000/api/v1/admin/reviews/${editingReviewId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(reviewData)
          });
        }
        if (res.ok) {
          await fetchReviews();
          setSuccessMessage("Review updated successfully!");
          setTimeout(() => {
            resetReviewForm();
            handleMenuChange("Reviews");
          }, 1500);
          setTimeout(() => setSuccessMessage(null), 8000);
        } else {
          const errData = await res.json().catch(() => ({}));
          setErrorMessage(errData.message || "Failed to update review.");
          setTimeout(() => setErrorMessage(null), 8000);
        }
      } catch (err) {
        setErrorMessage("Network error: Server is unreachable.");
        setTimeout(() => setErrorMessage(null), 8000);
      }
    } else {
      try {
        let res = await fetch("http://127.0.0.1:8000/api/v1/reviews", {
          method: "POST",
          headers,
          body: JSON.stringify(reviewData)
        });
        if (!res.ok) {
          res = await fetch("http://127.0.0.1:8000/api/v1/admin/reviews", {
            method: "POST",
            headers,
            body: JSON.stringify(reviewData)
          });
        }
        if (res.ok) {
          await fetchReviews();
          setSuccessMessage("New review created successfully!");
          setTimeout(() => {
            resetReviewForm();
            handleMenuChange("Reviews");
          }, 1500);
          setTimeout(() => setSuccessMessage(null), 8000);
        } else {
          const errData = await res.json().catch(() => ({}));
          setErrorMessage(errData.message || "Failed to create review.");
          setTimeout(() => setErrorMessage(null), 8000);
        }
      } catch (err) {
        setErrorMessage("Network error: Server is unreachable.");
        setTimeout(() => setErrorMessage(null), 8000);
      }
    }
  };

  const handleDeleteReview = (id: number) => {
    triggerConfirmation(
      "Delete Review",
      "Are you sure you want to delete this customer review log? This action cannot be undone.",
      async () => {
        try {
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (admin?.token) headers["Authorization"] = `Bearer ${admin.token}`;
          let res = await fetch(`http://127.0.0.1:8000/api/v1/reviews/${id}`, {
            method: "DELETE",
            headers
          });
          if (!res.ok) {
            res = await fetch(`http://127.0.0.1:8000/api/v1/admin/reviews/${id}`, {
              method: "DELETE",
              headers
            });
          }
          if (res.ok) {
            setReviewsList(prev => prev.filter(r => r.id !== id));
            setSuccessMessage("Review deleted successfully!");
            setTimeout(() => setSuccessMessage(null), 8000);
          } else {
            const errData = await res.json().catch(() => ({}));
            setErrorMessage(errData.message || "Failed to delete review.");
            setTimeout(() => setErrorMessage(null), 8000);
          }
        } catch (e) {
          setErrorMessage("Network error: Failed to delete review.");
          setTimeout(() => setErrorMessage(null), 8000);
        }
      }
    );
  };

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setEditingProductId(null);
    setFormName("");
    setFormPrice("");
    setFormOriginalPrice("");
    setFormStock("");
    setFormImage("");
    setFormCategory("Health & Organic");
    setFormDescription("");
  };

  const handleEditClick = (product: any) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormOriginalPrice(product.original_price ? product.original_price.toString() : "");
    setFormStock(product.stock.toString());
    setFormImage(product.main_image || "");
    setFormCategory(product.category || "Health & Organic");
    setFormDescription(product.description || "");
    setActiveMenu("Add Product");
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    if (editingProductId) {
      // Update existing
      setProductsList(productsList.map(p => p.id === editingProductId ? {
        ...p,
        name: formName,
        price: parseFloat(formPrice),
        original_price: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
        stock: parseInt(formStock) || 0,
        main_image: formImage || "/prod_maca.png",
        category: formCategory,
        description: formDescription
      } : p));
      setSuccessMessage("Product updated successfully!");
    } else {
      // Add new
      const newProd = {
        id: Date.now(),
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        price: parseFloat(formPrice),
        original_price: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
        stock: parseInt(formStock) || 0,
        main_image: formImage || "/prod_maca.png",
        category: formCategory,
        description: formDescription
      };
      setProductsList([newProd, ...productsList]);
      setSuccessMessage("New product created successfully!");
    }

    setTimeout(() => setSuccessMessage(null), 3000);
    resetForm();
    setActiveMenu("All Products");
  };

  // Theme & Navigation States
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");

  useEffect(() => {
    setIsMounted(true);
    fetchCategories();
    const savedTheme = localStorage.getItem("shopia_admin_theme") as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !admin) {
      router.replace("/");
    }
  }, [admin, isLoading, router]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("shopia_admin_theme", nextTheme);
  };

  if (!isMounted || isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-bold text-sm ${theme === "dark" ? "bg-[#060911] text-blue-400" : "bg-slate-50 text-[#0b3b82]"}`}>
        Checking Admin Access Credentials...
      </div>
    );
  }

  if (!admin) return null;

  // Datasets for Daily, Weekly, and Monthly Timeframes
  const dailyData = [
    { label: "06:00", revenue: 1200, sales: 8 },
    { label: "09:00", revenue: 3400, sales: 18 },
    { label: "12:00", revenue: 8900, sales: 42 },
    { label: "15:00", revenue: 12500, sales: 65 },
    { label: "18:00", revenue: 15800, sales: 88 },
    { label: "21:00", revenue: 21000, sales: 110 },
    { label: "23:59", revenue: 24500, sales: 135 },
  ];

  const weeklyData = [
    { label: "Mon", revenue: 8500, sales: 45 },
    { label: "Tue", revenue: 12400, sales: 68 },
    { label: "Wed", revenue: 10200, sales: 52 },
    { label: "Thu", revenue: 16800, sales: 94 },
    { label: "Fri", revenue: 24500, sales: 140 },
    { label: "Sat", revenue: 31000, sales: 185 },
    { label: "Sun", revenue: 28900, sales: 160 },
  ];

  const monthlyData = [
    { label: "Jan", revenue: 12000, sales: 120 },
    { label: "Feb", revenue: 19000, sales: 180 },
    { label: "Mar", revenue: 15000, sales: 140 },
    { label: "Apr", revenue: 28000, sales: 270 },
    { label: "May", revenue: 35000, sales: 320 },
    { label: "Jun", revenue: 42000, sales: 410 },
    { label: "Jul", revenue: 63900, sales: 580 },
  ];

  const activeChartData = timeframe === "daily" ? dailyData : timeframe === "weekly" ? weeklyData : monthlyData;

  const recentOrders = [
    { id: "#2", customer: "Abir Ahmed", amount: "৳950", status: "Packed", date: "2026-07-30 06:35" },
    { id: "#1", customer: "Md Mostafizur Rahman", amount: "৳1,450", status: "Processing", date: "2026-07-30 05:20" }
  ];

  const topSellingProducts = [
    { name: "Organic Black Maca Powder (300 gm)", sales: "3 Sales", revenue: "৳4,350.00", image: "/prod_maca.png" },
    { name: "Mustard Oil (সরিষার তেল)", sales: "2 Sales", revenue: "৳600.00", image: "/prod_blackseed.png" }
  ];

  const isDark = theme === "dark";

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-200 ${
      isDark ? "bg-[#060911] text-slate-200" : "bg-slate-100 text-slate-800"
    }`}>
      
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in"
        />
      )}

      {/* 1. LEFT SIDEBAR MENU (Responsive Drawer on Mobile) */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50 w-64 flex flex-col justify-between shrink-0 select-none transition-all duration-300
        ${isDark ? "bg-[#090d18] border-r border-slate-800/80" : "bg-white border-r border-slate-200 shadow-xl lg:shadow-none"}
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Sidebar Header Logo */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? "border-slate-800/80" : "border-slate-100"}`}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0b3b82] text-white flex items-center justify-center font-black text-lg shadow-sm">
              S
            </div>
            <span className={`text-lg font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Shopia Admin <span className="text-blue-500 text-xs font-semibold block -mt-1">Panel</span>
            </span>
          </Link>

          {/* Close Sidebar button on mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className={`p-1.5 rounded-lg lg:hidden ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 text-xs">
          
          {/* Main Group */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => { handleMenuChange("Dashboard"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition ${
                activeMenu === "Dashboard" 
                  ? "bg-[#0b3b82] text-white shadow-md" 
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
          </div>

          {/* Product Section */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Product</span>
            <button
              type="button"
              onClick={() => { handleMenuChange("All Products"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "All Products" 
                  ? "bg-[#0b3b82] text-white font-bold" 
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4" /> All Products
            </button>
            <button
              type="button"
              onClick={() => { handleMenuChange("Add Product"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Add Product" 
                  ? "bg-[#0b3b82] text-white font-bold" 
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Add Product
            </button>
          </div>

          {/* Category Section */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Category</span>
            <button
              type="button"
              onClick={() => { handleMenuChange("Main Category"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Main Category"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <FolderTree className="w-4 h-4" /> Main Category
            </button>
            <button
              type="button"
              onClick={() => { handleMenuChange("Add Category"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Add Category"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Add Category
            </button>
            <button
              type="button"
              onClick={() => { handleMenuChange("Sub Category"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Sub Category"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Tag className="w-4 h-4" /> Sub Category
            </button>
            <button
              type="button"
              onClick={() => { handleMenuChange("Add Sub Category"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Add Sub Category"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Add Sub Category
            </button>
          </div>

          {/* Orders Section */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Orders</span>
            <button
              type="button"
              onClick={() => { handleMenuChange("Order List"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Order List"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Order List
            </button>
            <button
              type="button"
              onClick={() => { handleMenuChange("Payment Status"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Payment Status"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Receipt className="w-4 h-4" /> Payment Status
            </button>
          </div>

          {/* Customers & Engagement */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Users &amp; Engagement</span>
            <button
              type="button"
              onClick={() => { handleMenuChange("Customers"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Customers"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Users className="w-4 h-4" /> Customers
            </button>
          {/* Reviews Section */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Reviews</span>
            <button
              type="button"
              onClick={() => { handleMenuChange("Reviews"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Reviews" || activeMenu === "Reviews List"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Star className="w-4 h-4" /> Reviews List
            </button>
            <button
              type="button"
              onClick={() => { resetReviewForm(); handleMenuChange("Add Review"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Add Review"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Add Review
            </button>
          </div>
          </div>

          {/* System Settings */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Settings</span>
            <button
              type="button"
              onClick={() => { handleMenuChange("Settings"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Settings"
                  ? "bg-[#0b3b82] text-white font-bold"
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Settings className="w-4 h-4" /> General Settings
            </button>
          </div>

        </div>

        {/* Sidebar Footer User Info */}
        <div className={`p-3 border-t flex items-center justify-between ${
          isDark ? "border-slate-800/80 bg-[#060911]" : "border-slate-100 bg-slate-50"
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0b3b82] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>{admin.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{admin.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className={`p-1.5 rounded-lg transition ${
              isDark ? "text-slate-400 hover:text-rose-400 hover:bg-slate-800/80" : "text-slate-500 hover:text-rose-600 hover:bg-slate-200"
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Navigation Bar */}
        <header className={`h-16 border-b px-4 lg:px-6 flex items-center justify-between gap-4 shrink-0 transition-colors ${
          isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200"
        }`}>
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 rounded-xl border lg:hidden ${
                isDark ? "border-slate-800 text-slate-300 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input Bar */}
            <div className="relative w-44 sm:w-64 md:w-80">
              <input
                type="text"
                placeholder="Search anything..."
                className={`w-full border rounded-full pl-9 pr-4 py-1.5 sm:py-2 text-xs transition focus:outline-none ${
                  isDark 
                    ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82] placeholder:text-slate-500" 
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82] placeholder:text-slate-400"
                }`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 ${
                isDark 
                  ? "border-slate-800 text-amber-400 hover:bg-slate-800/60" 
                  : "border-slate-200 text-[#0b3b82] bg-slate-50 hover:bg-slate-100"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden md:inline">{isDark ? "Light" : "Dark"}</span>
            </button>

            {/* View Live Storefront Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="bg-[#0b3b82]/10 hover:bg-[#0b3b82]/20 border border-[#0b3b82]/30 text-[#0b3b82] dark:text-blue-300 px-3 py-1.5 rounded-full transition flex items-center gap-1.5 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden sm:inline">View Storefront</span>
            </a>

            <button type="button" className={`relative p-2 rounded-xl border ${
              isDark ? "border-slate-800 text-slate-400 hover:text-white" : "border-slate-200 text-slate-500 hover:text-slate-900"
            }`}>
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#0b3b82] absolute top-1.5 right-1.5" />
            </button>

            <div className={`hidden sm:flex items-center gap-2 border-l pl-3 sm:pl-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <div className="w-7 h-7 rounded-full bg-[#0b3b82] text-white font-black text-xs flex items-center justify-center">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <span className={isDark ? "text-white" : "text-slate-900"}>{admin.name}</span>
            </div>

          </div>

        </header>

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Fixed Top-Right Toast Notifications */}
          {successMessage && (
            <div className="fixed top-20 right-6 z-50 bg-[#090d18] border border-emerald-500/50 text-emerald-400 px-5 py-3.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-white font-extrabold">Success Notification</p>
                <p className="text-emerald-400 font-semibold">{successMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="ml-2 text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="fixed top-20 right-6 z-50 bg-[#090d18] border border-rose-500/50 text-rose-400 px-5 py-3.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-white font-extrabold">Action Failed</p>
                <p className="text-rose-400 font-semibold">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="ml-2 text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* VIEW 1: DASHBOARD ANALYTICS OVERVIEW */}
          {activeMenu === "Dashboard" && (
            <div className="space-y-6">
              {/* Dashboard Title Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}>
                    E-commerce Dashboard
                  </h1>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Welcome back <span className="text-[#0b3b82] font-bold dark:text-blue-400">{admin.name}</span>! Here is a live summary of your store&apos;s performance.
                  </p>
                </div>

                <div className={`border rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 ${
                  isDark 
                    ? "bg-[#090d18] border-slate-800 text-emerald-400" 
                    : "bg-white border-slate-200 text-emerald-600 shadow-sm"
                }`}>
                  <Activity className="w-4 h-4 text-emerald-500" /> Live Tracking Active
                </div>
              </div>

              {/* 4 Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1: Total Revenue */}
                <div className={`border rounded-2xl p-5 space-y-2 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>TOTAL REVENUE</span>
                    <span className="p-1.5 rounded-lg bg-[#0b3b82]/10 text-[#0b3b82]">
                      <DollarSign className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>৳63,900</h3>
                  <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +15.8% vs last month
                  </p>
                </div>

                {/* Stat 2: Total Sales */}
                <div className={`border rounded-2xl p-5 space-y-2 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>TOTAL SALES</span>
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>580</h3>
                  <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +8.4% vs last week
                  </p>
                </div>

                {/* Stat 3: Total Customers */}
                <div className={`border rounded-2xl p-5 space-y-2 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>CUSTOMERS</span>
                    <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>240</h3>
                  <p className="text-[11px] text-blue-500 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +12 new today
                  </p>
                </div>

                {/* Stat 4: Active Products */}
                <div className={`border rounded-2xl p-5 space-y-2 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>ACTIVE PRODUCTS</span>
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <Package className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{productsList.length}</h3>
                  <p className="text-[11px] text-amber-500 font-semibold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> In stock & live
                  </p>
                </div>

              </div>

              {/* 3-COLUMN ANALYTICS DASHBOARD (Revenue Overview, Sales Analysis, Orders Trend) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Revenue & Sales Overview (Area Chart) */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Revenue Overview
                      </h2>
                      <p className="text-[11px] text-slate-400">Gross revenue performance</p>
                    </div>
                    <span className="p-1.5 rounded-lg bg-[#0b3b82]/10 text-[#0b3b82] dark:text-blue-400 font-bold text-xs">
                      ৳ Revenue
                    </span>
                  </div>

                  <div className="h-56 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeChartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0b3b82" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#0b3b82" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? "#0d1322" : "#ffffff", 
                            borderColor: isDark ? "#1e293b" : "#e2e8f0",
                            borderRadius: "12px",
                            fontSize: "11px",
                            color: isDark ? "#ffffff" : "#0f172a"
                          }} 
                          formatter={(val: any) => [`৳${Number(val).toLocaleString()}`, "Revenue"]}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#0b3b82" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Column 2: Sales Analysis (Bar Chart) */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Sales Analysis
                      </h2>
                      <p className="text-[11px] text-slate-400">Total units sold breakdown</p>
                    </div>
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                      Sales Count
                    </span>
                  </div>

                  <div className="h-56 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeChartData}>
                        <XAxis dataKey="label" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? "#0d1322" : "#ffffff", 
                            borderColor: isDark ? "#1e293b" : "#e2e8f0",
                            borderRadius: "12px",
                            fontSize: "11px",
                            color: isDark ? "#ffffff" : "#0f172a"
                          }} 
                          formatter={(val: any) => [val, "Completed Sales"]}
                        />
                        <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Column 3: Orders Trend (Line Chart) */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Orders Trend
                      </h2>
                      <p className="text-[11px] text-slate-400">Order trajectory &amp; momentum</p>
                    </div>
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 font-bold text-xs">
                      Trend Line
                    </span>
                  </div>

                  <div className="h-56 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activeChartData}>
                        <XAxis dataKey="label" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? "#0d1322" : "#ffffff", 
                            borderColor: isDark ? "#1e293b" : "#e2e8f0",
                            borderRadius: "12px",
                            fontSize: "11px",
                            color: isDark ? "#ffffff" : "#0f172a"
                          }} 
                          formatter={(val: any) => [val, "Orders Placed"]}
                        />
                        <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Bottom Grid: Recent Orders & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Table 1: Recent Orders */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Recent Orders</h2>
                    <button type="button" className="text-xs text-[#0b3b82] dark:text-blue-400 font-bold hover:underline">
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                          <th className="pb-3 font-semibold">Order ID</th>
                          <th className="pb-3 font-semibold">Customer</th>
                          <th className="pb-3 font-semibold">Amount</th>
                          <th className="pb-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? "divide-slate-800/60" : "divide-slate-100"}`}>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className={isDark ? "hover:bg-slate-800/30" : "hover:bg-slate-50"}>
                            <td className="py-3 font-mono font-bold text-[#0b3b82] dark:text-blue-400">{order.id}</td>
                            <td className={`py-3 font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>{order.customer}</td>
                            <td className={`py-3 font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{order.amount}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-1 bg-[#0b3b82]/10 border border-[#0b3b82]/30 text-[#0b3b82] dark:text-blue-300 font-semibold rounded-full text-[10px]">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: Top Selling Products */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Top Selling Products</h2>
                    <button type="button" className="text-xs text-[#0b3b82] dark:text-blue-400 font-bold hover:underline">
                      View Catalog
                    </button>
                  </div>

                  <div className="space-y-3">
                    {topSellingProducts.map((prod, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between p-3 rounded-xl border transition ${
                          isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0 overflow-hidden relative">
                            <Image 
                              src={prod.image} 
                              alt={prod.name} 
                              width={40} 
                              height={40} 
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="truncate">
                            <p className={`text-xs font-bold truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}>{prod.name}</p>
                            <p className="text-[10px] text-slate-400">{prod.sales}</p>
                          </div>
                        </div>

                        <span className={`text-xs font-bold shrink-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                          {prod.revenue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 2: ALL PRODUCTS LIST */}
          {activeMenu === "All Products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}>
                    All Products Catalog
                  </h1>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Manage, edit, and organize all active inventory items in your store
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => { resetForm(); setActiveMenu("Add Product"); }}
                  className="bg-[#0b3b82] hover:bg-[#0b3b82]/90 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add New Product
                </button>
              </div>

              {/* Products Data Table */}
              <div className={`border rounded-2xl overflow-hidden transition-colors ${
                isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400 bg-[#080c14]" : "border-slate-200 text-slate-500 bg-slate-50"}`}>
                        <th className="py-3.5 px-4 font-bold">Product</th>
                        <th className="py-3.5 px-4 font-bold">Category</th>
                        <th className="py-3.5 px-4 font-bold">Price</th>
                        <th className="py-3.5 px-4 font-bold">Stock</th>
                        <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-slate-800/60" : "divide-slate-100"}`}>
                      {productsList.map((prod) => (
                        <tr key={prod.id} className={isDark ? "hover:bg-slate-800/30 transition" : "hover:bg-slate-50 transition"}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0 overflow-hidden relative border border-slate-700">
                                <Image 
                                  src={prod.main_image || "/prod_maca.png"} 
                                  alt={prod.name} 
                                  width={40} 
                                  height={40} 
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{prod.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{prod.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 font-semibold rounded-md text-[10px]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-black ${isDark ? "text-white" : "text-slate-900"}`}>৳{prod.price}</span>
                              {prod.original_price && (
                                <span className="text-[10px] text-slate-400 line-through">৳{prod.original_price}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 font-bold rounded-full text-[10px] ${
                              prod.stock > 10 
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30" 
                                : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                            }`}>
                              {prod.stock} In Stock
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditClick(prod)}
                                className={`p-2 rounded-lg transition border ${
                                  isDark ? "border-slate-800 text-blue-400 hover:bg-blue-500/10" : "border-slate-200 text-[#0b3b82] hover:bg-slate-100"
                                }`}
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(prod.id)}
                                className="p-2 rounded-lg transition border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MAIN CATEGORY LIST & SUB CATEGORY LIST MATCHING DESIGN */}
          {(activeMenu === "Main Category" || activeMenu === "Sub Category") && (
            <div className="space-y-6">
              {/* Header Title & Add Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0b3b82]/10 text-[#0b3b82] dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center font-bold">
                      {activeMenu === "Sub Category" ? <Tag className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                    </div>
                    <div>
                      <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        {activeMenu === "Sub Category" ? "Sub Category Management" : "Category Management"}
                      </h1>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {activeMenu === "Sub Category" ? "Organize child inventory classifications linked to parent main categories" : "Real-time inventory classification synced with MySQL database"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleMenuChange(activeMenu === "Sub Category" ? "Add Sub Category" : "Add Category")}
                  className="w-full sm:w-auto bg-[#0B3B82] hover:bg-[#0B3B82]/90 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> {activeMenu === "Sub Category" ? "Add New Sub Category" : "Add New Category"}
                </button>
              </div>

              {/* Quick Metrics KPI Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className={`p-4 rounded-2xl border transition-all ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {activeMenu === "Sub Category" ? "Total Sub Categories" : "Total Categories"}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {activeMenu === "Sub Category" ? categoriesList.filter(c => c.isSubCategoryTable).length : categoriesList.length}
                    </span>
                    <FolderTree className="w-4 h-4 text-blue-500" />
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Sub Categories</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-extrabold text-emerald-400">
                      {categoriesList.filter(c => (activeMenu === "Sub Category" ? c.isSubCategoryTable : true) && c.status === "Active").length}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Inactive</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-extrabold text-rose-400">
                      {categoriesList.filter(c => (activeMenu === "Sub Category" ? c.isSubCategoryTable : true) && c.status === "Inactive").length}
                    </span>
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {activeMenu === "Sub Category" ? "Linked Parent Categories" : "Main Categories"}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-extrabold text-purple-400">
                      {activeMenu === "Sub Category" 
                        ? new Set(categoriesList.filter(c => c.isSubCategoryTable && c.parent_id).map(c => c.parent_id)).size 
                        : categoriesList.filter(c => c.type === "Main Category").length}
                    </span>
                    <Layers className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Main Card Container */}
              <div className={`border rounded-2xl p-4 sm:p-6 space-y-6 transition-colors ${
                isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
              }`}>

                {/* Filter & Search Controls (Stacked on Mobile, Inline on Desktop) */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search categories by name, ID or description..."
                      value={searchCategoryQuery}
                      onChange={(e) => setSearchCategoryQuery(e.target.value)}
                      className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-xs transition focus:outline-none ${
                        isDark
                          ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82] placeholder:text-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82] placeholder:text-slate-400"
                      }`}
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                    <span className={`text-[11px] uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Filter Status:</span>
                    <select
                      value={statusCategoryFilter}
                      onChange={(e) => setStatusCategoryFilter(e.target.value)}
                      className={`border rounded-xl px-3 py-2 focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Categories Content: Responsive Card Grid (Mobile & Tablet) + Desktop Table */}
                {(() => {
                  const filteredList = categoriesList.filter((cat) => {
                    const matchesSearch = cat.name.toLowerCase().includes(searchCategoryQuery.toLowerCase()) ||
                      cat.desc.toLowerCase().includes(searchCategoryQuery.toLowerCase()) ||
                      cat.id.toString().includes(searchCategoryQuery);
                    const matchesStatus = statusCategoryFilter === "All" || cat.status === statusCategoryFilter;
                    const matchesMenuType = activeMenu === "Sub Category" 
                      ? cat.type === "Sub Category" || (cat.parent && cat.parent !== "—")
                      : activeMenu === "Main Category"
                        ? cat.type === "Main Category" && (!cat.parent || cat.parent === "—")
                        : true;
                    return matchesSearch && matchesStatus && matchesMenuType;
                  });

                  if (filteredList.length === 0) {
                    return (
                      <div className="py-16 text-center text-slate-400 space-y-2 border border-dashed rounded-2xl border-slate-800">
                        <Layers className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
                        <p className="font-bold text-sm">No categories found matching criteria</p>
                        <p className="text-xs text-slate-500">Try adjusting your search query or create a new category.</p>
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* Mobile & Tablet Card Layout (< lg breakpoint) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                        {filteredList.map((cat) => (
                          <div 
                            key={cat.id} 
                            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
                              isDark ? "bg-[#060911] border-slate-800" : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {cat.image ? (
                                  <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-slate-700/60 shrink-0">
                                    <img src={cat.image} alt={cat.name} className="object-cover w-full h-full" />
                                  </div>
                                ) : (
                                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color || "from-blue-600 to-indigo-600"} flex items-center justify-center text-white font-black text-lg shadow-md shrink-0`}>
                                    {cat.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{cat.name}</h3>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-mono text-slate-400">ID: #{cat.id}</span>
                                    {cat.parent && cat.parent !== "—" && (
                                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                                        Parent: {cat.parent}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                cat.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}>
                                {cat.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 line-clamp-2 italic">
                              {cat.desc || "No description provided."}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
                              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{cat.date}</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleViewCategoryClick(cat)}
                                  className={`p-2 rounded-lg transition border ${
                                    isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-200"
                                  }`}
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditCategoryClick(cat)}
                                  className="p-2 rounded-lg transition border border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                  title="Edit Category"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(cat.id, cat.isSubCategoryTable)}
                                  className="p-2 rounded-lg transition border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                                  title="Delete Category"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Full Data Table (lg+ breakpoint) */}
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                              <th className="py-3.5 px-4 font-bold">ID</th>
                              <th className="py-3.5 px-4 font-bold">Category Name</th>
                              <th className="py-3.5 px-4 font-bold">Type</th>
                              <th className="py-3.5 px-4 font-bold">Parent Category</th>
                              <th className="py-3.5 px-4 font-bold">Description</th>
                              <th className="py-3.5 px-4 font-bold">Status</th>
                              <th className="py-3.5 px-4 font-bold">Created Date</th>
                              <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDark ? "divide-slate-800/60 text-slate-300" : "divide-slate-100 text-slate-700"}`}>
                            {filteredList.map((cat) => (
                              <tr key={cat.id} className={isDark ? "hover:bg-slate-800/30 transition" : "hover:bg-slate-50 transition"}>
                                <td className="py-4 px-4 font-mono font-medium text-slate-400">#{cat.id}</td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    {cat.image ? (
                                      <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-slate-700 shrink-0">
                                        <img
                                          src={cat.image}
                                          alt={cat.name}
                                          className="object-cover w-full h-full"
                                        />
                                      </div>
                                    ) : (
                                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color || "from-blue-600 to-indigo-600"} flex items-center justify-center text-white font-black text-sm shadow-md shrink-0`}>
                                        {cat.name.charAt(0)}
                                      </div>
                                    )}
                                    <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{cat.name}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-purple-400 font-bold text-[11px] bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">{cat.type}</span>
                                </td>
                                <td className="py-4 px-4 font-semibold text-[#0b3b82] dark:text-blue-300">
                                  {cat.parent && cat.parent !== "—" ? (
                                    <span className="bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 font-bold text-[11px]">
                                      {cat.parent}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-normal">—</span>
                                  )}
                                </td>
                                <td className="py-4 px-4 italic text-slate-400 max-w-xs truncate">{cat.desc}</td>
                                <td className="py-4 px-4">
                                  <span className={`font-bold text-[11px] px-2.5 py-1 rounded-full border ${
                                    cat.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  }`}>{cat.status}</span>
                                </td>
                                <td className="py-4 px-4 text-slate-400">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{cat.date}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      type="button" 
                                      onClick={() => handleViewCategoryClick(cat)}
                                      className={`p-2 rounded-xl transition border ${
                                        isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                                      }`}
                                      title="View Category Details"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      type="button" 
                                      onClick={() => handleEditCategoryClick(cat)}
                                      className="p-2 rounded-xl transition border border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                      title="Edit Category"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      type="button" 
                                      onClick={() => handleDeleteCategory(cat.id, cat.isSubCategoryTable)}
                                      className="p-2 rounded-xl transition border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                                      title="Delete Category"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  );
                })()}

              </div>
            </div>
          )}

          {/* VIEW: REVIEWS LIST (Matching User Reference Image Design) */}
          {(activeMenu === "Reviews" || activeMenu === "Reviews List") && (
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <span className="hover:underline cursor-pointer" onClick={() => handleMenuChange("Dashboard")}>Dashboard</span>
                <span>&gt;</span>
                <span className={isDark ? "text-slate-200" : "text-slate-700"}>Reviews</span>
              </div>

              {/* Title & Add Review Header Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        Reviews Management
                      </h1>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Moderate and manage customer testimonials and product feedback
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { resetReviewForm(); handleMenuChange("Add Review"); }}
                  className="bg-[#0B3B82] hover:bg-[#0B3B82]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add Review
                </button>
              </div>

              {/* 4 Stat KPI Cards matching exact screenshot specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Reviews */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isDark ? "bg-[#080d1a] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">TOTAL REVIEWS</span>
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>{reviewsList.length}</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Average Rating */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isDark ? "bg-[#080d1a] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">AVERAGE RATING</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {reviewsList.length > 0 ? (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsList.length).toFixed(1) : 0}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">/ 5.0 ★</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Pending Approval */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isDark ? "bg-[#080d1a] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">PENDING APPROVAL</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-amber-500">
                      {reviewsList.filter(r => r.status === "Pending").length}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Approved Reviews */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isDark ? "bg-[#080d1a] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">APPROVED REVIEWS</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-emerald-400">
                      {reviewsList.filter(r => r.status === "Approved").length}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Controls Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by reviewer, product, or keywords..."
                    value={searchReviewQuery}
                    onChange={(e) => setSearchReviewQuery(e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-xs transition focus:outline-none ${
                      isDark
                        ? "bg-[#080d1a] border-slate-800 text-slate-200 focus:border-emerald-500 placeholder:text-slate-500"
                        : "bg-white border-slate-200 text-slate-800 focus:border-emerald-500 placeholder:text-slate-400"
                    }`}
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={statusReviewFilter}
                  onChange={(e) => setStatusReviewFilter(e.target.value)}
                  className={`border rounded-xl px-3 py-2.5 text-xs focus:outline-none transition ${
                    isDark ? "bg-[#080d1a] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="All">All Moderation Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={ratingReviewFilter}
                  onChange={(e) => setRatingReviewFilter(e.target.value)}
                  className={`border rounded-xl px-3 py-2.5 text-xs focus:outline-none transition ${
                    isDark ? "bg-[#080d1a] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="All">All Star Ratings</option>
                  <option value="5">5 Stars ★★★★★</option>
                  <option value="4">4 Stars ★★★★☆</option>
                  <option value="3">3 Stars ★★★☆☆</option>
                  <option value="2">2 Stars ★★☆☆☆</option>
                  <option value="1">1 Star ★☆☆☆☆</option>
                </select>
              </div>

              {/* Main Table / Empty State Box */}
              <div className={`border rounded-2xl p-8 transition-colors ${
                isDark ? "bg-[#080d1a] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
              }`}>
                {(() => {
                  const filteredReviews = reviewsList.filter((rev) => {
                    const matchesSearch = (rev.customer_name || "").toLowerCase().includes(searchReviewQuery.toLowerCase()) ||
                      (rev.comment || "").toLowerCase().includes(searchReviewQuery.toLowerCase()) ||
                      (rev.product?.name || "").toLowerCase().includes(searchReviewQuery.toLowerCase());
                    const matchesStatus = statusReviewFilter === "All" || rev.status === statusReviewFilter;
                    const matchesRating = ratingReviewFilter === "All" || (rev.rating && rev.rating.toString() === ratingReviewFilter);
                    return matchesSearch && matchesStatus && matchesRating;
                  });

                  if (filteredReviews.length === 0) {
                    return (
                      <div className="py-12 text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                          <ShoppingBag className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>No Reviews Found</h3>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                            Create customer product review logs manually or wait for store orders.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { resetReviewForm(); handleMenuChange("Add Review"); }}
                          className="bg-[#0B3B82] hover:bg-[#0B3B82]/90 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
                        >
                          Add First Review
                        </button>
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* Mobile & Tablet Responsive Card Layout (< lg breakpoint) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                        {filteredReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition ${
                              isDark ? "bg-[#060911] border-slate-800" : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{rev.customer_name}</h3>
                                <p className="text-[11px] font-semibold text-blue-400 mt-0.5">
                                  {rev.product ? rev.product.name : "General Store Review"}
                                </p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                rev.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                rev.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}>
                                {rev.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                              {"★".repeat(rev.rating || 5)}
                              <span className="text-[11px] text-slate-400 ml-1 font-normal">({rev.rating || 5}.0)</span>
                            </div>

                            <p className="text-xs text-slate-400 line-clamp-3 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                              "{rev.comment}"
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                              <span className="text-[10px] text-slate-400 font-mono">ID: #{rev.id}</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleViewReviewClick(rev)}
                                  className={`p-2 rounded-lg transition border ${
                                    isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-200"
                                  }`}
                                  title="View Review Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditReviewClick(rev)}
                                  className="p-2 rounded-lg transition border border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                  title="Edit Review"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className="p-2 rounded-lg transition border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                                  title="Delete Review"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Full Data Table (lg+ breakpoint) */}
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                              <th className="py-3 px-4 font-bold">Reviewer</th>
                              <th className="py-3 px-4 font-bold">Product</th>
                              <th className="py-3 px-4 font-bold">Rating</th>
                              <th className="py-3 px-4 font-bold">Comment</th>
                              <th className="py-3 px-4 font-bold">Status</th>
                              <th className="py-3 px-4 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDark ? "divide-slate-800/60 text-slate-300" : "divide-slate-100 text-slate-700"}`}>
                            {filteredReviews.map((rev) => (
                              <tr key={rev.id} className={isDark ? "hover:bg-slate-800/30 transition" : "hover:bg-slate-50 transition"}>
                                <td className="py-4 px-4 font-bold text-white">
                                  {rev.customer_name}
                                </td>
                                <td className="py-4 px-4">
                                  {rev.product ? rev.product.name : "General Store Review"}
                                </td>
                                <td className="py-4 px-4 font-bold text-amber-400">
                                  {"★".repeat(rev.rating || 5)}
                                </td>
                                <td className="py-4 px-4 italic max-w-xs truncate text-slate-400">
                                  "{rev.comment}"
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`font-bold text-[10px] px-2.5 py-1 rounded-full border ${
                                    rev.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                    rev.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                    "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  }`}>
                                    {rev.status}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleViewReviewClick(rev)}
                                      className={`p-2 rounded-xl transition border ${
                                        isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                                      }`}
                                      title="View Review Details"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditReviewClick(rev)}
                                      className="p-2 rounded-xl transition border border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                      title="Edit Review"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteReview(rev.id)}
                                      className="p-2 rounded-xl transition border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                                      title="Delete Review"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* VIEW: ADD & EDIT REVIEW (Matching User Second Screenshot Design) */}
          {(activeMenu === "Add Review" || activeMenu === "Edit Review" || pathname === "/add-review" || pathname === "/edit-review") && (
            <div className="space-y-6">
              {/* Breadcrumb & Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mb-1">
                    <span className="hover:underline cursor-pointer" onClick={() => handleMenuChange("Dashboard")}>Dashboard</span>
                    <span>&gt;</span>
                    <span className="hover:underline cursor-pointer" onClick={() => handleMenuChange("Reviews")}>Reviews</span>
                    <span>&gt;</span>
                    <span className={isDark ? "text-slate-200" : "text-slate-700"}>{editingReviewId ? "Edit Review" : "Add Review"}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        {editingReviewId ? "Edit Customer Review" : "Add New Review"}
                      </h1>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {editingReviewId ? "Update existing customer feedback log." : "Create a custom customer feedback log manually."}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleMenuChange("Reviews")}
                  className="text-xs text-slate-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  &larr; Back to List
                </button>
              </div>

              {/* Form Grid Container matching exact layout in 2nd image */}
              <form onSubmit={handleSaveReview} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Card: Customer Name, Product Name, Review Comment (Col 7) */}
                <div className={`lg:col-span-7 border rounded-2xl p-6 space-y-4 transition-colors ${
                  isDark ? "bg-[#080d1a] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="space-y-1.5 text-xs">
                    <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Customer Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Admin"
                      value={reviewCustomerName}
                      onChange={(e) => setReviewCustomerName(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Product Name <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={reviewProductId}
                      onChange={(e) => setReviewProductId(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                      }`}
                    >
                      <option value="">Search and select product...</option>
                      {productsList.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Review Comment <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write customer review content..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Right Card: Star Rating, Moderation Status, Attachment Upload, Save/Cancel (Col 5) */}
                <div className={`lg:col-span-5 border rounded-2xl p-6 space-y-6 transition-colors flex flex-col justify-between ${
                  isDark ? "bg-[#080d1a] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="space-y-6">
                    {/* Interactive Star Rating */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Product Rating <span className="text-rose-500">*</span>
                        </label>
                        <span className="font-bold text-amber-400 text-xs">
                          {reviewRating} / 5 Stars ★
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer text-xl ${
                              star <= reviewRating 
                                ? "border-amber-400/50 bg-amber-400/10 text-amber-400 scale-105" 
                                : isDark ? "border-slate-800 text-slate-600 hover:text-amber-300" : "border-slate-200 text-slate-300 hover:text-amber-400"
                            }`}
                            title={`Set ${star} Star Rating`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Moderation Status Dropdown */}
                    <div className="space-y-1.5 text-xs">
                      <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Moderation Status
                      </label>
                      <select
                        value={reviewStatus}
                        onChange={(e) => setReviewStatus(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* Review Attachment Upload Dropzone */}
                    <div className="space-y-1.5 text-xs">
                      <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Review Attachment (Optional)
                      </label>
                      <p className="text-[10px] text-slate-400">Upload a photo showing the product in use.</p>

                      <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                        isDark ? "border-slate-800 hover:border-emerald-500 bg-[#060911]" : "border-slate-200 hover:border-emerald-500 bg-slate-50"
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setReviewImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {reviewImage ? (
                          <div className="space-y-2">
                            <img src={reviewImage} alt="Attachment" className="w-20 h-20 object-cover rounded-xl mx-auto border border-emerald-500/50" />
                            <p className="text-[10px] font-bold text-emerald-400">Click to change photo</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                              <PlusCircle className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-emerald-400">Click to upload image</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">or drag and drop here</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/40">
                    <button
                      type="button"
                      onClick={() => handleMenuChange("Reviews")}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition border ${
                        isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#0B3B82] hover:bg-[#0B3B82]/90 text-white font-bold text-xs px-6 py-2 rounded-xl shadow-lg transition cursor-pointer"
                    >
                      {editingReviewId ? "Update Review" : "Save Review"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: ADD & EDIT CATEGORY & ADD & EDIT SUB CATEGORY */}
          {(activeMenu === "Add Category" || activeMenu === "Edit Category" || activeMenu === "Add Sub Category" || activeMenu === "Edit Sub Category") && (
            <div className="space-y-6">
              {/* Breadcrumb & Header */}
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <span>Dashboard</span>
                  <span>&gt;</span>
                  <span>Categories</span>
                  <span>&gt;</span>
                  <span className="text-emerald-400 font-semibold">
                    {activeMenu === "Edit Sub Category"
                      ? "Edit Sub Category"
                      : editingCategoryId || activeMenu === "Edit Category" 
                        ? "Edit Category" 
                        : activeMenu === "Add Sub Category" 
                          ? "Add Sub Category" 
                          : "Add Category"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        {activeMenu === "Edit Sub Category"
                          ? "Edit Sub Category"
                          : editingCategoryId 
                            ? "Edit Category" 
                            : activeMenu === "Add Sub Category" 
                              ? "Add New Sub Category" 
                              : "Add New Category"}
                      </h1>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {activeMenu === "Edit Sub Category"
                          ? "Update sub-category details and parent main category linkage."
                          : editingCategoryId 
                            ? "Update existing category details." 
                            : activeMenu === "Add Sub Category" 
                              ? "Create a child sub-category linked to a main category." 
                              : "Create a new classification category for your inventory items."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMenuChange("Main Category")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                      isDark ? "border-slate-800 text-slate-400 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    &larr; Back to List
                  </button>
                </div>
              </div>

              {/* Form & Upload Grid */}
              <form onSubmit={handleSaveCategory} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left Side: General Information & SEO (Col 2) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* General Information Box */}
                  <div className={`border rounded-2xl p-6 space-y-4 transition-colors ${
                    isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                  }`}>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800/50">
                      <Info className="w-4 h-4 text-emerald-400" />
                      <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        General Information
                      </h2>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Category Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shirts, T-Shirts, Sneakers, Organic Honey"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                        }`}
                      />
                    </div>

                    {/* Parent Main Category Selection (Required when adding/editing Sub Category) */}
                    {(activeMenu === "Add Sub Category" || activeMenu === "Edit Sub Category" || catParent || (activeMenu === "Add Category" && categoriesList.length > 0)) && (
                      <div className="space-y-1.5 text-xs">
                        <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Parent Main Category {(activeMenu === "Add Sub Category" || activeMenu === "Edit Sub Category") && <span className="text-rose-500">*</span>}
                        </label>
                        <select
                          value={catParent}
                          onChange={(e) => setCatParent(e.target.value)}
                          className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                            isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                          }`}
                        >
                          <option value="">-- Select Parent Category --</option>
                          {categoriesList
                            .filter((c: any) => !c.parent || c.parent === "—")
                            .map((parentCat: any) => (
                              <option key={parentCat.id} value={parentCat.id}>
                                {parentCat.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs">
                      <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Give a descriptive summary for this category classification..."
                        value={catDescription}
                        onChange={(e) => setCatDescription(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Status
                      </label>
                      <select
                        value={catStatus}
                        onChange={(e) => setCatStatus(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Engine Optimization (Optional) Box */}
                  <div className={`border rounded-2xl p-6 space-y-4 transition-colors ${
                    isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                  }`}>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800/50">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Search Engine Optimization (Optional)
                      </h2>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Meta SEO Title
                      </label>
                      <input
                        type="text"
                        placeholder="Custom title tag for browser tabs"
                        value={catMetaTitle}
                        onChange={(e) => setCatMetaTitle(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className={`font-semibold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Meta SEO Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Short snippet summary for search results page description..."
                        value={catMetaDesc}
                        onChange={(e) => setCatMetaDesc(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                  </div>

                </div>

                {/* Right Side: Image Upload & Form Action Buttons (Col 1) */}
                <div className="space-y-6">
                  {/* Category Image Box */}
                  <div className={`border rounded-2xl p-6 space-y-4 transition-colors ${
                    isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                  }`}>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800/50">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Category Image <span className="text-rose-500">*</span>
                      </h2>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Upload a picture representing this category. Required format: PNG, JPG, or WEBP.
                    </p>

                    <label className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                      isDark ? "border-slate-800 hover:border-emerald-500 bg-[#060911]" : "border-slate-200 hover:border-emerald-500 bg-slate-50"
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCatImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />

                      {catImage ? (
                        <div className="space-y-2">
                          <div className="w-24 h-24 rounded-xl overflow-hidden mx-auto border border-emerald-500/50 shadow-md">
                            <img src={catImage} alt="Category preview" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-[11px] font-bold text-emerald-400">Click or drop to replace image</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                            <PlusCircle className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-emerald-400">Click to upload</p>
                          <p className="text-[10px] text-slate-500 mt-1">or drag and drop here</p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { resetCategoryForm(); setActiveMenu("Main Category"); }}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition border ${
                        isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#0B3B82] hover:bg-[#0B3B82]/90 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
                    >
                      {editingCategoryId ? "Update Category" : "Save Category"}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* VIEW 3: ADD & EDIT PRODUCT WITH LIVE PREVIEW */}
          {activeMenu === "Add Product" && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-extrabold tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}>
                  {editingProductId ? "Edit Existing Product" : "Add New E-commerce Product"}
                </h1>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Fill in product details and inspect the live customer card preview before saving
                </p>
              </div>

              {/* 2-Column Split: Form on Left, Live Card Preview on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left Side: Product Form (Col-2) */}
                <form onSubmit={handleSaveProduct} className={`lg:col-span-2 border rounded-2xl p-6 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <h2 className={`text-base font-bold pb-2 border-b ${isDark ? "text-white border-slate-800" : "text-slate-900 border-slate-100"}`}>
                    Product Specifications
                  </h2>

                  <div className="space-y-1.5 text-xs">
                    <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Organic Black Maca Powder (300 gm)"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Regular Price (৳) *</label>
                      <input
                        type="number"
                        required
                        placeholder="1450"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Original / Discount Price (৳)</label>
                      <input
                        type="number"
                        placeholder="1800"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        placeholder="45"
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Product Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                        }`}
                      >
                        <option value="Health & Organic">Health &amp; Organic</option>
                        <option value="Groceries & Cooking">Groceries &amp; Cooking</option>
                        <option value="Natural Honey">Natural Honey</option>
                        <option value="Dry Fruits & Nuts">Dry Fruits &amp; Nuts</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Main Image URL</label>
                    <input
                      type="text"
                      placeholder="e.g. /prod_maca.png"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Description</label>
                    <textarea
                      rows={3}
                      placeholder="Enter detailed product description..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                      }`}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => { resetForm(); setActiveMenu("All Products"); }}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition border ${
                        isDark ? "border-slate-800 text-slate-400 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#0b3b82] hover:bg-[#0b3b82]/90 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      {editingProductId ? "Update Product" : "Save & Publish Product"}
                    </button>
                  </div>
                </form>

                {/* Right Side: Real-time Product Card Live Preview (Col-1) */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors sticky top-4 ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
                    <span className="text-xs font-extrabold text-[#0b3b82] dark:text-blue-400 uppercase tracking-wider">
                      Live Customer Preview
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                      Live
                    </span>
                  </div>

                  {/* Customer Storefront Product Card Mock */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-[#080c14] space-y-3 shadow-md">
                    <div className="w-full h-44 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
                      {formImage ? (
                        <Image
                          src={formImage}
                          alt="Product Preview"
                          width={180}
                          height={180}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Package className="w-12 h-12 text-slate-400" />
                      )}
                      
                      {formOriginalPrice && parseFloat(formOriginalPrice) > parseFloat(formPrice || "0") && (
                        <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Sale
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#0b3b82] dark:text-blue-400 uppercase tracking-wider block">
                        {formCategory}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                        {formName || "Sample Product Title"}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {formDescription || "Detailed product description preview will appear here..."}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-base font-black text-slate-900 dark:text-white block">
                          ৳{formPrice || "0"}
                        </span>
                        {formOriginalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳{formOriginalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled
                        className="bg-[#0b3b82] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs opacity-90 cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

      </div>

      {/* Confirmation Modal Component */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-md border rounded-2xl p-6 space-y-5 shadow-2xl transition-all ${
            isDark ? "bg-[#090d18] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">{confirmModal.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Confirmation Required</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className={`p-1.5 rounded-lg transition ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {confirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Category Details Modal */}
      {viewCategoryModal.isOpen && viewCategoryModal.category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg border rounded-2xl p-6 space-y-6 shadow-2xl transition-all ${
            isDark ? "bg-[#090d18] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">{viewCategoryModal.category.name}</h3>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {viewCategoryModal.category.type}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewCategoryModal({ isOpen: false, category: null })}
                className={`p-1.5 rounded-lg transition ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="space-y-4 text-xs">
              {/* Category Image Preview if present */}
              {viewCategoryModal.category.image ? (
                <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 flex items-center justify-center">
                  <img 
                    src={viewCategoryModal.category.image} 
                    alt={viewCategoryModal.category.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className={`w-full h-24 rounded-xl bg-gradient-to-tr ${viewCategoryModal.category.color || "from-blue-600 to-indigo-600"} flex items-center justify-center text-white font-black text-3xl shadow-inner`}>
                  {viewCategoryModal.category.name.charAt(0)}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Category ID</span>
                  <span className="font-mono font-bold text-slate-200">#{viewCategoryModal.category.id}</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Status</span>
                  <span className="font-bold text-emerald-400">{viewCategoryModal.category.status}</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Parent Category</span>
                  <span className="font-medium text-slate-300">{viewCategoryModal.category.parent || "—"}</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Created Date</span>
                  <span className="font-medium text-slate-300">{viewCategoryModal.category.date}</span>
                </div>
              </div>

              {/* Description */}
              <div className={`p-3 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Description</span>
                <p className="text-slate-300 leading-relaxed italic">{viewCategoryModal.category.desc || "No description provided."}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => setViewCategoryModal({ isOpen: false, category: null })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const catToEdit = viewCategoryModal.category;
                  setViewCategoryModal({ isOpen: false, category: null });
                  handleEditCategoryClick(catToEdit);
                }}
                className="bg-[#0B3B82] hover:bg-[#0B3B82]/90 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW REVIEW DETAILS MODAL */}
      {viewReviewModal.isOpen && viewReviewModal.review && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl p-6 space-y-5 border shadow-2xl transition ${
            isDark ? "bg-[#090d18] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Customer Review Details</h3>
                  <p className="text-[11px] text-slate-400">Viewing detailed rating &amp; feedback submission</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewReviewModal({ isOpen: false, review: null })}
                className={`p-1.5 rounded-lg transition ${isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Info Grid */}
            <div className="space-y-4 text-xs">
              {/* Optional Attachment Image Preview */}
              {viewReviewModal.review.image && (
                <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 flex items-center justify-center">
                  <img 
                    src={viewReviewModal.review.image} 
                    alt="Customer upload" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Reviewer Name</span>
                  <span className="font-bold text-white text-sm">{viewReviewModal.review.customer_name}</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Moderation Status</span>
                  <span className={`font-bold text-[11px] px-2 py-0.5 rounded-full ${
                    viewReviewModal.review.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    viewReviewModal.review.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {viewReviewModal.review.status}
                  </span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Product</span>
                  <span className="font-semibold text-blue-400">{viewReviewModal.review.product ? viewReviewModal.review.product.name : "General Store Review"}</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Product Rating</span>
                  <span className="font-bold text-amber-400 text-sm">{"★".repeat(viewReviewModal.review.rating || 5)} ({viewReviewModal.review.rating || 5}.0)</span>
                </div>
              </div>

              {/* Review Comment Content */}
              <div className={`p-3.5 rounded-xl border ${isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Reviewer Comment</span>
                <p className="text-slate-200 leading-relaxed italic text-xs">"{viewReviewModal.review.comment}"</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => setViewReviewModal({ isOpen: false, review: null })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const revToEdit = viewReviewModal.review;
                  setViewReviewModal({ isOpen: false, review: null });
                  setEditingReviewId(revToEdit.id);
                  setReviewCustomerName(revToEdit.customer_name);
                  setReviewProductId(revToEdit.product_id ? revToEdit.product_id.toString() : "");
                  setReviewComment(revToEdit.comment);
                  setReviewRating(revToEdit.rating || 5);
                  setReviewStatus(revToEdit.status || "Pending");
                  setReviewImage(revToEdit.image || "");
                  handleMenuChange("Add Review");
                }}
                className="bg-[#0B3B82] hover:bg-[#0B3B82]/90 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
