export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 mt-20">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-600">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              className="hover:text-zinc-900 underline-offset-4 hover:underline"
              href="https://staffordmedia.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stafford Media Consulting
            </a>
          </p>
          <div className="flex gap-4">
            <a className="hover:text-zinc-900" href="/privacy">
              Privacy
            </a>
            <a className="hover:text-zinc-900" href="/terms">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
