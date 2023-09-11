import { Link } from "react-router-dom";
import Map from "./map";

const Books= function(){
  return (
    <>
      <div className="second-page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h4>Book Prefered Deal Here</h4>
              <h2>Make Your Reservation</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt uttersi labore et dolore magna aliqua is ipsum suspendisse ultrices gravida</p>
              <div className="main-button"><Link to="/books">Discover More</Link></div>
            </div>
          </div>
        </div>
      </div>


      {/* 지도 위 소제목 */}
      <div className="amazing-deals">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading text-center">
                <h2>지금 바로 축제를 즐기세요!</h2>
                <p>여러분 주위에 여러 행사들이 열려있습니다.<br/>Loca!T와 함께 다양한 축제를 지금 바로 만끽하시길 바랍니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 본문*/}
      <div className="reservation-form">
        <div className="container">
          <div className="row">
            {/* 지도 */}
            <div className="col-lg-12">
              <Map/>
            </div>

            {/* 축제 목록 리스트 */}
            <div className="col-lg-12">
            <div className="amazing-deals">
              <div className="container">

                <div className="row">
                  <div className="col-lg-12 col-sm-3">
                    <div className="item">
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="image">
                            <img src="assets/images/deals-01.jpg" alt="" />
                          </div>
                        </div>
                        <div className="col-lg-6 align-self-center">
                          <div className="content">
                            <span className="info">*궁중 다도 체험</span>
                            <h4>2023년 경복궁 생과방(하반기)</h4>
                            <div className="row">
                              <div className="col-6">
                                <i className="fa fa-clock"></i>
                                <span className="list">2023-09-07 ~ 2023-10-21</span>
                              </div>
                              <div className="col-6">
                                <i className="fa fa-map"></i>
                                <span className="list">다과세트 할인</span>
                              </div>
                            </div>
                            <p>경복궁 생과방에서 진행시 필요한 다과 세트 할인</p>

                          </div>
                        </div>
                        <div className="col-lg-2 align-self-center">
                          <div className="main-button">
                            <Link to="https://www.chf.or.kr/short/8sQs" target="_blank">행사 홈페이지</Link>
                          </div>
                        </div>
                        <div className="col-lg-2 align-self-center">
                          <div className="main-button">
                            <Link to="reservation.html">티켓 구매</Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-sm-3">
                    <div className="item">
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="image">
                            <img src="assets/images/deals-01.jpg" alt="" />
                          </div>
                        </div>
                        <div className="col-lg-6 align-self-center">
                          <div className="content">
                            <span className="info">*궁중 다도 체험</span>
                            <h4>2023년 경복궁 생과방(하반기)</h4>
                            <div className="row">
                              <div className="col-6">
                                <i className="fa fa-clock"></i>
                                <span className="list">2023-09-07 ~ 2023-10-21</span>
                              </div>
                              <div className="col-6">
                                <i className="fa fa-map"></i>
                                <span className="list">다과세트 할인</span>
                              </div>
                            </div>
                            <p>경복궁 생과방에서 진행시 필요한 다과 세트 할인</p>

                          </div>
                        </div>
                        <div className="col-lg-2 align-self-center">
                          <div className="main-button">
                            <Link to="https://www.chf.or.kr/short/8sQs" target="_blank">행사 홈페이지</Link>
                          </div>
                        </div>
                        <div className="col-lg-2 align-self-center">
                          <div className="main-button">
                            <Link to="reservation.html">티켓 구매</Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-3">
                    <div className="item">
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="image">
                            <img src="assets/images/deals-01.jpg" alt="" />
                          </div>
                        </div>
                        <div className="col-lg-6 align-self-center">
                          <div className="content">
                            <span className="info">*궁중 다도 체험</span>
                            <h4>2023년 경복궁 생과방(하반기)</h4>
                            <div className="row">
                              <div className="col-6">
                                <i className="fa fa-clock"></i>
                                <span className="list">2023-09-07 ~ 2023-10-21</span>
                              </div>
                              <div className="col-6">
                                <i className="fa fa-map"></i>
                                <span className="list">다과세트 할인</span>
                              </div>
                            </div>
                            <p>경복궁 생과방에서 진행시 필요한 다과 세트 할인</p>

                          </div>
                        </div>
                        <div className="col-lg-2 align-self-center">
                          <div className="main-button">
                            <Link to="https://www.chf.or.kr/short/8sQs" target="_blank">행사 홈페이지</Link>
                          </div>
                        </div>
                        <div className="col-lg-2 align-self-center">
                          <div className="main-button">
                            <Link to="reservation.html">티켓 구매</Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>




                  <div className="col-lg-12">
                    <ul className="page-numbers">
                      <li><Link to="#"><i className="fa fa-arrow-left"></i></Link></li>
                      <li><Link to="#">1</Link></li>
                      <li className="active"><Link to="#">2</Link></li>
                      <li><Link to="#">3</Link></li>
                      <li><Link to="#"><i className="fa fa-arrow-right"></i></Link></li>
                    </ul>
                  </div>
                  
                </div>
              </div>
            </div>
              
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Books;