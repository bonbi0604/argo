import { useContext, useEffect } from "react"; // 리액트에서 useContext 모듈을 가져옵니다.
import UserInfo from "../components/UserInfo"; // UserInfo 컴포넌트를 가져옵니다.
import AuthContext from "../context/AuthContext"; // 커스텀 인증 컨텍스트를 가져옵니다.
import "./homePage.css"
import { Link } from "react-router-dom";
console.log("homepage"); // "homepage"을 콘솔에 출력합니다.

const Home = () => {
  useEffect(() => {
    const smoothScrollTo = (targetY, duration) => {
      const startY = window.scrollY;
      const change = targetY - startY;
      let currentTime = 0;

      const animateScroll = () => {
        currentTime += 20; // 스크롤 애니메이션 간격
        const val = Math.easeInOutQuad(currentTime, startY, change, duration);
        window.scrollTo(0, val);
        if (currentTime < duration) {
          requestAnimationFrame(animateScroll);
        }
      };

      Math.easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      };

      animateScroll();
    };

    const handleScroll = (event) => {
      event.preventDefault();
      const targetId = event.currentTarget.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        smoothScrollTo(targetElement.offsetTop, 1000); // 1000ms 동안 스크롤
      }
    };

    const scrollElements = document.querySelectorAll('.scrolly');
    scrollElements.forEach(el => {
      el.addEventListener('click', handleScroll);
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      scrollElements.forEach(el => {
        el.removeEventListener('click', handleScroll);
      });
    };
  }, []);

  useEffect(() => {
    const loadScripts = async () => {
      const scripts = [
        "../../home/assets/js/jquery.min.js",
        // "../../home/assets/js/jquery.scrolly.min.js",
        // "../../home/assets/js/jquery.scrollex.min.js",
        "../../home/assets/js/browser.min.js",
        "../../home/assets/js/breakpoints.min.js",
        "../../home/assets/js/util.js",
        "../../home/assets/js/main.js",
      ];

      for (const src of scripts) {
        try {
          await loadScript(src);
          console.log(`Loaded script: ${src}`);
        } catch (error) {
          console.error(`Error loading script: ${src}`);
        }
      }
    };

    loadScripts();
  }, []);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  };

  return (
    <div>
      <link rel="stylesheet" href="../../home/assets/css/main.css" />
      <noscript>&lt;link rel="stylesheet" href="../../home/assets/css/noscript.css" /&gt;</noscript>
      {/* Wrapper */}
      <div id="wrapper">
        {/* Banner */}
        <section id="banner" className="major">
          <div className="inner">
            <header className="major">
              <h1>안녕하세요</h1>
            </header>
            <div className="content">
              <p>신입사원분들의 역량 개발을 도와드립니다.<br />
                사내규정을 챗봇에게 물어보세요.</p>
              <ul className="actions">
                <li><a href="#one" className="button next scrolly">Get Started</a></li>
              </ul>
            </div>
          </div>
        </section>
        {/* Main */}
        <div id="main">
          {/* One */}
          <section id="one" className="tiles">
            <article>
              <span className="image">
                <img src="../../home/images/feedback.jpg" alt="feedback" />
              </span>
              <header className="major">
                <h3><Link to="/result" className="link">피드백</Link></h3>
                <p>Ipsum dolor sit amet</p>
              </header>
            </article>
            <article>
              <span className="image">
                <img src="../../home/images/development.jpg" alt="development" />
              </span>
              <header className="major">
                <h3><Link to="/learn" className="link">역량개발</Link></h3>
                <p>feugiat amet tempus</p>
              </header>
            </article>
            <article>
              <span className="image">
                <img src="../../home/images/chatbot.jpg" alt="chatbot" />
              </span>
              <header className="major">
                <h3><Link to="/chat" className="link">사내규정 도우미</Link></h3>
                <p>Lorem etiam nullam</p>
              </header>
            </article>
            <article>
              <span className="image">
                <img src="../../home/images/notice.jpg" alt="notice" />
              </span>
              <header className="major">
                <h3><Link to="/DashBoard" className="link">게시판</Link></h3>
                <p>Nisl sed aliquam</p>
              </header>
            </article>
          </section>
          {/* Two */}
          <section id="two">
            <div className="inner">
              <header className="major">
                <h2>sdfa</h2>
              </header>
              <p>Nullam eue condimentum sem. In efficitur ligula tate urna. Maecenas laoreet massa vel lacinia pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis libero. Mauris aliquet magna magna sed nunc rhoncus amet pharetra et feugiat tempus.</p>
              <ul className="actions">
                <li><a href = '#one' className="button next scrolly">Get Started</a></li>
              </ul>
            </div>
          </section>
        </div>
        {/* Contact */}
        <section id="contact">
          <div className="inner">
            <section>
              <form method="post" action="#">
                <div className="fields">
                  <div className="field half">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" />
                  </div>
                  <div className="field half">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="main_email" id="main_email" />
                  </div>
                  <div className="field">
                    <label htmlFor="message">Message</label>
                    <textarea name="message" id="message" rows={6} defaultValue={""} />
                  </div>
                </div>
                <ul className="actions">
                  <li><input type="submit" defaultValue="Send Message" className="primary" /></li>
                  <li><input type="reset" defaultValue="Clear" /></li>
                </ul>
              </form>
            </section>
            <section className="split">
              <section>
                <div className="contact-method">
                  <span className="icon solid alt fa-envelope" />
                  <h3>Email</h3>
                  <a href="#">information@untitled.tld</a>
                </div>
              </section>
              <section>
                <div className="contact-method">
                  <span className="icon solid alt fa-phone" />
                  <h3>Phone</h3>
                  <span>(000) 000-0000 x12387</span>
                </div>
              </section>
              <section>
                <div className="contact-method">
                  <span className="icon solid alt fa-home" />
                  <h3>Address</h3>
                  <span>1234 Somewhere Road #5432<br />
                    Nashville, TN 00000<br />
                    United States of America</span>
                </div>
              </section>
            </section>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home;