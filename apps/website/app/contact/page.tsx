export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 text-zinc-700">
        Tell us about your store, current stack, and goals.
      </p>
      <form className="mt-6 grid gap-4 max-w-xl">
        <input
          name="name"
          placeholder="Name"
          className="border rounded-xl px-4 py-3"
        />
        <input
          name="email"
          placeholder="Email"
          className="border rounded-xl px-4 py-3"
        />
        <textarea
          name="msg"
          placeholder="What would you like to achieve?"
          className="border rounded-xl px-4 py-3 min-h-32"
        />
        <button className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium w-fit">
          Send
        </button>
      </form>
    </div>
  );
}
