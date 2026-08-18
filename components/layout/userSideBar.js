"use client"
import Link from "next/link";
import styles from "./adminSideBar.module.css";

// icons
import { MdDashboard ,  MdLogout} from "react-icons/md";
import { FaUsers, FaComments } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useAuth } from "@/authContet/authContext";


export default function UserSidebar() {
    const pathName = usePathname()
     const { logout } = useAuth()
  
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>
        <Link href="/">  برگشت ب صفحه ی اصلی</Link>
      </h2>

      <ul>
        <li className={pathName == '/profile' ? styles.active :""}>
          <Link href="/profile">
            <MdDashboard />
            <span>بروفایل من</span>
          </Link>
        </li>

        <li className={pathName == '/profile/courses' ?styles.active :""}>
          <Link href="/profile/courses">
            <FaUsers />
            <span>دوره های من</span>
          </Link>
        </li>

        <li className={pathName == '/profile/license' ?styles.active :""}>
          <Link href="/profile/license">
            <FaComments />
            <span>لایسنس ها </span>
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