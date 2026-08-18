import AdminSidebar from '@/components/layout/adminSideBar';
import styles from './layout.module.css'
export default function AdminLeyout({children}){
    return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebarContainer}>
        <AdminSidebar/>
      </div>
      <div className={styles.contentContainer}>
        {children}
        {/* این بخش برای بارگذاری محتوای متغیر از صفحات مختلف استفاده می‌شود */}
      </div>
    </div>
  );
}

