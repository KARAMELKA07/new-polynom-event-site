import FamilyTreeCanvas from './components/FamilyTreeCanvas';
import SuspectPoll from './components/SuspectPoll';
import { introContent } from './data/familyTree';

const recordPeopleImage = new URL('../promo/пластинка с людьми.png', import.meta.url).href;
const logoImage = new URL('../promo/ЛОГО.png', import.meta.url).href;
const menuLinks = [
  { label: 'Начало', href: '#top' },
  { label: 'О спектакле', href: '#about' },
  { label: 'Кто виновен', href: '#suspect-poll' },
  { label: 'Карта героев', href: '#map' },
  { label: 'Плейлист', href: '#playlist' },
  { label: 'Отзыв', href: '#feedback' },
  { label: 'Соцсети', href: '#contacts' },
];
const socialLinks = [
  {
    label: 'Telegram',
    href: 'https://t.me/New_Polynom',
    iconSrc: 'https://cdn.simpleicons.org/telegram/26A5E4',
  },
  {
    label: 'ВК',
    href: 'https://vk.com/new_polynom',
    iconSrc: 'https://cdn.simpleicons.org/vk/0077FF',
  },
];

function App() {
  return (
    <div className="page-shell" id="top">
      <header className="site-header">
        <a className="site-logo" href="#top" aria-label="На начало страницы">
          <img src={logoImage} alt="New-Polynom" />
        </a>

        <details className="site-nav">
          <summary aria-label="Открыть меню">
            <span />
            <span />
            <span />
          </summary>

          <nav className="site-nav__panel" aria-label="Навигация по странице">
            {menuLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </details>
      </header>

      <main className="page">
        <header className="site-kicker">
          <span className="site-kicker__line site-kicker__line--main">Рады приветствовать на</span>
          <span className="site-kicker__line">детективно-комедийном спектакле</span>
          <span className="site-kicker__line">вокальной студии "New-Polynom"</span>
        </header>

        <section className="intro-card" id="about">
          <p className="intro-card__lead">{introContent.lead}</p>
        </section>

        <section className="record-hero" id="poster" aria-label="Достать хиты">
          <img
            src={recordPeopleImage}
            alt="Пластинка с героями отчетного концерта Достать хиты"
          />
        </section>

        <SuspectPoll />
        <FamilyTreeCanvas />

        <section className="playlist-section" id="playlist" aria-labelledby="playlist-title">
          <div className="playlist-card">
            <div className="playlist-card__copy">
              <h2 id="playlist-title">Плейлист отчетника</h2>
            </div>

            <div className="playlist-frame">
              <iframe
                title='Отчетник "Достать Хиты" на Яндекс Музыке'
                frameBorder="0"
                allow="clipboard-write"
                src="https://music.yandex.ru/iframe/playlist/ikeashanin/1015"
              >
                Слушайте{' '}
                <a href="https://music.yandex.ru/playlists/fd33df88-0a05-311b-892a-ca7f987baf45?utm_source=web&utm_medium=copy_link">
                  Отчетник "Достать Хиты"
                </a>{' '}
                —{' '}
                <a href="https://music.yandex.ru/users/ikeashanin">
                  Ураганный Краш
                </a>{' '}
                на Яндекс Музыке
              </iframe>
            </div>
          </div>
        </section>

        <section className="feedback-card" id="feedback" aria-labelledby="feedback-title">
          <h2 id="feedback-title">Нам важно ваше мнение</h2>
          <p>
            Поделитесь впечатлениями о спектакле, расскажите, что вам особенно
            понравилось, а что можно сделать ещё лучше. Ваша обратная связь
            помогает нам становиться лучше и делать новые проекты ещё
            интереснее.
          </p>
          <a
            className="button button--primary"
            href="https://forms.yandex.ru/u/69eaa90902848f8249386d34"
            target="_blank"
            rel="noreferrer"
          >
            Оставить отзыв
          </a>
        </section>

        <footer className="social-footer" id="contacts" aria-label="Социальные сети">

            <div className="social-links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  className="social-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="social-link__icon" aria-hidden="true">
                    <img src={link.iconSrc} alt="" />
                  </span>
                  {link.label}
                </a>
              ))}
            </div>

        </footer>
      </main>
    </div>
  );
}

export default App;
