'use client';

export default function ContactPage() {
  return (
    <main className="bg-white text-gray-900 py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Let’s Connect</h1>
        <p className="text-lg md:text-xl mb-8">
          Whether you’re ready to build or just exploring ideas, I’d love to hear from you.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={process.env.NEXT_PUBLIC_CALENDLY_URL}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Book a Call
          </a>
          <a
            href={"mailto:" + process.env.NEXT_PUBLIC_CONTACT_EMAIL}
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded"
          >
            Email Ross
          </a>
        </div>
      </div>
    </main>
  );
}
