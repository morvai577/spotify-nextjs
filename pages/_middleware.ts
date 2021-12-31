import { NextResponse } from "next/server";

const signedinPages = ["/", "/playlist", "/library"]; // pages you want to protect via authentication

export default function middleware(req) {
  if (signedinPages.find((p) => p === req.nextUrl.pathname)) {
    const token = req.cookies.TRAX_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.redirect("/signin");
    }
  }
}
