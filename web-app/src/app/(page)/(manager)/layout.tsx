import { ManagerLayout } from '@/components/manager/layouts/ManagerLayout';

export default function ManagerLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ManagerLayout>{children}</ManagerLayout>;
} 