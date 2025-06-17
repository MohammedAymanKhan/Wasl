import { useLocation, useNavigate } from "react-router-dom";
import {sidebarLinks} from "../constands/SidebarLinks";


export const Sidebar = () => {

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          
          return ( 
          <div className={'flex gap-4 items-center p-3 rounded-sm justify-start cursor-pointer ' +
            (isActive ? 'bg-blue-1' : '')} 
            key={item.label}
            onClick={() => navigate(item.route)}>

            <img
              src={item.imgURL}
              alt={item.label}
              width={24}
              height={24}
            />

            <div key={item.label}>
              <span className="text-lg font-semibold max-lg:hidden">
                {item.label}
              </span>
            </div>

          </div>
          );
        })}
      </div>
    </section>
  )
}
