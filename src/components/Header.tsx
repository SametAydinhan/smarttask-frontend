"use client";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("Header");
  return (
    <div>
      <div className='bg-white border-b border-slate-200 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center space-x-4'>
              <div className='flex items-center space-x-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>ST</span>
                </div>
                <h1 className='text-xl font-semibold text-slate-900'>
                  SmartTask
                </h1>
              </div>
            </Link>
            <div className='flex items-center space-x-4'>
              <LocaleSwitcher />
              <Avatar className='h-8 w-8'>
                <AvatarFallback className='bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm'>
                  {user?.name?.charAt(0)?.toUpperCase() ?? ""}
                </AvatarFallback>
              </Avatar>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className='text-slate-600 hover:text-slate-900'
              >
                <LogOut className='h-4 w-4 mr-2' />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
