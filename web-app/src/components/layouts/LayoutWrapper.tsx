'use client'
import { usePathname } from "next/navigation";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function LayoutWrapper({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    const noLayoutPages = ['/login', '/register', '/registration', "/receptionist", "/forgot-password"];
    const shouldShowLayout = !noLayoutPages.includes(pathname);

    return (
        <>
            {shouldShowLayout && <Header />}
            {children}
            {shouldShowLayout && <Footer />}
        </>
    );
}