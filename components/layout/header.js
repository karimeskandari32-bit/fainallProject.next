"use client";
import Link from "next/link";
import styles from "./header.module.css";

// icons
import { FaHome, FaMicrophone } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoSchool } from "react-icons/io5";
import { MdArticle, MdFavoriteBorder } from "react-icons/md";
import { SlBasket } from "react-icons/sl";
import { LuUserRound } from "react-icons/lu";
import { PiCaretLeft } from "react-icons/pi";
import { FiBox } from "react-icons/fi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "@/authContet/authContext";
import { useCart } from "@/authContet/CartContext";


export default function Header() {
 const {loading , user , logout}=useAuth()
 const{cartCount}=useCart()


  
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <img src="/images/image.png" />
        <ul>
          <li>
            <Link href="/">
              <FaHome />
              <span>صفحه اصلی</span>
            </Link>
          </li>
          <li>
            <Link href="/courses">
              <IoSchool />
              <span>دوره های آموزشی</span>
            </Link>
          </li>
          <li>
            <Link href="/podcast">
              <FaMicrophone />
              <span>پادکست</span>
            </Link>
          </li>
          <li>
            <Link href="/articles">
              <MdArticle />
              <span>مقاله ها</span>
            </Link>
          </li>
        </ul>

        <div>
          {loading ? (
            <div className={styles.skeletonAvatar}></div>
          ) : user ? (
            <div className={`${styles.cardIconWrapper} ${styles.userIcon}`}>
              <LuUserRound />
              <UserProfileMenu logout={logout}/>
            </div>
          ) : (
            <Link href="/auth">
              <button className={styles.authBtn}> ورود | ثبت نام </button>
            </Link>
          )}
          <Link href="/cart">
            <div
              className={`${styles.cardIconWrapper} ${styles.cartIconWrapper}`}
            >
             {cartCount > 0 &&  <div className={styles.cartCount}>{cartCount}</div>}
              <SlBasket />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}


function UserProfileMenu({logout}) {

    
  return (
    <div className={styles.userProfileMenu}>
      <ul>
        <li>
          <Link href="/profile">
            <div className={styles.item}>
              <p>
                <FaRegCircleUser />
                <span>پروفایل</span>
              </p>
              <PiCaretLeft className={styles.caretLeft} />
            </div>
          </Link>
        </li>

        <li>
          <Link href="/profile">
            <div className={styles.item}>
              <p>
                <MdFavoriteBorder />
                <span>دوره های من</span>
              </p>
              <PiCaretLeft className={styles.caretLeft} />
            </div>
          </Link>
        </li>

        <li>
          <Link href="/profile">
            <div className={styles.item}>
              <p>
                <FiBox />
                <span>لایسنس های من</span>
              </p>
              <PiCaretLeft className={styles.caretLeft} />
            </div>
          </Link>
        </li>

        <li onClick={logout}>
          <div className={styles.item}>
            <p>
              <RiLogoutBoxRLine />
              <span>خروج از حساب کاربری</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}