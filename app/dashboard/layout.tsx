import NavBar from "../components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-dvh">
      <NavBar />
      <main className="flex items-center justify-center">{children}</main>
    </div>
  );
}