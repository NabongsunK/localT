import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import localInfos from "../../data/localInfos.json";
import { pushList, setPageList } from "../../store/pageSlice";
import { setMapItude } from "../../store/mapSlice";

import styles from "./map.module.css";
import { useNavigate } from "react-router";

var markerHeight = { 28: 144, 14: 216, 15: 0, 39: 36 };
// var markerImageSrc =
//   "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png"; // 마커이미지의 주소입니다. 스프라이트 이미지 입니다
var markerImageSrc =
  "https://korean.visitkorea.or.kr/resources/images/location/icon_depth1_menu_on.png"; // 마커이미지의 주소입니다. 스프라이트 이미지 입니다

var imgdefault = "/assets/images/fes_default.jpg";

//스크립트로 가져온 kakao map api를 윈도우 전역객체에서 받아옴
const { kakao } = window;

const handleOpenNewTab = (url) => {
  window.open(url, "_blank", "noopener, noreferrer");
};

const Map = function (props) {
  // 여긴 나중에 주차장 들어오면 추가하고 이미지도 수정해야할듯+상세정보 보기도 추가
  const mapItude = useSelector((state) => state.myMapSlice.mapItude);
  const mapData = useSelector((state) => state.myMapSlice.mapData);
  const regionId = useSelector((state) => state.myMapSlice.regionId);
  const navigate = useNavigate();
  const map = useRef();
  const clusterer = useRef(null);
  const [curType, setCurType] = useState([15]);

  let polygons = useRef([]);
  var openOverlay = [null, null];
  const dispatch = useDispatch();
  const allList = useSelector((state) => state.myPageSlice.allList);

  var markers_group = useRef([
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
    { 14: [], 15: [], 39: [], 28: [] },
  ]);
  const menusRefs = {
    14: useRef(null),
    15: useRef(null),
    39: useRef(null),
    28: useRef(null),
  };

  function getInfo() {
    // 지도의 현재 중심좌표를 얻어옵니다
    var center = map.current.getCenter();

    var message = "지도 중심좌표는 위도 " + center.getLat() + ", <br>";
    message += "경도 " + center.getLng() + " 이고 <br>";
    dispatch(
      setMapItude({ newMapItude: [center.getLng(), center.getLat(), 4] })
    );
  }

  function makeInfo(position, marker) {
    // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
    var content = document.createElement("div");
    content.className = styles.wrap;

    var info = document.createElement("div");
    info.className = styles.info;
    content.appendChild(info);

    var title = document.createElement("div");
    title.className = styles.title;
    title.onclick = function () {
      if (position.content_type_id === "15") {
        navigate("/explore/" + position.id);
      }
    };
    title.appendChild(
      document.createTextNode(
        position.title.substring(0, 14) +
          (position.title.length > 14 ? "..." : "")
      )
    );
    info.appendChild(title);

    var close = document.createElement("div");
    close.className = styles.close;
    // 닫기 이벤트 추가
    close.onclick = function () {
      overlay.setMap(null);
    };
    content.appendChild(close);

    var closeI = document.createElement("i");
    closeI.className = "fa fa-close";
    close.appendChild(closeI);

    var body = document.createElement("div");
    body.className = styles.body;
    info.appendChild(body);

    if (position.content_type_id == 15 || position.content_type_id == 14) {
      var imgDiv = document.createElement("div");
      imgDiv.className = styles.img;
      imgDiv.onclick = function () {
        navigate("/explore/" + position.id);
      };
      body.appendChild(imgDiv);

      var img = document.createElement("img");
      img.src = position.first_image2 ? position.first_image2 : imgdefault;
      imgDiv.appendChild(img);
    }

    var desc;
    if (position.content_type_id == 15 || position.content_type_id == 14) {
      desc = document.createElement("div");
      desc.className = styles.desc;
      desc.id = styles.desc15;
      body.appendChild(desc);
    } else {
      desc = document.createElement("div");
      desc.className = styles.desc;
      body.appendChild(desc);
    }

    var ellipsis = document.createElement("div");
    ellipsis.className = styles.ellipsis;
    ellipsis.appendChild(document.createTextNode(position.addr1));
    desc.appendChild(ellipsis);

    var findDesc = document.createElement("button");
    findDesc.className = styles.findDesc;
    findDesc.onclick = () => {
      handleOpenNewTab(
        "https://map.kakao.com/link/to/" +
          position.title +
          "," +
          position.map_y +
          "," +
          position.map_x
      );
    };

    var findDescI = document.createElement("i");
    findDescI.className = "fa fa-map";
    findDesc.appendChild(findDescI);
    desc.appendChild(findDesc);

    // 마커 위에 커스텀오버레이를 표시합니다
    // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
    var overlay = new kakao.maps.CustomOverlay({
      content: content,
      position: marker.getPosition(),
    });
    return overlay;
  }

  function changeMarker(type) {
    var newCurType = curType;
    if (curType.indexOf(type) == -1) {
      newCurType.push(type);
      setCurType(newCurType);
    } else {
      newCurType.splice(curType.indexOf(type), 1);
      setCurType(newCurType);
    }
    clusterer.current.clear();
    [14, 15, 39, 28].forEach((tp) => {
      if (curType.indexOf(tp) != -1) {
        menusRefs[tp].current.className = styles.menu_selected;
        setMarkers(map.current, tp);
        //TODO: 현재는 주차장일때 클러스터러를 표시 안하는 방식으로 했지만, 서버에서 클러스터러된 정보를 직접 보내는 경우도 생각해 볼것
        clusterer.current.addMarkers(markers_group.current[regionId][tp]);
      } else {
        menusRefs[tp].current.className = "";
        setMarkers(null, tp);
      }
    });
  }

  function closeAllOverlay() {
    if (openOverlay[0]) {
      openOverlay[0].setMap(null);
    }
    openOverlay[0] = openOverlay[1];
  }

  // 마커들의 지도 표시 여부를 설정하는 함수입니다
  function setMarkers(map, type) {
    for (var i = 0; i < markers_group.current[regionId][type].length; i++) {
      markers_group.current[regionId][type][i].setMap(map);
      // 클러스터러에 마커들을 추가합니다
    }
  }

  //첫마운트 될때,
  useEffect(function () {
    map.current = new kakao.maps.Map(map.current, {
      // 지도를 표시할 div
      center: new kakao.maps.LatLng(35.95, 128.25), // 지도의 중심좌표
      level: mapItude[2], // 지도의 확대 레벨
    });
    // 마커 클러스터러를 생성합니다
    clusterer.current = new kakao.maps.MarkerClusterer({
      map: map.current, // 마커들을 클러스터로 관리하고 표시할 지도 객체
      averageCenter: false, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
      minClusterSize: 4, // 클러스터에 포함시킬 마커의 갯수
      minLevel: 2, // 클러스터 할 최소 지도 레벨
    });
  }, []);

  // mapdata 바뀔때
  useEffect(
    function () {
      for (let i = 1; i < 19; i++) {
        for (var key in mapData[localInfos[i].area_code]) {
          // 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
          var markers = mapData[localInfos[i].area_code][key].map(function (
            position
          ) {
            // 마커이미지와 마커를 생성합니다
            var imageSize = new kakao.maps.Size(37, 36),
              imageOptions = {
                // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                spriteOrigin: new kakao.maps.Point(0, markerHeight[key]),
                // 스프라이트 이미지의 전체 크기
                spriteSize: new kakao.maps.Size(37, 360),
              };
            var markerImage = new kakao.maps.MarkerImage(
              // 이미지 주소
              markerImageSrc,
              // 마커의 크기
              imageSize,
              imageOptions
            );
            var marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(position.map_y, position.map_x),
              clickable: true,
              image: markerImage,
            });

            // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
            kakao.maps.event.addListener(marker, "click", function () {
              navigate("/explore");
              var overlay = makeInfo(position, marker);
              openOverlay[1] = overlay;
              closeAllOverlay();
              overlay.setMap(map.current);
              if (position.content_type_id === "15") {
                const festival = allList.filter(
                  (fes) => fes.id === Number(position.id)
                )[0];
                dispatch(pushList({ newPage: festival }));
              }
            });

            return marker;
          });
          markers_group.current[i][key] = markers;
        }
      }
      changeMarker(curType);
    },
    [mapData]
  );

  // mapItude변경될때
  useEffect(
    function () {
      const boundary = localInfos[regionId].boundary;
      if (boundary) {
        boundary.forEach((ss) => {
          var path = [];
          ss.forEach((x) => {
            path.push(new kakao.maps.LatLng(x[1], x[0]));
          });

          // 다각형을 생성하고 지도에 표시합니다
          let polygon = new kakao.maps.Polygon({
            map: map.current,
            path: [path], // 좌표 배열의 배열로 하나의 다각형을 표시할 수 있습니다
            strokeWeight: 2,
            strokeColor: "#b26bb2",
            strokeOpacity: 0.3,
            fillColor: "#f9f",
            fillOpacity: 0.2,
          });

          polygons.current.push(polygon);
          //지도에 다각형을 보이게합니다.
          polygon.setMap(map.current);
        });
      }
      changeMarker(curType);
      return () => {
        if (boundary) {
          polygons.current.forEach((pl) => {
            pl.setMap(null);
            delete polygons[0];
          });
        }
      };
    },
    [regionId]
  );
  // mapItude바뀌면 위치바뀜
  useEffect(() => {
    if (mapItude[1]) {
      map.current.setCenter(new kakao.maps.LatLng(mapItude[1], mapItude[0]));
      map.current.setLevel(mapItude[2]);
    }
  }, [mapItude]);

  return (
    <div id={styles.mapwrap}>
      <div ref={map} id={styles.map}></div>
      {/* <div onClick={getInfo}>버튼</div> */}
      <div className={styles.category}>
        <ul>
          <li ref={menusRefs[15]} onClick={() => changeMarker(15)}>
            <span className={styles.ico_festival}></span>
            축제
          </li>
          <li ref={menusRefs[39]} onClick={() => changeMarker(39)}>
            <span className={styles.ico_food}></span>
            음식점
          </li>
          <li ref={menusRefs[28]} onClick={() => changeMarker(28)}>
            <span className={styles.ico_carpark}></span>
            주차장
          </li>
          <li ref={menusRefs[14]} onClick={() => changeMarker(14)}>
            <span className={styles.ico_culture}></span>
            문화시설
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Map;
