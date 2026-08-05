import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {

  title: "M Fresh Dairy | Fresh Cow Milk Delivered Every Morning",

  description:
    "M Fresh Dairy provides 100% pure farm fresh cow milk, curd, paneer, butter and ghee delivered fresh to your doorstep.",


  keywords: [
    "M Fresh Dairy",
    "Fresh Cow Milk",
    "Milk Delivery Chennai",
    "Organic Dairy Products",
    "Farm Fresh Milk"
  ],


  icons: {
    icon: "/images/logo.jpeg",
  },

};


export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {


  return (

    <html lang="en">

      <body>

        {children}

      </body>

    </html>

  );

}