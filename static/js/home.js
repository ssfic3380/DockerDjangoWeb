/* --------------------VARIABLES-------------------- */
/* 마우스 드래그 */
var svg; // svg의 정보
var bb; // svg의 위치 정보
var iFigureX, iFigureY; // 도형의 위치 정보
var iStartX, iStartY; // 옮기기 시작한 위치 정보
var iX, iY; // 옮겨진 위치

var isDrawLine = 0; // 현재 line을 그리고 있는가
var currentLine;
var currentOperator = null;
var currentText = null;
var afterClick = 0;

/* Operator, Result 개수 */
var opCount = 1;
var resCount = 1;


/* Operator 도형 설정 */
var opPortDistance = 20; // Operator와 Port의 y축 거리
var opRectWidth = 150; // Operator 가로 길이
var opRectHeight = 100; // Operator 세로 길이

var opIPr = 10; // Input Port 반지름
var opOPr = 10; // Output Port 반지름

var opTextLoc = 10;


/* --------------------FUNCTIONS-------------------- */
/* operatorsRect 마우스 클릭, 이동 이벤트 핸들러 등록 */
function opAddListener(items) {
   for (var i = 0; i < items.length; ++i) {
      items[i].addEventListener("click", opClick);
   }
}
/* operatorsRect 마우스 왼쪽 클릭 이벤트 핸들러 */
function opClick(e) {

   /* Operator 도형 설정 (일부는 위에 있음) */
   var opRectStartX = String(170 + (opCount%10)*10); // Operator 시작점 x좌표
   var opRectStartY = String(140 + (opCount%10)*10); // Operator 시작점 y좌표
   var opRectStyle = "fill:rgba(250, 236, 197, 1); stroke: rgba(189, 189, 189, 1); stroke-width: 2;"; // Operator 꾸미기

   var opIPcx = opRectStartX; // Input Port 중심점 x좌표
   var opIPcy = String(Number(opRectStartY) + opPortDistance); // Input Port 중심점 y좌표
   var opIPStyle = "fill:rgba(178, 204, 255, 1); stroke: rgba(103, 153, 255, 1); stroke-width: 1;"; // Input Port 꾸미기

   var opOPcx = String(Number(opRectStartX) + opRectWidth); // Output Port 중심점 x좌표
   var opOPcy = opIPcy; // Output Port 중심점 y좌표
   var opOPStyle = "fill:rgba(255, 167, 167, 1); stroke: rgba(241, 95, 95, 1); stroke-width: 1;"; // Output Port 꾸미기

   var opTextX = opRectStartX;
   var opTextY = opRectStartY - opTextLoc;
   var opTextStyle = "fill:rgba(0, 0, 0, 1); font-size:12px; font-weight:bold;";


   /* 선택된 Operator의 이름 가져오기 및 하위 도형 이름 설정 */
   var opName = e.target.getAttribute("value");
   var gID = opName + "G_" + opCount;
   var ipID = opName + "IP_" + opCount;
   var opID = opName + "OP_" + opCount;
   var rectID = opName + "Rect_" + opCount;
   var textID = opName + "Text_" + opCount;


   /* Operator 클릭 시, Process창에 해당 operator를 추가 */
   // 1. <g> 추가
   var tempG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
   tempG.setAttribute("id", gID);

   // 2. <circle> 추가 (Input port)
   var tempIP = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
   tempIP.setAttribute("class", "processIP");
   tempIP.setAttribute("id", ipID);
   tempIP.setAttribute("num", opCount);
   tempIP.setAttribute("operator", opName);
   tempIP.setAttribute("group", gID);
   tempIP.setAttribute("rect", rectID);
   tempIP.setAttribute("op", opID);
   tempIP.setAttribute("line", "none");
   tempIP.setAttribute("cx", opIPcx);
   tempIP.setAttribute("cy", opIPcy);
   tempIP.setAttribute("r", String(opIPr));
   tempIP.setAttribute("style", opIPStyle);
   //portAddListener(tempIP);
   tempG.appendChild(tempIP);

   // 3. <circle> 추가 (Output port)
   var tempOP = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
   tempOP.setAttribute("class", "processOP");
   tempOP.setAttribute("id", opID);
   tempOP.setAttribute("num", opCount);
   tempOP.setAttribute("operator", opName);
   tempOP.setAttribute("group", gID);
   tempOP.setAttribute("rect", rectID);
   tempOP.setAttribute("ip", ipID);
   tempOP.setAttribute("line", "none");
   tempOP.setAttribute("cx", opOPcx);
   tempOP.setAttribute("cy", opOPcy);
   tempOP.setAttribute("r", String(opOPr));
   tempOP.setAttribute("style", opOPStyle);
   //portAddListener(tempOP);
   tempG.appendChild(tempOP);

   // 4. <rect> 추가 (Operator)
   var tempRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
   tempRect.setAttribute("class", "processRect");
   tempRect.setAttribute("id", rectID);
   tempRect.setAttribute("num", opCount);
   tempRect.setAttribute("operator", opName);
   tempRect.setAttribute("group", gID);
   tempRect.setAttribute("ip", ipID);
   tempRect.setAttribute("op", opID);
   tempRect.setAttribute("ipLine", "none");
   tempRect.setAttribute("opLine", "none");
   tempRect.setAttribute("text", textID);
   tempRect.setAttribute("x", opRectStartX);
   tempRect.setAttribute("y", opRectStartY);
   tempRect.setAttribute("width", String(opRectWidth));
   tempRect.setAttribute("height", String(opRectHeight));
   tempRect.setAttribute("style", opRectStyle);
   //prAddListener(tempRect);
   tempG.appendChild(tempRect);

   // 5. <text> 추가 (Operator name)
   var tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
   tempText.setAttribute("class", "prcessText");
   tempText.setAttribute("id", textID);
   tempText.setAttribute("num", opCount);
   tempText.setAttribute("operator", opName);
   tempText.setAttribute("group", gID);
   tempText.setAttribute("x", opTextX);
   tempText.setAttribute("y", opTextY);
   tempText.setAttribute("style", opTextStyle);
   tempText.textContent = opName;
   tempG.appendChild(tempText);
   


   document.getElementById("processSVG").appendChild(tempG);
   portAddListener(document.getElementsByClassName("processIP"));
   portAddListener(document.getElementsByClassName("processOP"));
   prAddListener(document.getElementsByClassName("processRect"));
   opCount++;
}


/* processRect 마우스 클릭, 이동 이벤트 핸들러 등록 */
function prAddListener(items) {
   for (var i = 0; i < items.length; ++i) {
      items[i].addEventListener("mousemove", prMousemove);
      items[i].addEventListener("mousedown", prMousedown);
      items[i].addEventListener("mouseup", prMouseup);
      items[i].addEventListener("click", prClick);
      items[i].addEventListener("dblclick", prDblclick);
   }

}

/* processRect 마우스 왼쪽 클릭 이벤트 핸들러 */
function prMousedown(e) {
   iStartX = e.clientX - bb.left;
   iStartY = e.clientY - bb.top;
   iFigureX = parseInt(e.target.getAttribute("x"));
   iFigureY = parseInt(e.target.getAttribute("y"));
   e.target.setAttribute("isDrag", 1);
}

/* processRect 마우스 드래그 이벤트 핸들러 */
function prMousemove(e) {
   var iIsDrag = e.target.getAttribute("isDrag");
   if (iIsDrag) {
      iIsDrag = parseInt(iIsDrag);
      if (iIsDrag == 1) {
         /* Operator */
         iX = (e.clientX - bb.left) - iStartX + iFigureX;
         iY = (e.clientY - bb.top) - iStartY + iFigureY;
         e.target.setAttribute("x", iX);
         e.target.setAttribute("y", iY);

         /* Input Port */
         var ip = document.getElementById(e.target.getAttribute("ip"));
         ip.setAttribute("cx", iX);
         ip.setAttribute("cy", iY + opPortDistance);

         /* Output Port */
         var op = document.getElementById(e.target.getAttribute("op"));
         op.setAttribute("cx", iX + opRectWidth);
         op.setAttribute("cy", iY + opPortDistance);

         /* Input Line */
         var ipLine = document.getElementById(e.target.getAttribute("ipLine"));
         if (ipLine != null) {
            ipLine.setAttribute("x2", iX - opIPr);
            ipLine.setAttribute("y2", iY + opPortDistance);
         }

         /* Output Line */
         var opLine = document.getElementById(e.target.getAttribute("opLine"));
         if (opLine != null) {
            opLine.setAttribute("x1", iX + opRectWidth + opIPr);
            opLine.setAttribute("y1", iY + opPortDistance);
         }

         /* Text */
         var text = document.getElementById(e.target.getAttribute("text"));
         text.setAttribute("x", iX);
         text.setAttribute("y", iY - opTextLoc);

      }
   }
}
/* processRect 마우스 왼쪽 클릭 해제 이벤트 핸들러 */
function prMouseup(e) {
   var iIsDrag = e.target.getAttribute("isDrag");
   if (iIsDrag) {
      iIsDrag = parseInt(iIsDrag);
      if (iIsDrag == 1) {
         /* Operator */
         iX = (e.clientX - bb.left) - iStartX + iFigureX;
         iY = (e.clientY - bb.top) - iStartY + iFigureY;
         e.target.setAttribute("x", iX);
         e.target.setAttribute("y", iY);
         e.target.setAttribute("isDrag", 0);

         /* Input Port */
         var ip = document.getElementById(e.target.getAttribute("ip"));
         ip.setAttribute("cx", iX);
         ip.setAttribute("cy", iY + opPortDistance);
         
         /* Output Port */
         var op = document.getElementById(e.target.getAttribute("op"));
         op.setAttribute("cx", iX + opRectWidth);
         op.setAttribute("cy", iY + opPortDistance);

         /* Input Line */
         var ipLine = document.getElementById(e.target.getAttribute("ipLine"));
         if (ipLine != null) {
            ipLine.setAttribute("x2", iX - opIPr);
            ipLine.setAttribute("y2", iY + opPortDistance);
         }
         
         /* Output Line */
         var opLine = document.getElementById(e.target.getAttribute("opLine"));
         if (opLine != null) {
            opLine.setAttribute("x1", iX + opRectWidth + opIPr);
            opLine.setAttribute("y1", iY + opPortDistance);
         }

         /* Text */
         var text = document.getElementById(e.target.getAttribute("text"));
         text.setAttribute("x", iX);
         text.setAttribute("y", iY - opTextLoc);
      }
   }
}
/* processRect 마우스 왼쪽 클릭 이벤트 핸들러 */
function prClick(e) {
   afterClick = 1;

   if (currentOperator == null) {
      currentOperator = document.getElementById(e.target.getAttribute("id"));
      currentText = document.getElementById(currentOperator.getAttribute("text"));
      currentOperator.setAttribute("style", "fill:rgba(250, 236, 197, 1); stroke: rgba(152, 0, 0, 1); stroke-width: 2;");
      currentText.setAttribute("style", "fill:rgba(152, 0, 0, 1); font-size:12px; font-weight:bold;")
   } else if (currentOperator != document.getElementById(e.target.getAttribute("id"))) {
      // 이전에 선택되어 있던 Operator는 원래 색깔로
      currentOperator.setAttribute("style", "fill:rgba(250, 236, 197, 1); stroke: rgba(189, 189, 189, 1); stroke-width: 2;");
      currentText.setAttribute("style", "fill:rgba(0, 0, 0, 1); font-size:12px; font-weight:bold;");

      // 이번에 선택된 Operator의 색깔 변경
      currentOperator = document.getElementById(e.target.getAttribute("id"));
      currentText = document.getElementById(currentOperator.getAttribute("text"));
      currentOperator.setAttribute("style", "fill:rgba(250, 236, 197, 1); stroke: rgba(152, 0, 0, 1); stroke-width: 2;");
      currentText.setAttribute("style", "fill:rgba(152, 0, 0, 1); font-size:12px; font-weight:bold;");
   }
}

/* processRect 마우스 더블클릭 이벤트 핸들러 */
function prDblclick(e) {
   //var url = ;
   $.ajax({
      type: 'POST',
      url:"/simpleweb/result/",
      target:'_blank',
      data: {
          "OpId": e.target.getAttribute("id"),          
          "processName":document.getElementById("processName").value
          //csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
      },
      success:function(context) {
         var w = window.open('/simpleweb/result/',"popup","width=700,height=700,scrollbars = yes");
         w.document.open();
         w.document.write(context);
         //window.open("/simpleweb/result/" , '_blank',context);
          console.log("success");
      },
      error: function(data) {
         console.log(data);
          console.log("error");
      }

   });
   //sendPost(url, arr);
}


/* I/O Port 마우스 클릭, 이동 이벤트 핸들러 등록 */
function portAddListener(items) {
   for (var i = 0; i < items.length; ++i) {
      items[i].addEventListener("click", portClick);
   }
}

/* I/O Port 마우스 왼쪽 클릭 이벤트 핸들러 */
function portClick(e) {
   afterClick = 1;

   if (isDrawLine == 0) { // line의 시작점인 경우

      var opLineStyle = "stroke: rgba(189, 189, 189, 1); stroke-width: 1;"
      var lineID;

      if (e.target.getAttribute("class") == "processIP" || e.target.getAttribute("class") == "processOP") { // Operator에서 연결하는 경우

         var rect = document.getElementById(e.target.getAttribute("rect"));
         if (e.target.getAttribute("class") == "processIP") lineID = e.target.getAttribute("operator") + "IPLine_" + e.target.getAttribute("num");
         else if (e.target.getAttribute("class") == "processOP") lineID = e.target.getAttribute("operator") + "OPLine_" + e.target.getAttribute("num");

         /* 위치 정보 획득 */
         iStartX = e.clientX - bb.left;
         iStartY = e.clientY - bb.top;
         iFigureX = parseInt(e.target.getAttribute("cx"));
         iFigureY = parseInt(e.target.getAttribute("cy"));


         /* 이미 line이 있었을 경우 */
         if (e.target.getAttribute("line") != "none") {
            var line = document.getElementById(e.target.getAttribute("line"));
            
            /* 현재 port에서 정보를 지움 */
            e.target.setAttribute("line", "none");
            if (e.target.getAttribute("class") == "processIP") rect.setAttribute("ipLine", "none");
            else if (e.target.getAttribute("class") == "processOP") rect.setAttribute("opLine", "none");

            /* 이어져있던 operator에서 line 정보를 지움 */
            if (e.target.getAttribute("class") == "processOP") { // 현재 port가 Output port (= 이어진 operator는 Input port)
               var ip = document.getElementById(line.getAttribute("next"));
               ip.setAttribute("line", "none");

               if (ip.getAttribute("class") != "processResult") { // 이어진 operator가 Result port면 건너뜀
                  var ipRect = document.getElementById(ip.getAttribute("rect"));
                  ipRect.setAttribute("ipLine", "none");
               } else {
                  resCount--;
               }

            } else if (e.target.getAttribute("class") == "processIP") { // 현재 port가 Input port (= 이어진 operator는 Output port)
               var op = document.getElementById(line.getAttribute("prev"));
               op.setAttribute("line", "none");
      
               var opRect = document.getElementById(op.getAttribute("rect"));
               opRect.setAttribute("opLine", "none");
            }

            line.remove();
         }


         /* 새로운 line 그리기 */
         var tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
         tempLine.setAttribute("class", "processLine"); // class 설정
         tempLine.setAttribute("id", lineID); // id 설정
         if (e.target.getAttribute("class") == "processIP") { // input port일 경우
            tempLine.setAttribute("prev", "none"); // output port에서 (이후에 연결 완료됐을 때 설정 됨)
            tempLine.setAttribute("next", e.target.getAttribute("id")); // intput port로
            tempLine.setAttribute("x1", e.clientX - bb.left); // 시작점 x좌표 (이후에 연결 완료됐을 때 설정 됨)
            tempLine.setAttribute("y1", e.clientY - bb.top); // 시작점 y좌표 (이후에 연결 완료됐을 때 설정 됨)
            tempLine.setAttribute("x2", iFigureX - opIPr); // 끝점 x좌표
            tempLine.setAttribute("y2", iFigureY); // 끝점 y좌표
         } 
         else if (e.target.getAttribute("class") == "processOP") { // output port일 경우
            tempLine.setAttribute("prev", e.target.getAttribute("id")); // input port에서
            tempLine.setAttribute("next", "none"); // output port로 (이후에 연결 완료됐을 때 설정 됨)
            tempLine.setAttribute("x1", iFigureX + opIPr); // 시작점 x좌표
            tempLine.setAttribute("y1", iFigureY); // 시작점 y좌표
            tempLine.setAttribute("x2", e.clientX - bb.left); // 끝점 x좌표 (이후에 연결 완료됐을 때 설정 됨)
            tempLine.setAttribute("y2", e.clientY - bb.top); // 끝점 y좌표 (이후에 연결 완료됐을 때 설정 됨)
         }
         tempLine.setAttribute("style", opLineStyle); // style 설정

         e.target.setAttribute("line", lineID);
         if (e.target.getAttribute("class") == "processIP") rect.setAttribute("ipLine", lineID);
         else if (e.target.getAttribute("class") == "processOP") rect.setAttribute("opLine", lineID);
         document.getElementById(e.target.getAttribute("group")).appendChild(tempLine);


      } else if (e.target.getAttribute("class") == "processResult") { // Result에서 연결하는 경우

         lineID = "ResultLine_" + e.target.getAttribute("resnum");

         /* 위치 정보 획득 */
         iStartX = e.clientX - bb.left;
         iStartY = e.clientY - bb.top;
         iFigureX = parseInt(e.target.getAttribute("cx"));
         iFigureY = parseInt(e.target.getAttribute("cy"));

         /* 이미 line이 있었을 경우 */
         if (e.target.getAttribute("line") != "none") {
            var line = document.getElementById(e.target.getAttribute("line"));
            
            /* 현재 port에서 정보를 지움 */
            e.target.setAttribute("line", "none");

            /* 이어진 operator가 있었다면 그 operator에서 line 정보를 지움 */
            var prevOp = document.getElementById(line.getAttribute("prev"));
            prevOp.setAttribute("line", "none");
   
            var prevRect = document.getElementById(prevOp.getAttribute("rect"));
            prevRect.setAttribute("opLine", "none");

            resCount--;
            line.remove();
         }


         /* 새로운 line 그리기 */
         var tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
         tempLine.setAttribute("class", "processLine"); // class 설정
         tempLine.setAttribute("id", lineID); // id 설정
         tempLine.setAttribute("prev", "none"); // Output port에서 (이후에 연결 완료됐을 때 설정 됨)
         tempLine.setAttribute("next", e.target.getAttribute("id")); // Result port로
         tempLine.setAttribute("x1", e.clientX - bb.left); // 시작점 x좌표
         tempLine.setAttribute("y1", e.clientY - bb.top); // 시작점 y좌표
         tempLine.setAttribute("x2", iFigureX - opIPr); // 끝점 x좌표
         tempLine.setAttribute("y2", iFigureY); // 끝점 y좌표
         tempLine.setAttribute("style", opLineStyle); // style 설정

         e.target.setAttribute("line", lineID);
         document.getElementById("resultG").appendChild(tempLine);

      }

      isDrawLine = 1;
      currentLine = lineID;

   } else if (isDrawLine == 1) { // line의 끝점인 경우

      var line = document.getElementById(currentLine);

      if (e.target.getAttribute("class") == "processIP" || e.target.getAttribute("class") == "processOP") { // Operator와 연결하는 경우
         var rect = document.getElementById(e.target.getAttribute("rect"));

         if (e.target.getAttribute("class") == "processIP") { // 현재 포트가 Input port일 경우
            /* 같은 Input port에서 왔는지 확인 */
            if (line.getAttribute("next") != "none") {
               
               /* Result port에서 왔는지 확인 */
               if (document.getElementById(line.getAttribute("next")).getAttribute("class") == "processResult") {
                  var rp = document.getElementById(line.getAttribute("next"));
                  rp.setAttribute("line", "none");
                  resCount--;
               } else {
                  var nextIP = document.getElementById(line.getAttribute("next"));
                  nextIP.setAttribute("line", "none");

                  var nextRect = document.getElementById(nextIP.getAttribute("rect"));
                  nextRect.setAttribute("ipLine", "none");
               }

               line.remove();

            } else { // Output port에서 왔으면 연결

               e.target.setAttribute("line", currentLine); // 현재 포트에 line 정보 입력
               line.setAttribute("x2", String(Number(e.target.getAttribute("cx")) - opIPr)); // line의 끝점 x좌표
               line.setAttribute("y2", e.target.getAttribute("cy")); // line의 끝점 y좌표
               line.setAttribute("next", e.target.getAttribute("id")); // line의 next operator 정보 입력

               rect.setAttribute("ipLine", currentLine); // 현재 operator에 Input line 정보 입력

            }

         } else if (e.target.getAttribute("class") == "processOP") { // 현재 포트가 Output port일 경우
            /* 같은 Output port에서 왔는지 확인 */
            if (line.getAttribute("prev") != "none") {
               
               var prevOP = document.getElementById(line.getAttribute("prev"));
               prevOP.setAttribute("line", "none");

               var prevRect = document.getElementById(prevOP.getAttribute("rect"));
               prevRect.setAttribute("opLine", "none");

               line.remove();

            } else {

               e.target.setAttribute("line", currentLine); // 현재 포트에 line 정보 입력
               line.setAttribute("x1", String(Number(e.target.getAttribute("cx")) + opIPr)); // line의 끝점 x좌표
               line.setAttribute("y1", e.target.getAttribute("cy")); // line의 끝점 y좌표
               line.setAttribute("prev", e.target.getAttribute("id")); // line의 previous operator 정보 입력

               rect.setAttribute("opLine", currentLine); // 현재 operator에 Output line 정보 입력

               /* Result port에서 왔으면 line 추가하고 새로운 result port 추가 */
               if (document.getElementById(line.getAttribute("next")).getAttribute("class") == "processResult") {

                  resCount++;

                  /* 다음 Result port 생성 */
                  if (document.getElementById("result_" + String(resCount)) == null) {
                     var tempCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                     tempCircle.setAttribute("class", "processResult");
                     tempCircle.setAttribute("id", "result_" + String(resCount));
                     tempCircle.setAttribute("resnum", String(resCount));
                     tempCircle.setAttribute("operator", "none");
                     tempCircle.setAttribute("group", "resultG");
                     tempCircle.setAttribute("rect", "none");
                     tempCircle.setAttribute("op", "none");
                     tempCircle.setAttribute("line", "none");
                     tempCircle.setAttribute("cx", String(document.getElementById("process").offsetWidth));
                     tempCircle.setAttribute("cy", String(document.getElementById("process").offsetHeight * 0.1 * resCount));
                     tempCircle.setAttribute("r", String(opIPr));
                     tempCircle.setAttribute("style", "fill:rgba(234, 234, 234, 1); stroke: rgba(189, 189, 189, 1); stroke-width: 1;");
                     //tempCircle.addEventListener("click", portClick);
                     
                     document.getElementById("resultG").appendChild(tempCircle);
                     portAddListener(document.getElementsByClassName("processResult"));
                  }
               }

            }
         }
         
      } else if (e.target.getAttribute("processResult")) { // Result와 연결하는 경우
         /* Input port에서 왔는지 확인 */
         if (line.getAttribute("next") != "none") {

            var nextIP = document.getElementById(line.getAttribute("next"));
            nextIP.setAttribute("line", "none");

            var nextRect = document.getElementById(nextIP.getAttribute("rect"));
            nextRect.setAttribute("ipLine", "none");

            line.remove();

         } else {

            e.target.setAttribute("line", currentLine); // 현재 포트에 line 정보 입력
            line.setAttribute("x2", String(Number(e.target.getAttribute("cx")) - opIPr)); // line의 끝점 x좌표
            line.setAttribute("y2", e.target.getAttribute("cy")); // line의 끝점 y좌표
            line.setAttribute("next", e.target.getAttribute("id")); // line의 next operator 정보 입력

            resCount++;

            /* 다음 Result port 생성 */
            if (document.getElementById("result_" + String(resCount)) == null) {
               var tempCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
               tempCircle.setAttribute("class", "processResult");
               tempCircle.setAttribute("id", "result_" + String(resCount));
               tempCircle.setAttribute("resnum", String(resCount));
               tempCircle.setAttribute("operator", "none");
               tempCircle.setAttribute("group", "resultG");
               tempCircle.setAttribute("rect", "none");
               tempCircle.setAttribute("op", "none");
               tempCircle.setAttribute("line", "none");
               tempCircle.setAttribute("cx", String(document.getElementById("process").offsetWidth));
               tempCircle.setAttribute("cy", String(document.getElementById("process").offsetHeight * 0.1 * resCount));
               tempCircle.setAttribute("r", String(opIPr));
               tempCircle.setAttribute("style", "fill:rgba(234, 234, 234, 1); stroke: rgba(189, 189, 189, 1); stroke-width: 1;");
               //tempCircle.addEventListener("click", portClick);
               
               document.getElementById("resultG").appendChild(tempCircle);
               portAddListener(document.getElementsByClassName("processResult"));
            }

         }

      }

      isDrawLine = 0;
      currentLine = "";
      
   }

}

function docAddListener() {
   document.addEventListener("mousemove", docMousemove);
   document.addEventListener("dblclick", docDblClick);
   document.addEventListener("click", docClick);

   document.addEventListener("keydown", docKeydown);
}

/* Document 마우스 이동 이벤트 핸들러 (line을 위함) */
function docMousemove(e) {
   if (isDrawLine == 1) {
      iStartX = e.clientX - bb.left;
      iStartY = e.clientY - bb.top;

      var line = document.getElementById(currentLine);
      if (line.getAttribute("next") != "none") { // Input port에서 시작됐을 경우
         line.setAttribute("x1", iStartX);
         line.setAttribute("y1", iStartY);
      } else if (line.getAttribute("prev") != "none") { // Output port에서 시작됐을 경우
         line.setAttribute("x2", iStartX);
         line.setAttribute("y2", iStartY);
      }

   }
}

/* Document 마우스 클릭 이벤트 핸들러 (Operator 선택을 위함) */
function docClick(e) {
   if (currentOperator != null && afterClick == 0) {
      currentOperator.setAttribute("style", "fill:rgba(250, 236, 197, 1); stroke: rgba(189, 189, 189, 1); stroke-width: 2;");
      currentText.setAttribute("style", "fill:rgba(0, 0, 0, 1); font-size:12px; font-weight:bold;");
      currentOperator = null;
      currentText = null;
   }

   afterClick = 0;
}

/* Document 마우스 더블 클릭 이벤트 핸들러 (line을 위함) */
function docDblClick(e) {
   if (isDrawLine == 1) {
      var line = document.getElementById(currentLine);

      /* 이어져 있던 operator에서 정보를 지움 */
      if (line.getAttribute("prev") != "none") { // Output port에서 시작된 line인 경우
         var op = document.getElementById(line.getAttribute("prev"));
         op.setAttribute("line", "none");
         
         var rect = document.getElementById(op.getAttribute("rect"));
         rect.setAttribute("opLine", "none");

      } else if (line.getAttribute("next") != "none") { // Input port에서 시작된 line인 경우
         if (document.getElementById(line.getAttribute("next")).getAttribute("class") == "processResult") {
            var rp = document.getElementById(line.getAttribute("next"));
            rp.setAttribute("line", "none");
         } else {
            var ip = document.getElementById(line.getAttribute("next"));
            ip.setAttribute("line", "none");

            var rect = document.getElementById(ip.getAttribute("rect"));
            rect.setAttribute("ipLine", "none");
         }
      }

      line.remove();
      isDrawLine = 0;
      currentLine = null;
   }
}

/* Document 키 누름 이벤트 핸들러 (Operator 삭제를 위함) */
function docKeydown(e) {
   switch(e.keyCode) {
      case 46: // delete
         deleteOperator(currentOperator);
         break;
   }
}

/* Operator 지우기 */
function deleteOperator(operator) {
   /* 1. Input port와 Input line 지우기 */
   var ip = document.getElementById(operator.getAttribute("ip"));
   if (ip.getAttribute("line") != "none") {
      var line = document.getElementById(ip.getAttribute("line"));
      var prevOp = document.getElementById(line.getAttribute("prev"));
      prevOp.setAttribute("line", "none");

      var prevRect = document.getElementById(prevOp.getAttribute("rect"));
      prevRect.setAttribute("opLine", "none");
      line.remove();
   }
   ip.remove();


   /* 2. Output port와 Output line 지우기 */
   var op = document.getElementById(operator.getAttribute("op"));
   if (op.getAttribute("line") != "none") {
      var line = document.getElementById(op.getAttribute("line"));
      var nextOp = document.getElementById(line.getAttribute("next"));
      nextOp.setAttribute("line", "none");

      if (nextOp.getAttribute("class") != "processResult") {
         var nextRect = document.getElementById(nextOp.getAttribute("rect"));
         nextRect.setAttribute("ipLine", "none");
      } else {
         resCount--;
      }

      line.remove();
   }
   op.remove();


   /* 5. Group 지우기 */
   document.getElementById(operator.getAttribute("group")).remove();

   /* 3. Operator 지우기 */
   operator.remove();
}


/* 결과 보내기 */
function sendPost(url, nameArr, idArr) {
   var form = document.createElement('form');
   form.setAttribute('method', 'post');
   form.setAttribute('action', url);
   document.charset = "utf-8";

   for (var i = 0; i < nameArr.length; i++) {
      var hiddenField = document.createElement('input');
      hiddenField.setAttribute('name', nameArr[i]);
      
      var hiddenField2 = document.createElement('input');
      hiddenField2.setAttribute('id', idArr[i]);
      form.appendChild(hiddenField2);
   }
   document.body.appendChild(form);
   form.submit();
};






/* --------------------JQUERY-------------------- */
/* Load Operators */
$.ajax({
   type : "GET",
   url : "/simpleweb/operatorList/",
   //data: {value: value1},
   success: function(result) {
       document.getElementById("operatorsSVG").innerHTML = result;
      opAddListener(document.getElementsByClassName("operatorsRect"));
      opAddListener(document.getElementsByClassName("operatorsText"));
       prAddListener(document.getElementsByClassName("processRect"));
   },
   error: function() {
      console.log("오류 발생");
   }
});


/* 문서가 준비되면 실행 */
$(document).ready(function() {

   /* processSVG의 위치 정보를 획득 */
   svg = document.getElementById("processSVG");
   bb = svg.getBoundingClientRect();

   /* document에 mousemove 이벤트 핸들러 등록 */
   docAddListener();

   /* result_1 추가 */
   var tempCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
   tempCircle.setAttribute("class", "processResult");
   tempCircle.setAttribute("id", "result_" + String(resCount));
   tempCircle.setAttribute("resnum", String(resCount));
   tempCircle.setAttribute("operator", "none");
   tempCircle.setAttribute("group", "resultG");
   tempCircle.setAttribute("rect", "none");
   tempCircle.setAttribute("op", "none");
   tempCircle.setAttribute("line", "none");
   tempCircle.setAttribute("cx", String(document.getElementById("process").offsetWidth));
   tempCircle.setAttribute("cy", String(document.getElementById("process").offsetHeight * 0.1));
   tempCircle.setAttribute("r", opIPr);
   tempCircle.setAttribute("style", "fill:rgba(234, 234, 234, 1); stroke: rgba(189, 189, 189, 1); stroke-width: 1;");
   //portAddListener(tempCircle);
   
   document.getElementById("resultG").appendChild(tempCircle);
   portAddListener(document.getElementsByClassName("processResult"));



   /* Button click (id: start) */
   $("#start").click(function() {
      var url = $(this).attr('href');
      var resultPorts = new Array();
      var arrOpName = new Array();
      var arrOpID = new Array();

      var target = document.getElementById("resultG");
      if (target.hasChildNodes()) {
         for (i = 0; i < target.childNodes.length; i++) {
            if (target.childNodes[i].nextSibling == null) continue;

            if (target.childNodes[i].nextSibling.getAttribute("class") == "processResult") {
               if (target.childNodes[i].nextSibling.getAttribute("line") != "none") {
                  //console.log(target.childNodes[i].nextSibling.getAttribute("id"));
                  resultPorts.push(target.childNodes[i].nextSibling.getAttribute("id"));
               }
            }
         }
      }

      for (var i = 0; i < resultPorts.length; i++) {
         var prevOP;
         var currentIPLine = document.getElementById(document.getElementById(resultPorts[i]).getAttribute("line"));
         var currentRect;

         while (currentIPLine != null) {
            prevOP = document.getElementById(currentIPLine.getAttribute("prev")); // 이전 Output port를 찾는다
            currentRect = document.getElementById(prevOP.getAttribute("rect")); // 그 Output port를 갖는 Rect를 찾는다
            currentOpName = currentRect.getAttribute("operator");
            currentIPLine = document.getElementById(currentRect.getAttribute("ipLine")); // Rect로부터 Input Line을 찾는다

            arrOpName.push(currentOpName);
            arrOpID.push(currentRect.getAttribute("id"));
         } // Input Line이 없으면 첫 번째 Operator를 찾음

         $.ajax({
            type: 'POST',
            url: $(this).attr('href'),
            data: {
                "OpName": arrOpName.reverse(),
                "OpId": arrOpID.reverse(),
                "processName":document.getElementById("processName").value
                //csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success:function() {
                console.log("success");
            },
            error: function(data) {
               console.log(document.getElementById("processName").value);
                console.log("error");
            }

         });

      }

      //window.open(url, '_blank')

    });

});











/* Dropdown, ajax 참고용 */
$(document).ready(function() {

   $("#save").click(function() { // Start 버튼이 클릭되면
      var data12 = $("#div1").html() // div1에 있는 내용을 data12에 저장
      var data11 = JSON.stringify(data12) // data11에 data12의 내용을 JSON으로 변환해서 저장
      var filename = prompt("Save as:") // 알림창을 띄워서 filename을 입력받음
      $.ajax({ // ajax 통신
         type :"GET",
         url : "/savefile/"+filename, // view.py의 sava_file(request, filename) 호출
         data: {html_page: data11}, // 들어있는 데이터는 JSON 형태인 data11
   
         success : function(jsondata) {  // 성공하면 jsondata로 함수 실행
            alert(jsondata) // jsondata를 알리고
            document.getElementById("div1").innerHTML = "<h1>Web page Saved!</h1>" // div1을 가져와서 내부의 html을 "<h1>Web~" 로 변경 <-- 중요            
         },
         error : function() {
            //do something
         }
      });
   });

    $("#a1").click(function(){
       $("#menu").append(" <input type='button' class='btn btn-primary' draggable='true' ondragstart='dragStart(event)' value='basic' id='btn6' ondragend='dragEnd(event)'><br>");
    });
    $("#a2").click(function(){
       $("#menu").append(" <label id='label1'>label</label><br>");
    });
    $("#a3").click(function(){
       $("#menu").append(" <button>Appended text</button>");
    });
    $("#a5").click(function(){
       $("#menu").append(" <button>Appended text</button>");
    });
    $("#a6").click(function(){
       value1 = $(this).attr("value")
       $.ajax({
          type: "GET",
          url: "/request/element/",
          data: {value: value1},
          success: function(data1){
             $("#menu").append(data1)
          }
       });
    });
    $("#a7").click(function(){
       primarykey = 1
       $.ajax({
          type: "GET",
          url: "/request/Element/",
          data: {value: primarykey},
          success: function(data1){
             $("#menu").append(data1)
          }
       })
    });   
    $("#a8").click(function(){
       primarykey = 2
       $.ajax({
          type: "GET",
          url: "/request/Element/",
          data: {value: primarykey},
          success: function(data1){
             $("#menu").append(data1)
          }
       })
    });   
    $("#a9").click(function(){
       primarykey = 3
       $.ajax({
          type: "GET",
          url: "/request/Element/",
          data: {value: primarykey},
          success: function(data1){
             $("#menu").append(data1)
          }
       })
    });
});