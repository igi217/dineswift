import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthUserStore } from "@/stores/auth";
import { useCollapseStore } from "@/stores/menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import ChangePassword from "@/screens/ChangePassword";
import Login from "@/screens/Login";

export default function DashboardNavbar() {
  const [collapsed, setCollapsed] = useCollapseStore();
  const [user] = useAuthUserStore();
  const navigate = useNavigate();

  const logout = () => {
    for (let key in localStorage) {
      if (key == "@license" || key == "@db_key") continue;

      localStorage.removeItem(key);
    }
    navigate(Login.route);
  };
  return (
    <div className="px-3 flex-shrink-0 w-100 h-[50px] flex-row flex items-center justify-between bg-white shadow-md">
      <div className="nav">
        <input
          type="checkbox"
          checked={!collapsed}
          onChange={(e) => setCollapsed(!e.target.checked)}
        />
        <svg>
          <use xlinkHref="#menu" />
          <use xlinkHref="#menu" />
        </svg>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 56"
          id="menu"
        >
          <path d="M48.33,45.6H18a14.17,14.17,0,0,1,0-28.34H78.86a17.37,17.37,0,0,1,0,34.74H42.33l-21-21.26L47.75,4" />
        </symbol>
      </svg>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex flex-row items-center">
            <span className="mr-2">Hi, {user?.name}</span>
            <Avatar>
              <AvatarFallback className="bg-indigo-500 text-white">
                {user?.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={ChangePassword.route}>
              <i className="fa-regular fa-lock mr-2"></i>
              <span>Change Password</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout} className="text-red-500">
            <i className="fa-regular fa-power-off mr-2"></i>
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
