import { Loading } from "@/components/ui/loading";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loading size="lg" text="Loading page..." />
    </div>
  );
}