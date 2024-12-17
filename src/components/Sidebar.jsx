import { MoreVertical, ChevronLast, ChevronFirst, ChevronDown, LogOut } from "lucide-react"
import { useContext, createContext, useState } from "react"
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true)
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("email");
        
    // Navigate to login page
    navigate("/login");
  };

  return (
    <aside className={`
      ${expanded ? "w-64" : "w-16"}
      bg-[#0f0f0f] text-white
      h-screen
      p-3
      pt-8
      relative
      duration-300
      border-r border-[#272727]
    `}>

      <div className="flex justify-between items-center">
      <h1 className={`font-bold text-2xl tracking-wide text-[#f1f1f1] overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}>VideoHub</h1>
        <button
          onClick={() => setExpanded((curr) => !curr)}
          className="p-1.5 rounded-lg hover:bg-[#272727] flex justify-end"
        >
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      </div>

      <SidebarContext.Provider value={{ expanded }}>
        <nav className="space-y-2 pt-4">{children}</nav>
      </SidebarContext.Provider>

      <div className="border-none flex p-3 absolute bottom-0 w-full">
        <div className={`
          flex justify-between items-center
          overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
        >
          <div className="leading-4">
            <h4 className="font-semibold text-[#f1f1f1]">{localStorage.getItem("username")}</h4>
            <span className="text-xs text-[#aaaaaa]">{localStorage.getItem("email")}</span>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-[#272727] flex justify-end">
            <LogOut />
          </button>
        </div>
      </div>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert, children, onClick }) {
  const { expanded } = useContext(SidebarContext)
  const [isOpen, setIsOpen] = useState(false)
  
  const handleClick = () => {
    if (children) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <li
        onClick={handleClick}
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active
              ? "bg-[#272727] text-[#f1f1f1]"
              : "hover:bg-[#272727] text-[#aaaaaa]"
          }
      `}
      >
        <div className="flex items-center">
          {icon}
          <span
            className={`overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            {text}
          </span>
        </div>
        {children && expanded && (
          <ChevronDown
            className={`absolute right-2 top-3 w-4 h-4 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        )}
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-[#3ea6ff] ${
              expanded ? "" : "top-2"
            }`}
          />
        )}

        {/* {!expanded && (
          <div
            className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-[#272727] text-[#f1f1f1] text-sm
              invisible opacity-20 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}
          >
            {text}
          </div>
        )} */}
        
      </li>
      {children && isOpen && expanded && (
        <div className="ml-4 border-l-2 border-indigo-100 pl-2">
          {children}
        </div>
      )}
    </>
  )
}

export function Submenu({ icon, text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-[#272727] text-[#f1f1f1]"
            : "hover:bg-[#272727] text-[#aaaaaa]"
        }
      `}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </div>
  )
}