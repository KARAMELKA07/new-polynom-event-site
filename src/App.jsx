import FamilyTreeCanvas from './components/FamilyTreeCanvas';
import SuspectPoll from './components/SuspectPoll';
import { introContent } from './data/familyTree';

const recordPeopleImage = new URL('../promo/пластинка с людьми.webp', import.meta.url).href;
const logoImage = new URL('../promo/ЛОГО.webp', import.meta.url).href;
const menuLinks = [
  { label: 'Начало', href: '#top' },
  { label: 'Кто виновен', href: '#suspect-poll' },
  { label: 'Карта героев', href: '#map' },
  { label: 'Отзыв', href: '#feedback' },
  { label: 'Соцсети', href: '#contacts' },
];
const socialLinks = [
  {
    label: 'Telegram',
    href: 'https://t.me/New_Polynom',
    iconSrc: '/icons/telegram.svg',
  },
  {
    label: 'ВК',
    href: 'https://vk.com/new_polynom',
    iconSrc: '/icons/vk.svg',
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
          <span className="site-kicker__line site-kicker__line--main">Рады приветствовать Вас</span>
          <span className="site-kicker__line">на детективно-комедийном спектакле</span>
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



        <section className="feedback-card" id="feedback" aria-labelledby="feedback-title">
          <h2 id="feedback-title">Нам важно ваше мнение</h2>
          <p>
            Поделитесь впечатлениями о спектакле, расскажите, что вам особенно
            понравилось, а что можно сделать ещё лучше. Ваша обратная связь
            помогает нам делать новые проекты ещё
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
