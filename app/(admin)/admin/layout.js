"use client";
import { useState } from "react";
import styles from "./layout.module.css";
import AdminSidebar from "@/components/layout/adminSideBar";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.adminLayout}>
      <button
        className={styles.menuToggle}
        onClick={() => setOpen(!open)}
        aria-label="باز/بسته کردن منو"
      >
        {open ? "✕" : "☰"}
      </button>

      <div
        className={`${styles.overlay} ${open ? styles.show : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`${styles.sidebarContainer} ${open ? styles.open : ""}`}>
        <AdminSidebar />
      </aside>

      <main className={styles.contentContainer}>{children}</main>
    </div>
  );
}