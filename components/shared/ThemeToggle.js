
'use client'
import { useTheme } from "next-themes"
import { IoSunnyOutline } from "react-icons/io5"
import { FaMoon } from "react-icons/fa"
import { LuSunMoon } from "react-icons/lu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        {theme === 'system' ? (
          <LuSunMoon />
        ) : theme === 'dark' ? (
          <FaMoon />
        ) : (
          <IoSunnyOutline />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme('light')}>روشن</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>تیره</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>سیستم</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}