export const metadata = { title: "Notes", description: "Server-rendered notes on a Back4app backend" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ font: "16px system-ui", maxWidth: 560, margin: "60px auto", padding: "0 20px" }}>{children}</body>
    </html>
  );
}
