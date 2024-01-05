import { useContext, useEffect } from "react"; // 리액트에서 useContext 모듈을 가져옵니다.
import UserInfo from "../components/UserInfo"; // UserInfo 컴포넌트를 가져옵니다.
import AuthContext from "../context/AuthContext"; // 커스텀 인증 컨텍스트를 가져옵니다.
import "./homePage.css"
import { Link } from "react-router-dom";
console.log("homepage"); // "homepage"을 콘솔에 출력합니다.

const Home = () => {
  const { user } = useContext(AuthContext); // AuthContext에서 user 정보를 가져옵니다.
  useEffect(() => {
    const loadScript = src => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });
    };
  
    const scripts = [
      "../../test/assets/js/jquery.min.js",
      "../../test/assets/js/jquery.scrolly.min.js",
      "../../test/assets/js/jquery.scrollex.min.js",
      "../../test/assets/js/browser.min.js",
      "../../test/assets/js/breakpoints.min.js",
      "../../test/assets/js/util.js",
      "../../test/assets/js/main.js",
    ];
  
    scripts.reduce((prev, curr) => {
      return prev.then(() => loadScript(curr));
    }, Promise.resolve());
  }, []);
  
  return (
    <div>
          <link rel="stylesheet" href="../../test/assets/css/main.css" />
          <noscript>&lt;link rel="stylesheet" href="../../test/assets/css/noscript.css" /&gt;</noscript>
          {/* Wrapper */}
          <div id="wrapper">
            <section id="banner" className="major">
              <div className="inner">
                <header className="major">
                  <h1>Hi, my name is Forty</h1>
                </header>
                <div className="content">
                  <p>A responsive site template designed by HTML5 UP<br />
                    and released under the Creative Commons.</p>
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
                    <img src="../../test/images/pic01.jpg" alt />
                  </span>
                  <header className="major">
                    <h3><a href="../../test/landing.html" className="link">Aliquam</a></h3>
                    <p>Ipsum dolor sit amet</p>
                  </header>
                </article>
                <article>
                  <span className="image">
                    <img src="../../test/images/pic02.jpg" alt />
                  </span>
                  <header className="major">
                    <h3><a href="../../test/landing.html" className="link">Tempus</a></h3>
                    <p>feugiat amet tempus</p>
                  </header>
                </article>
                <article>
                  <span className="image">
                    <img src="../../test/images/pic03.jpg" alt />
                  </span>
                  <header className="major">
                    <h3><a href="../../test/landing.html" className="link">Magna</a></h3>
                    <p>Lorem etiam nullam</p>
                  </header>
                </article>
                <article>
                  <span className="image">
                    <img src="../../test/images/pic04.jpg" alt />
                  </span>
                  <header className="major">
                    <h3><a href="../../test/landing.html" className="link">Ipsum</a></h3>
                    <p>Nisl sed aliquam</p>
                  </header>
                </article>
                <article>
                  <span className="image">
                    <img src="../../test/images/pic05.jpg" alt />
                  </span>
                  <header className="major">
                    <h3><a href="../../test/landing.html" className="link">Consequat</a></h3>
                    <p>Ipsum dolor sit amet</p>
                  </header>
                </article>
                <article>
                  <span className="image">
                    <img src="../../test/images/pic06.jpg" alt />
                  </span>
                  <header className="major">
                    <h3><a href="../../test/landing.html" className="link">Etiam</a></h3>
                    <p>Feugiat amet tempus</p>
                  </header>
                </article>
              </section>
              {/* Two */}
              <section id="two">
                <div className="inner">
                  <header className="major">
                    <h2>Massa libero</h2>
                  </header>
                  <p>Nullam et orci eu lorem consequat tincidunt vivamus et sagittis libero. Mauris aliquet magna magna sed nunc rhoncus pharetra. Pellentesque condimentum sem. In efficitur ligula tate urna. Maecenas laoreet massa vel lacinia pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis libero. Mauris aliquet magna magna sed nunc rhoncus amet pharetra et feugiat tempus.</p>
                  <ul className="actions">
                    <li><a href="../../test/landing.html" className="button next">Get Started</a></li>
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
                        <input type="text" name="email" id="email" />
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

    // <section>
    //   {/* user가 존재하는 경우 UserInfo 컴포넌트를 렌더링합니다. */}
    //   {/* {user && <UserInfo user={user} />} */}
    //   <div id="body"></div>
    // </section>
  )
}

export default Home;
