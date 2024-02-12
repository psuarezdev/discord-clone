import NavSideBar from '@/components/navigation/nav-sidebar';

export default function MainLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="h-full">
      <aside className="hidden md:flex flex-col h-full w-[72px] fixed z-30 inset-y-0">
        <NavSideBar />
      </aside>
      <main className="md:pl-[72px] h-full">
        {children}
      </main>
    </div>
  );
}
