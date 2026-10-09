import { useState } from 'react';
import { company, areas } from '../data/content';
import RevealText from '../components/RevealText';

export default function ServiceArea() {
  const [mapActive, setMapActive] = useState(false);

  return (
    <section className="area section" id="area" aria-labelledby="area-title">
      <div className="container area__grid">
        <div className="area__copy">
          <RevealText className="section-title" id="area-title">
            Based in Rancho Cordova. Working across Greater Sacramento.
          </RevealText>
          <p className="section-intro">
            Not sure if your property is in range? Call and ask. It takes a minute.
          </p>
          <ul className="area__list">
            {areas.map((a) => (
              <li key={a.name}>
                <span className="area__name">{a.name}</span>
                <span className="area__zips">{a.note ? `${a.note}, ` : ''}{a.zips.join(', ')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`area__map ${mapActive ? 'is-active' : ''}`} data-cursor-hide="">
          <iframe
            title="Map showing JCP Lawn Service in Rancho Cordova, California"
            src={company.mapEmbed}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          {!mapActive && (
            <button type="button" className="area__map-cover" onClick={() => setMapActive(true)}>
              <span className="area__pin">
                {company.address.street}
                <br />
                {company.address.city}, {company.address.region} {company.address.postal}
              </span>
              <span className="area__map-hint">Select to explore the map</span>
            </button>
          )}
        </div>
      </div>

    </section>
  );
}
