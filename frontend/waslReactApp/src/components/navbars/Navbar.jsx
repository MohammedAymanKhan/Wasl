import { useState } from "react"
import UserProfile from "../UserProfile"
import MobileNav from "./MobileNav"
import { NotificationSystem } from "./NotificationSystem";


export const Navbar = () => {
  const [showNotification,setShowNotification] = useState(false);

  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-16 py-4 lg:px-10">
      
      <a href="/" className="flex items-center gap-1">
        <img
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="yoom logo"
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">
          Wasl
        </p>
      </a>

        
      <div className="flex-between gap-5 w-fit">
        <NotificationSystem/>
        <UserProfile/>
        <MobileNav />
      </div>
      
    </nav>
  )
}
