import { Providers } from "@/app/layoutProviders";
import { getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react/rsc";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900"
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900"
});

export const metadata: Metadata = {
	title: "Dreamy UI with Next.js",
	description: "Dreamy UI with Next.js"
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const colorMode = getSSRColorMode((await cookies()).toString());

	return (
		<html
			lang="en"
			suppressHydrationWarning
			{...getColorModeHTMLProps(colorMode)}
		>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Providers colorMode={colorMode}>{children}</Providers>
			</body>
		</html>
	);
}
