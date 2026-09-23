import Navbar from "@/components/Navbar";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <LoadingSkeleton />
      </main>
    </div>
  );
}
