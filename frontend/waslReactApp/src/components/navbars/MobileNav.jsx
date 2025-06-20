import { useLocation, useNavigate } from 'react-router-dom';
import { sidebarLinks } from '@/constands/SidebarLinks';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';

const MobileNav = () => {

  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  return (
     <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <img
            src="/icons/hamburger.svg"
            width={36}
            height={36}
            alt="hamburger icon"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1">
          <a href="/" className="flex items-center gap-1">
            <img
              src="/icons/logo.svg"
              width={32}
              height={32}
              alt="wasl logo"
            />
            <p className="text-[26px] font-extrabold text-white">Wasl</p>
          </a>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className=" flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route;

                  return (
                    <SheetClose asChild key={item.route}>
                      
                      <div
                        key={item.label}
                        className={
                          'flex gap-4 items-center p-3 rounded-sm justify-start ' +
                          (isActive ? 'bg-blue-1' : '')
                        }
                        onClick={() => navigate(item.route)}
                      >
                        <img
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                        />
                        <p className="font-semibold">{item.label}</p>
                      </div>

                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default MobileNav;