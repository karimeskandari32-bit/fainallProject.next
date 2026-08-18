import styles from './layout.module.css'
import UserSidebar from '@/components/layout/userSideBar';
export default function AdminLeyout({children}){
    return (
    <div className={styles.userLayout}>
      <div className={styles.sidebarContainer}>
        <UserSidebar/>
      </div>
      <div className={styles.contentContainer}>
        {children}
        {/* این بخش برای بارگذاری محتوای متغیر از صفحات مختلف استفاده می‌شود */}
      </div>
    </div>
  );
}