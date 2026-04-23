export type HelpSection = {
  id: string;
  title: string;
  items?: {
    title: string;
    description: string[];
    variant?: "default" | "warning" | "danger";
  }[];
  paragraphs?: string[];
};

export type HelpContent = {
  pageTitle: string;
  intro: string;
  sections: HelpSection[];
  contactTitle: string;
  contactDescription: string;
  email: string;
};

export const helpContent: Record<"ko" | "en", HelpContent> = {
  ko: {
    pageTitle: "QR코드 이름표 & 출석 체크 프로그램 사용 설명서",
    intro:
      "본 프로그램은 교회의 다양한 환경에 맞춰 최적화된 맞춤형 출석 관리 솔루션입니다. 별도의 설치 비용 없이 다양한 기기에서 무료로 사용할 수 있습니다.",
    sections: [
      {
        id: "install",
        title: "1. 기기별 설치 및 실행 방법",
        items: [
          {
            title: "Windows / Android",
            description: [
              "Chrome 브라우저에서 접속 후 [홈 화면에 추가] 또는 [설치]를 눌러 저장할 수 있습니다.",
            ],
          },
          {
            title: "Apple (iPhone / iPad)",
            description: [
              "Safari 브라우저에서 접속 후 [공유] 버튼 → [홈 화면에 추가]를 누르면 됩니다.",
            ],
          },
          {
            title: "특징",
            description: [
              "이 프로그램은 웹 기반 앱(PWA)으로, 한 번 저장하면 앱처럼 사용할 수 있습니다.",
              "기기에 저장하여 사용하면 데이터 백업이 용이하고 보안상 더 안전합니다.",
            ],
          },
        ],
      },
      {
        id: "features",
        title: "2. 핵심 기능 안내",
        items: [
          {
            title: "① 고유 ID 체계 및 데이터 관리",
            description: [
              "등록 시 고유ID앞자리 + 숫자 조합의 중복 없는 ID가 자동으로 생성됩니다.",
              "설정에서 '고유ID앞자리'를 연도(예: 2026, 2027)나 기기별 구분값(예: Phone, Tablet)으로 정하면 데이터 정리가 쉬워집니다.",
              "메인 기기 1대에서 데이터를 관리하고, [데이터 내보내기 / 가져오기] 기능으로 다른 기기와 동기화할 수 있습니다.",
            ],
          },
          {
            title: "② 스마트 이름표(명찰) 출력",
            description: [
              "PDF로 저장하여 한 번에 출력할 수 있습니다.",
              "아이폰에서는 출력 시 사이즈를 조절하면 A4 한 장당 8개 정도로 배치할 수 있습니다.",
              "명찰을 PNG 이미지 파일로 저장하여 성도 개인의 휴대폰으로 전송할 수도 있습니다.",
              "성도는 자신의 휴대폰에 저장된 QR 코드를 스캐너에 대기만 하면 출석 체크가 가능합니다.",
            ],
          },
          {
            title: "③ 출석 체크 및 스캔",
            description: [
              "전문 스캐너 모드: 외부 스캐너 기기를 연결하여 빠르고 정확하게 스캔합니다. 권장되는 방식입니다.",
              "카메라 스캔 모드: 기기에 내장된 카메라를 사용하여 간편하게 스캔할 수 있습니다.",
            ],
          },
          {
            title: "④ 다국어 및 엑셀 리포트",
            description: [
              "한국어 / 영어를 선택하면 화면뿐 아니라 엑셀 출력 형식도 함께 바뀝니다.",
              "영어 선택 시 이름 순서가 First Name, Last Name 순으로 표시됩니다.",
              "전체 성도 명단, 일자별 출석 기록, 연간 출석 기록 등을 엑셀로 다운로드할 수 있습니다.",
            ],
          },
        ],
      },
      {
        id: "settings",
        title: "3. 설정 및 주의사항 (필독)",
        items: [
          {
            title: "⚙️ 사용자 맞춤 설정",
            description: [
              "부서 이름은 우리 교회 상황에 맞게 자유롭게 추가하거나 수정할 수 있습니다.",
              "단, 부서명은 처음 설정한 언어로 저장되므로 신중하게 입력해 주세요.",
              "이름표 상단에 표시될 교회 이름도 언제든지 변경할 수 있습니다.",
            ],
            variant: "default",
          },
          {
            title: "⚠️ 데이터 보안 및 주의사항",
            description: [
              "[위험영역]의 '전체 데이터 삭제'를 누르면 기기 내 모든 정보가 지워집니다.",
              "삭제 전 반드시 [데이터 내보내기] 기능으로 백업해 주세요.",
              "여러 기기에서 따로 등록 작업을 할 경우, 기기마다 '고유ID앞자리'를 다르게 설정해야 데이터 충돌을 막을 수 있습니다.",
              "사진 등록 방식은 기기 사양에 따라 직접 촬영 또는 파일 업로드로 다르게 보일 수 있습니다.",
            ],
            variant: "warning",
          },
        ],
      },
      {
        id: "qa",
        title: "4. Q&A",
        items: [
          {
            title: "검색이 안 되나요?",
            description: [
              "직분은 한글/영어 모두 검색할 수 있습니다. 예: 목사 / Pastor",
              "하지만 부서는 처음 입력한 언어로만 검색됩니다.",
            ],
          },
          {
            title: "업데이트는 어떻게 하나요?",
            description: [
              "프로그램이 수정되면 접속 시 최신 버전이 자동으로 반영됩니다.",
            ],
          },
        ],
      },
    ],
    contactTitle: "📩 문의 및 지원",
    contactDescription:
      "프로그램 사용 중 궁금한 점이나 개선 제안, 기술 지원이 필요하시면 아래 이메일로 언제든지 연락해 주세요.",
    email: "madangmoon@gmail.com",
  },

  en: {
    pageTitle: "QR Code Name Tag & Attendance Check Program User Guide",
    intro:
      "This program is a customized attendance management solution optimized for various church environments. It can be used free of charge on various devices.",
    sections: [
      {
        id: "install",
        title: "1. Installation and Setup by Device",
        items: [
          {
            title: "Windows / Android",
            description: [
              "Open the program in Chrome and click [Add to Home Screen] or [Install].",
            ],
          },
          {
            title: "Apple (iPhone / iPad)",
            description: [
              "Open the program in Safari, tap [Share], then select [Add to Home Screen].",
            ],
          },
          {
            title: "Features",
            description: [
              "This is a web-based app (PWA), so once saved it can be used like an installed app.",
              "Using it from your device makes backup easier and improves security.",
            ],
          },
        ],
      },
      {
        id: "features",
        title: "2. Key Features",
        items: [
          {
            title: "① Unique ID System and Data Management",
            description: [
              "When a person is registered, a unique ID is automatically created using the ID prefix plus numbers.",
              "If you set the ID prefix by year (for example, 2026 or 2027) or by device type (for example, Phone or Tablet), it becomes much easier to organize your data.",
              "You can manage data on one main device and sync it to other devices through [Export Data / Import Data].",
            ],
          },
          {
            title: "② Smart Name Tag Printing",
            description: [
              "You can save and print name tags as PDF files.",
              "On iPhone, you can adjust the print size to fit about 8 name tags on one A4 page.",
              "You can also save each name tag as a PNG image and send it to each church member’s phone.",
              "Members can then check in by simply presenting the QR code saved on their phone.",
            ],
          },
          {
            title: "③ Attendance Check and Scanning",
            description: [
              "Scanner Mode: Connect an external scanner for fast and accurate scanning. This is the recommended method.",
              "Camera Scan Mode: Use the built-in device camera for convenient scanning.",
            ],
          },
          {
            title: "④ Multilingual Support and Excel Reports",
            description: [
              "When you choose Korean or English, not only the screen language but also the Excel export format changes.",
              "When English is selected, names are automatically shown in First Name, Last Name order.",
              "You can download the full member list, daily attendance records, and yearly attendance records in Excel format.",
            ],
          },
        ],
      },
      {
        id: "settings",
        title: "3. Settings and Important Notes",
        items: [
          {
            title: "⚙️ Custom Settings",
            description: [
              "You can freely add or edit department names to match your church’s structure.",
              "However, department names stay in the language you entered them in, so please choose carefully when setting them up.",
              "You can also change the church name shown at the top of the name tag at any time.",
            ],
          },
          {
            title: "⚠️ Data Safety and Important Notes",
            description: [
              "If you press [Delete All Data] in the danger zone, all information stored on that device will be removed.",
              "Please make sure to back up your data first using [Export Data].",
              "If multiple devices are used for separate registration work, each device must have a different ID prefix to prevent conflicts.",
              "Depending on the device, photo registration may appear either as direct camera capture or file upload.",
            ],
            variant: "warning",
          },
        ],
      },
      {
        id: "qa",
        title: "4. Q&A",
        items: [
          {
            title: "Search is not working?",
            description: [
              "Positions can be searched in both Korean and English, for example 목사 / Pastor.",
              "However, departments can only be searched in the language they were originally entered in.",
            ],
          },
          {
            title: "How do updates work?",
            description: [
              "Whenever the program is updated, the latest version is reflected automatically when you open it.",
            ],
          },
        ],
      },
    ],
    contactTitle: "📩 Contact and Support",
    contactDescription:
      "If you have any questions, suggestions, or need technical support while using the program, please feel free to contact us by email.",
    email: "madangmoon@gmail.com",
  },
};