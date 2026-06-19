/* =========================================================
   ⚙️ 상담신청 폼 → 구글폼(구글 시트) 연결 설정
   아래 5개 값만 채우면, 신청 내용이 구글 시트에 자동으로 쌓입니다.
   (값 채우는 방법은 범쌤에게 안내해 드린 가이드를 참고하세요)
   ========================================================= */
const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSdZuSS01XmdmyO88iVKdXS61Uua5hVGl7BLlekZAVfr_3DBWA/formResponse";
const ENTRY = {
  name:    "entry.2005620554", // 이름
  contact: "entry.1483272756", // 연락처 / 카카오 ID
  type:    "entry.1065046570", // 상담 종류
  message: "entry.1429003341", // 현재 상황
  agree:   "entry.1048396762", // 개인정보 동의
};
/* ========================================================= */

// 모바일 메뉴 토글
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
if (navToggle && nav) {
  navToggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => nav.classList.remove("open"))
  );
}

// 상담신청 폼 처리
const form = document.getElementById("applyForm");
const note = document.getElementById("formNote");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const type = form.type.value;
    const message = form.message.value.trim();
    const agree = document.getElementById("agree").checked;

    if (!name || !contact || !message) {
      showNote("필수 항목을 모두 입력해 주세요.", "#d23b3b");
      return;
    }
    if (!agree) {
      showNote("개인정보 수집 및 이용에 동의해 주세요.", "#d23b3b");
      return;
    }

    // 구글폼이 연결되어 있으면 실제 전송
    if (GOOGLE_FORM_ACTION && ENTRY.name) {
      const data = new FormData();
      data.append(ENTRY.name, name);
      data.append(ENTRY.contact, contact);
      data.append(ENTRY.type, type);
      data.append(ENTRY.message, message);
      data.append(ENTRY.agree, "예");

      fetch(GOOGLE_FORM_ACTION, { method: "POST", mode: "no-cors", body: data })
        .then(() => {
          showNote("상담 신청이 접수되었습니다. 빠르게 연락드릴게요! 💙", "#1789c2");
          form.reset();
        })
        .catch(() => {
          showNote("전송 중 오류가 발생했어요. 카카오톡으로 문의해 주세요.", "#d23b3b");
        });
    } else {
      // 아직 구글폼 미연결 상태(데모)
      showNote("상담 신청이 접수되었습니다. 빠르게 연락드릴게요! 💙", "#1789c2");
      form.reset();
    }
  });
}

function showNote(text, color) {
  if (!note) return;
  note.hidden = false;
  note.textContent = text;
  note.style.color = color;
}
