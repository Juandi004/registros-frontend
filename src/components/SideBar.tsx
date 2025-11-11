import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"
import { Home, Film, Mail, User, LogOut, Menu } from "lucide-react"

const Sidebar = () => {
  const navigate = useNavigate()
  const isLogged = useAuthStore((s) => s.isLoggedIn)
  const logoutStore = useAuthStore((s) => s.logout)

  const token = localStorage.getItem("token")
  const id = Number(localStorage.getItem("id"))

  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false) 
  
  useEffect(() => {
    if (!isLogged || !token || !id) return
    axios
      .get(`http://localhost:3000/user/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err))
  }, [isLogged, id, token])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    logoutStore()
    navigate("/login")
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-gray-200 rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>

  
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-gray-100 shadow-xl transition-all duration-300 z-40
          ${open ? "w-64" : "w-16"} 
          transform ${open ? "translate-x-0" : "translate-x-0"}
        `}
      >
        <div className="py-20 px-4 flex items-center justify-between">
          <span className={`text-xl font-semibold ${open ? "inline" : "hidden"}`}>
            Project Management
          </span>
        </div>
        {isLogged && user && (
          <div
            className={`flex items-center gap-3 px-3 py-2 mb-4 bg-gray-800 rounded-lg transition-all ${
              open ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-1 px-2">
          <NavItem to="/dashboard" icon={<Home />} label="Dashboard" open={open} />
          <NavItem to="/movies" icon={<Film />} label="Movies" open={open} />
          <NavItem to="/proyect" icon={<Mail />} label="Proyects" open={open} />
          {isLogged && <NavItem to="/profile" icon={<User />} label="Profile" open={open} />}

          {isLogged && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span className={`${open ? "inline" : "hidden"}`}>Cerrar Sesión</span>
            </button>
          )}

          {!isLogged && <NavItem to="/login" icon={<User />} label="Login" open={open} />}
        </nav>
      </div>
    </>
  )
}

export default Sidebar

const NavItem = ({ to, icon, label, open }: { to: string; icon: any; label: string; open: boolean }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center w-full p-3 rounded-lg transition-all ${
          isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"
        }`
      }
    >
      <div className="grid place-items-center mr-3">{icon}</div>
      <span className={`${open ? "inline" : "hidden"}`}>{label}</span>
    </NavLink>
  )
}
