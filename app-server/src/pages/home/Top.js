import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Top() {
  const is_signed = useSelector((state) => state.myLoginSlice.is_signed);
  return (
    <section id="section-1">
      <div className="content-slider">
        <input
          type="radio"
          id="banner1"
          className="sec-1-input"
          name="banner"
          defaultChecked
        />
        <input
          type="radio"
          id="banner2"
          className="sec-1-input"
          name="banner"
        />
        <input
          type="radio"
          id="banner3"
          className="sec-1-input"
          name="banner"
        />
        <input
          type="radio"
          id="banner4"
          className="sec-1-input"
          name="banner"
        />
        <div className="slider">
          <div id="top-banner-1" className="banner">
            <div className="banner-inner-wrapper header-text">
              <div className="main-caption">
                <h2>시원하게 펼쳐진 포항의 바다를 한눈에 담아보자 !</h2>
                <h1>포항 이가리닻</h1>
                {/* 회원가입 페이지로 이동 */}
                <div className="border-button">
                  {is_signed ? "" : <Link to="/login">지금 가입하기</Link>}
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="more-info">
                      <div className="row">
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-user"></i>
                          <h4>
                            <span>Population:</span>
                            <br />
                            44.48 M
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-globe"></i>
                          <h4>
                            <span>Territory:</span>
                            <br />
                            275.400 KM<em>2</em>
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-home"></i>
                          <h4>
                            <span>AVG Price:</span>
                            <br />
                            $946.000
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <div className="main-button">
                            {/* 추천 행사로 이동 */}
                            <Link to="/deals">Explore More</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="top-banner-2" className="banner">
            <div className="banner-inner-wrapper header-text">
              <div className="main-caption">
                <h2>물 위를 걷는 느낌</h2>
                <h1>속초 영랑호수윗길</h1>
                <div className="border-button">
                  {is_signed ? "" : <Link to="/login">지금 가입하기</Link>}
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="more-info">
                      <div className="row">
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-user"></i>
                          <h4>
                            <span>Population:</span>
                            <br />
                            8.66 M
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-globe"></i>
                          <h4>
                            <span>Territory:</span>
                            <br />
                            41.290 KM<em>2</em>
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-home"></i>
                          <h4>
                            <span>AVG Price:</span>
                            <br />
                            $1.100.200
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <div className="main-button">
                            <Link to="about.html">Explore More</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="top-banner-3" className="banner">
            <div className="banner-inner-wrapper header-text">
              <div className="main-caption">
                <h2>
                  계절에 따라 색을 입는 댑싸리의 향연에 여러분을 초대합니다
                </h2>
                <h1>연천 댑싸리공원</h1>
                <div className="border-button">
                  {is_signed ? "" : <Link to="/login">지금 가입하기</Link>}
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="more-info">
                      <div className="row">
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-user"></i>
                          <h4>
                            <span>Population:</span>
                            <br />
                            67.41 M
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-globe"></i>
                          <h4>
                            <span>Territory:</span>
                            <br />
                            551.500 KM<em>2</em>
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-home"></i>
                          <h4>
                            <span>AVG Price:</span>
                            <br />
                            $425.600
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <div className="main-button">
                            <Link to="about.html">Explore More</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="top-banner-4" className="banner">
            <div className="banner-inner-wrapper header-text">
              <div className="main-caption">
                <h2>자연을 느끼고 싶다면 태백으로 놀어오세요</h2>
                <h1>태백 당골광장</h1>
                <div className="border-button">
                  {is_signed ? "" : <Link to="/login">지금 가입하기</Link>}
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="more-info">
                      <div className="row">
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-user"></i>
                          <h4>
                            <span>Population:</span>
                            <br />
                            69.86 M
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-globe"></i>
                          <h4>
                            <span>Territory:</span>
                            <br />
                            513.120 KM<em>2</em>
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <i className="fa fa-home"></i>
                          <h4>
                            <span>AVG Price:</span>
                            <br />
                            $165.450
                          </h4>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-6">
                          <div className="main-button">
                            <Link to="about.html">Explore More</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav>
          <div className="controls">
            <label htmlFor="banner1">
              <span className="progressbar">
                <span className="progressbar-fill"></span>
              </span>
              <span className="text">1</span>
            </label>
            <label htmlFor="banner2">
              <span className="progressbar">
                <span className="progressbar-fill"></span>
              </span>
              <span className="text">2</span>
            </label>
            <label htmlFor="banner3">
              <span className="progressbar">
                <span className="progressbar-fill"></span>
              </span>
              <span className="text">3</span>
            </label>
            <label htmlFor="banner4">
              <span className="progressbar">
                <span className="progressbar-fill"></span>
              </span>
              <span className="text">4</span>
            </label>
          </div>
        </nav>
      </div>
    </section>
  );
}

export default Top;
