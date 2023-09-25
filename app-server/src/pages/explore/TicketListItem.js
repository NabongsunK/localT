import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import TicketDetailItem from "./TicketDetailItem";

import { push, pop } from "../../store/cartSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// axios 기본 url 정의
axios.defaults.baseURL = "http://localhost:4400/api";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    // 여기 수정하면 모달창 크기조절
    height: "70vh",
    width: "50vw",
    //marginRight: "-50%",
    transform: "translate(-50%, -50%)",

    //모달 창 뒤로 배경 너무 뿌옇게 나오는 거 해결 필요!
    /* 모달 창을 위한 스타일 설정 */
    backgroundColor: "rgba(255, 255, 255, 0.9)", // 배경을 투명하지 않게 설정
    padding: "50px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 3)", // 모달에 그림자 효과 추가
    //Index: 1000, // 모달을 다른 요소 위에 표시

    // 뒷 배경을 조절하기 위한 스타일 설정
    backdropFilter: "sepia(90%)", //왜 적용이 안되는 것인가
  },
};

const TicketListItem = function (props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const appElement = document.getElementById("root");
  const dispatch = useDispatch();
  const myCart = useSelector((state) => state.myCartSlice.myCarts);
  if (appElement) {
    Modal.setAppElement(appElement);
  } else {
    console.error("App element not found!");
  }
  function openModal() {
    setIsOpen(!modalIsOpen);
  }

  const toCart = function () {
    dispatch(
      push({
        ticket: {
          // 여기 지역추가
          badge: props.festival.addr1 + " " + props.festival.addr2,
          name: props.festival.title,
          quantity: 1,
          // 여기 가격추가
          price: props.festival.id,
          image: props.festival.first_image2,
          ticket_id: props.festival.id,
          index: myCart.length,
        },
      })
    );
  };
  const img = props.festival.first_image2;
  console.log(img);
  const poster =
    props.festival.first_image2 === "" ? (
      <Link to={`/explore/${props.id}`}>
        <div
          className="image"
          style={{
            backgroundImage: "url('/assets/images/fes_default.jpg')",
            width: "100%",
            height: "100%",
            backgroundSize: "cover",
          }}
        ></div>
      </Link>
    ) : (
      <Link to={`/explore/${props.festival.id}`}>
        <div
          className="image"
          style={{
            backgroundImage: `url("${img}")`,
            width: "100%",
            height: "100%",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </Link>
    );
  return (
    <div className="col-lg-6 col-sm-3">
      <div className="item">
        <div className="row">
          <div className="col-lg-3">
            {/* 축제 사진 */}
            {poster}
          </div>
          <div
            className="col-lg-7 align-self-center"
            onClick={openModal}
            style={{ cursor: "pointer" }}
          >
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={openModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <TicketDetailItem
                festival={props.festival}
                openModal={openModal}
                toCart={toCart}
              />
            </Modal>

            <div className="content">
              <span className="info">
                *D-{props.festival.d_day}
                끝나요
              </span>
              <h4>{props.festival.title}</h4>
              <div className="row">
                <div className="col-12">
                  <i className="fa fa-clock"></i>
                  <span className="list">
                    {"  "}
                    {props.festival.event_start_date} ~{" "}
                    {props.festival.event_end_date}
                  </span>
                </div>
              </div>
              <p>
                {props.festival.over_view.substring(0, 38)}{" "}
                {props.festival.over_view.length > 38 ? ". . ." : ""}
              </p>
            </div>
          </div>
          <div className="col-lg-2 align-self-center">
            {/* 홈페이지 연결 */}
            <div className="explore_list_button">
              <Link to={props.festival.home_page} target="_blank">
                <i className="fa fa-home"></i>
              </Link>
            </div>

            {/* 장바구니 담기 */}
            <div className="explore_list_button" onClick={toCart}>
              <Link onClick={props.alertHandler}>
                <i className="fa fa-cart-plus"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketListItem;
