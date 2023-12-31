import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import hasing from "../../store/hasing";
import PopUp from "../../components/common/PopUp";

function Findpw() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // redux 이용하기

  const idRef = useRef();
  const pnRef = useRef();
  const pwRef = useRef();
  const pwConfirmRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();
  const authRef = useRef();

  const [isActive, setIsActive] = useState(false);
  const [popText, setPopText] = useState("");

  const [blockPhone, setBlockPhone] = useState(false);
  const [blockAuth, setBlockAuth] = useState(true);
  const [blockUp, setBlockUp] = useState(true);

  const is_signed = useSelector((state) => state.myLoginSlice.is_signed);

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/;
    return regex.test(password);
  };
  const isValidPhoneNumber = (phoneNumber) => {
    const regex = /^010-?\d{4}-?\d{4}$/;
    return regex.test(phoneNumber);
  };

  const isValidName = (name) => {
    const regex = /^[가-힣]+$/;
    return regex.test(name);
  };

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const isValidId = (id) => {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(id);
  };

  const ChangePw = async function () {
    if (!isValidPassword(pwRef.current.value)) {
      setPopText(
        "비밀번호는 8자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
      );
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
      return;
    }

    if (pwRef.current.value !== pwConfirmRef.current.value) {
      setPopText("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
      return;
    }

    // 서버 요청 실행
    const res = await axios.post(`/findpw/change`, {
      login_id: idRef.current.value,
      newPassword: await hasing(idRef.current.value + pwRef.current.value),
    });
    //비번변경 성공시

    if (res.data.ok) {
      setPopText(
        "비밀번호가 변경되었습니다. 변경된 비밀번호로 로그인해주세요."
      );
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
      navigate("/");
    } else {
      setPopText("비밀번호가 변경실패했습니다.");
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
    }
  };

  const getAuth = async function () {
    if (!isValidPhoneNumber(pnRef.current.value)) {
      setPopText(
        "핸드폰 번호는 010으로 시작하며, 중간,끝에는 4자리 숫자만 가능합니다."
      );
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
      return;
    }

    const res = await axios.post("/findpw/getauth", {
      login_id: idRef.current.value,
      phone_number: pnRef.current.value,
    });
    if (res.data.ok) {
      setPopText("인증번호를 입력 해 주십시오.");
      setIsActive(true);
      setBlockPhone(true);
      setBlockAuth(false);
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
    } else {
      setPopText("아이디와 핸드폰번호를 다시 입력해 주세요.");
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
    }
  };

  const doAuth = async function () {
    const res = await axios.post("/auth/doauth", {
      login_id: idRef.current.value,
      phone_number: pnRef.current.value,
      authentication_number: authRef.current.value,
    });
    if (res.data.ok) {
      setPopText("인증이 완료되었습니다. 아래정보를 기입해 주세요.");
      setIsActive(true);
      setBlockAuth(true);
      setBlockUp(false);
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
    } else {
      setPopText(
        "인증번호가 잘못되었습니다. 대.소문자를 확인하고 다시 입력해 주세요"
      );
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
    }
  };
  const ingToggle = function () {
    setPopText("서비스 준비예정입니다.");
    setIsActive(true);
    setTimeout(() => {
      setIsActive(false);
    }, 3000);
  };

  if (is_signed) {
    navigate("/");
  }
  return (
    // 이쪽 수정부탁
    <section className="login_page">
      {/* 핸드폰 팝업 */}
      <PopUp body={popText} isActive={isActive} />

      <div className="login-container">
        <img src="/assets/images/newLogo.png" className="login-logo" />
        <form className="login-form">
          {/* <!-- ID input --> */}
          <div className="form-outline mb-0">
            <input
              type="text"
              id="login_id"
              className="form-control"
              ref={idRef}
              readOnly={blockPhone}
              placeholder="아이디"
            />
            <label className="form-label" htmlFor="login_id"></label>
          </div>

          {/* <!-- 핸드폰번호 input  여기에 인증 추가하기--> */}
          <div className="form-outline mb-2">
            <input
              type="text"
              id="phone_number"
              className="form-control"
              ref={pnRef}
              readOnly={blockPhone}
              placeholder="핸드폰 번호"
              style={{ marginBottom: "15px" }}
            />
            <label className="form-label" htmlFor="phone_number"></label>
            {/* <!--인증 --> */}
            <button
              type="button"
              className="btn btn-primary btn-block mb-3"
              disabled={blockPhone}
              onClick={getAuth}
            >
              핸드폰 인증하기
            </button>
            <input
              type="text"
              id="authentication_number"
              className="form-control"
              ref={authRef}
              readOnly={blockAuth}
              placeholder="인증번호"
              style={{ marginBottom: "15px" }}
            />
            <label
              className="form-label"
              htmlFor="authentication_number"
            ></label>
            <button
              type="button"
              className="btn btn-primary btn-block mb-2"
              disabled={blockAuth}
              onClick={doAuth}
            >
              인증번호 제출
            </button>
          </div>

          {/* <!-- 비밀번호 --> */}
          <div className="form-outline mb-0">
            <input
              type="password"
              id="password"
              className="form-control"
              ref={pwRef}
              placeholder="비밀번호"
            />
            <label className="form-label" htmlFor="password"></label>
          </div>

          {/* <!-- 비밀번호 확인 --> */}
          <div className="form-outline mb-0">
            <input
              type="password"
              id="password_confirm"
              className="form-control"
              ref={pwConfirmRef}
              placeholder="비밀번호 확인"
            />
            <label className="form-label" htmlFor="password_confirm"></label>
          </div>

          {/* <!-- Submit button --> */}
          <button
            type="button"
            className="btn btn-primary btn-block mb-0"
            disabled={blockUp}
            onClick={ChangePw}
          >
            비밀번호 변경
          </button>

          {/* <!-- Register buttons --> */}
          <div className="text-center">
            <p>or sign up with:</p>
            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={ingToggle}
            >
              <i className="fab fa-facebook-f"></i>
            </button>

            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={ingToggle}
            >
              <i className="fab fa-google"></i>
            </button>

            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={ingToggle}
            >
              <i className="fab fa-twitter"></i>
            </button>

            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={ingToggle}
            >
              <i className="fab fa-github"></i>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Findpw;
