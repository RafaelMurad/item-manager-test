import "./globals.css";
import MswWorker from "../components/MswWorker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MswWorker>
          {children}
        </MswWorker>
      </body>
    </html>
  );
}
