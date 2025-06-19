import ToastProvider from "@/components/providers/ToastProvider";
import StoreProvider from "@/redux/StoreProvider";

export default function RegistrationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StoreProvider>
            {children}
            <ToastProvider />
        </StoreProvider>
    );
}