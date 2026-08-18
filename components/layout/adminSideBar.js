"use client"
import Link from "next/link";
import styles from "./adminSideBar.module.css";

// icons
import { MdDashboard, MdCategory, MdLogout } from "react-icons/md";
import { FaUsers, FaComments, FaShoppingCart } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import { RiDiscountPercentFill } from "react-icons/ri";
import { IoMdSettings, IoIosAddCircle } from "react-icons/io";
import { useAuth } from "@/authContet/authContext";
import { usePathname } from "next/navigation";


export default function AdminSidebar() {
    const pathName = usePathname()
    const { logout } = useAuth()
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>
        <Link href="/">برگشت به صفحه ی اصلی</Link>
      </h2>

      <ul>
        <li className={pathName == '/admin/dashboard' ? styles.active :""}>
          <Link href="/admin/dashboard">
            <MdDashboard />
            <span>داشبورد</span>
          </Link>
        </li>

        <li className={pathName == '/admin/users' ?styles.active :""}>
          <Link href="/admin/users">
            <FaUsers />
            <span>کاربران</span>
          </Link>
        </li>

        <li className={pathName == '/admin/comments' ?styles.active :""}>
          <Link href="/admin/comments">
            <FaComments />
            <span>کامنت ها</span>
          </Link>
        </li>

        <li className={pathName == '/admin/courses' ?styles.active :""}>
          <Link href="/admin/courses">
            <SiCoursera />
            <span>دوره ها</span>
          </Link>
        </li>

        <li className={pathName == '/admin/courses/add' ?styles.active :""}>
          <Link href="/admin/courses/add">
            <IoIosAddCircle />
            <span>اضافه کردن دوره</span>
          </Link>
        </li>

        <li className={pathName == '/admin/categories' ?styles.active :""}>
          <Link href="/admin/categories">
            <MdCategory />
            <span>دسته بندی ها</span>
          </Link>
        </li>

        <li className={pathName == '/admin/orders' ?styles.active :""}>
          <Link href="/admin/orders">
            <FaShoppingCart />
            <span>سفارش ها</span>
          </Link>
        </li>

        <li className={pathName == '/admin/discounts' ?styles.active :""}>
          <Link href="/admin/discounts">
            <RiDiscountPercentFill />
            <span>تخفیف ها</span>
          </Link>
        </li>

        <li className={pathName == '/admin/settings' ?styles.active :""}>
          <Link href="/admin/settings">
            <IoMdSettings />
            <span>تنظیمات</span>
          </Link>
        </li>

        <li className={styles.logoutItem}>
          <button onClick={logout} className={styles.logoutBtn}>
            <MdLogout />
            <span>خروج</span>
          </button>
        </li>
      </ul>
    </div>
  );
}