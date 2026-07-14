import React from "react";
import Header from "../components/layouts/Header";

export default function Mainlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header user={null} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
