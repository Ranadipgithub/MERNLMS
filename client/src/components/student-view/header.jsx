import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { ChevronDown, MonitorPlayIcon as TvMinimalPlay } from "lucide-react"
import { useContext } from "react"
import { AuthContext } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu"
import { courseCategories } from "@/config"

function Header() {
  const { resetCredentials } = useContext(AuthContext)
  const location = useLocation()
  const isHomePage =
  location.pathname === "/" ||
  location.pathname.startsWith("/course/details/");


  function handleLogout() {
    resetCredentials()
    sessionStorage.removeItem("accessToken")
  }

  return (
    <header className={`${isHomePage ? "bg-cyan-100/70" : "bg-white"} border-b border-gray-700`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-20">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-3xl font-semibold text-gray-900">
            <span className="text-indigo-600">E</span>Learning
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-[16px] md:text-[18px] font-medium text-gray-700 cursor-pointer hover:bg-cyan-100/70"
              >
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4" align="start">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">Explore by Category</h3>
                {courseCategories.map((category) => (
                  <DropdownMenuItem key={category.id} className="p-0">
                    <Link
                      to={`/courses?category=${encodeURIComponent(category.id)}`}
                      className="block w-full px-2 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                    >
                      {category.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/my-courses" className="flex items-center gap-1 text-gray-700">
            <TvMinimalPlay className="w-6 h-6" />
            <span className="text-[16px] md:text-[18px] font-medium cursor-pointer">My Courses</span>
          </Link>
          <Button onClick={handleLogout} className="text-[16px] md:text-[18px] font-medium cursor-pointer">
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
