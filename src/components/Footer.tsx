'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Stafford Media Consulting. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <a href={process.env.NEXT_PUBLIC_ABANDO_URL} className="underline hover:text-blue-400">
            Abando.ai
          </a>
          <a href={process.env.NEXT_PUBLIC_CALENDLY_URL} className="underline hover:text-blue-400">
            Book a Call
          </a>
          <a href={"mailto:" + process.env.NEXT_PUBLIC_CONTACT_EMAIL} className="underline hover:text-blue-400">
            Contact Ross
          </a>
        </div>
      </div>
    </footer>
  );
}
