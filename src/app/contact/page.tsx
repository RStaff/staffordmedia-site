import {
  buildAutomationMailto,
  parseAutomationBrief,
  type AutomationIntakeSearchParams,
} from "@/lib/automationIntake";

type PageProps = {
  searchParams?: Promise<AutomationIntakeSearchParams>;
};

export default async function ContactPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const brief = parseAutomationBrief(params);
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  const mailto = buildAutomationMailto(
    process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    brief,
  );

  return (
    <main className="bg-white px-6 py-20 text-center text-gray-900">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Stafford Media Consulting
        </p>
        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Tell us what you want to improve
        </h1>
        <p className="mb-8 text-lg md:text-xl">
          Tell us about a workflow, follow-up problem, or business process that
          is taking more time than it should.
        </p>

        {brief.hasContent ? (
          <section
            aria-labelledby="submitted-brief-heading"
            className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-left"
          >
            <h2 id="submitted-brief-heading" className="text-xl font-semibold">
              Your submitted brief
            </h2>
            <dl className="mt-4 grid gap-3 text-sm">
              {brief.improvements.length ? (
                <div>
                  <dt className="font-semibold">Improve</dt>
                  <dd>{brief.improvements.join(", ")}</dd>
                </div>
              ) : null}
              {brief.businessType ? (
                <div>
                  <dt className="font-semibold">Business</dt>
                  <dd>{brief.businessType}</dd>
                </div>
              ) : null}
              {brief.systems.length ? (
                <div>
                  <dt className="font-semibold">Systems</dt>
                  <dd>{brief.systems.join(", ")}</dd>
                </div>
              ) : null}
              {brief.currentWorkflow ? (
                <div>
                  <dt className="font-semibold">Current workflow</dt>
                  <dd className="whitespace-pre-wrap">{brief.currentWorkflow}</dd>
                </div>
              ) : null}
              {brief.desiredWorkflow ? (
                <div>
                  <dt className="font-semibold">Desired workflow</dt>
                  <dd className="whitespace-pre-wrap">{brief.desiredWorkflow}</dd>
                </div>
              ) : null}
            </dl>
          </section>
        ) : null}

        <div className="flex flex-wrap justify-center gap-4">
          {calendlyUrl && /^https:\/\//.test(calendlyUrl) ? (
            <a
              href={calendlyUrl}
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Book a Strategy Call
            </a>
          ) : (
            <div className="rounded border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-600">
              Strategy call link is not configured locally
            </div>
          )}
          {mailto ? (
            <a
              href={mailto}
              className="rounded bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800"
            >
              Email Stafford Media
            </a>
          ) : (
            <div className="rounded border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-600">
              Email contact is not configured locally
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
