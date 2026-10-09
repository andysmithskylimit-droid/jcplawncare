import { company } from '../data/content';
import { useRouter } from '../lib/router';
import { requestQuote } from '../lib/quote';

/** Always-visible call and quote buttons on phones (hidden on the contact page). */
export default function MobileCTA() {
  const { path } = useRouter();
  if (path === '/contact') return null;
  return (
    <div className="mcta">
      <a className="mcta__btn mcta__btn--call" href={company.phoneHref}>
        Call
      </a>
      <button type="button" className="mcta__btn mcta__btn--quote" onClick={() => requestQuote()}>
        Get a quote
      </button>
    </div>
  );
}
