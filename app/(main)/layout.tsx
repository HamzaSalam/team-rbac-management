import React from "react";

export default function Mainlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Headers />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
