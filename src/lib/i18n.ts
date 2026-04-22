import strict from "assert/strict";

export interface Translations {
  appName: string;
  navMembers: string;
  navNametags: string;
  navScan: string;
  navAttendance: string;
  navSettings: string;
  memberCount: (n: number) => string;
  newMember: string;
  searchPlaceholder: string;
  noMembers: string;
  noMembersHint: string;
  confirmDelete: string;
  editMember: string;
  addMember: string;
  photoUploadHint: string;
  labelLastName: string;
  labelFirstName: string;
  labelBirthDate: string;
  labelPhone: string;
  labelRole: string;
  labelGrade: string;
  labelGroup: string;
  placeholderLastName: string;
  placeholderFirstName: string;
  placeholderPhone: string;
  placeholderGrade: string;
  placeholderGroup: string;
  selectPlaceholder: string;
  btnSave: string;
  btnAdd: string;
  roles: string[];
  nameTagTitle: string;
  deselectAll: string;
  selectAll: string;
  print: string;
  registerFirst: string;
  churchName: string;
  scanTitle: string;
  todayAttendance: (n: number) => string;
  alreadyChecked: string;
  attendanceDone: string;
  invalidQr: string;
  stopScan: string;
  startScan: string;
  attendanceTitle: string;
  downloadExcel: string;
  attendanceCount: (n: number) => string;
  noAttendance: string;
  colName: string;
  colTime: string;
  colRole: string;
  colPhone: string;
  settingsTitle: string;
  qrFieldConfig: string;
  qrFieldHint: string;
  fieldName: string;
  fieldBirthDate: string;
  fieldPhone: string;
  fieldRole: string;
  fieldGrade: string;
  fieldGroup: string;
  saveSettings: string;
  saved: string;
  dangerZone: string;
  dangerHint: string;
  deleteAll: string;
  confirmDeleteAll: string;
  deletedAll: string;
  excelName: string;
  excelDate: string;
  excelTime: string;
  excelSheet: string;
  excelFile: (date: string) => string;
  exportMembers: string;
  excelMemberSheet: string;
  excelMemberFile: string;
  excelLastName: string;
  excelFirstName: string;
  excelBirthDate: string;
  excelPhone: string;
  excelRole: string;
  excelGrade: string;
  excelGroup: string;
  memberNotFound: string;
  scanProcessingError: string;
  scannerInstruction: string;
  scanPlaceholder: string;
  processing: string;
  manualCheck: string;
  colBirthDate: string;
  colMemberId: string;
  excelMemberId: string;
  churchNameLabel: string;
  churchNameHint: string;
  churchNamePlaceholder: string;
  saveChurchName: string; 
  saveQrSettings: string;
  savedChurchName: string;
  savedQrSettings: string;
  languageLabel: string;
  languageHint: string;
  saveLanguage: string;
  savedLanguage: string;
  // langKorean: string;
  // langEnglish: string;
  dataBackupTitle: string;
  dataBackupHint: string;
  exportData: string;
  importData: string;
  exportSuccess: string;
  importSuccess: string;
  importFailed: string;
  invalidBackupFile: string;
  confirmImportOverwrite: string;
  downloadFullYearExcel: string;
  excelSummarySheet: string;
  excelAttendanceCount: string;
  excelFullYearFile: string;
  back: string; 
  scanHubDescription: string;
  professionalScanner: string;
  professionalScannerDescription: string;
  cameraScan: string;
  cameraScanDescription: string;
  invalidQrCode: string;
  scanProcessFailed: string;
  cameraStartFailed: string;
  labelGender: string;
  optionMale: string;
  optionFemale: string;
  labelNotes: string;
  placeholderNotes: string;
  groups: string;
  addGroup: string;
  groupName: string;
  selectGroup: string;
  noGroupsConfigured: string;
  delete: string;
  noGroupsMessage: string;
  memberIdPrefix: string;
  prefixPlaceholder: string;
  prefixDescription: string;
  none: string;
  placeholderRole: string;
  savePrefix: string;
  invalidPrefix: string;
  prefixSaved: string;


};

const ko: Translations = {
  appName: '교회 명찰',
  navMembers: '교인 관리',
  navNametags: '명찰 만들기',
  navScan: '출석 스캔',
  navAttendance: '출석 기록',
  navSettings: '설정',
  memberCount: (n) => `(${n}명)`,
  newMember: '새 등록',
  searchPlaceholder: '이름, 전화번호, 직분, 부서 검색...',
  noMembers: '등록된 교인이 없습니다',
  noMembersHint: '위의 "새 교인" 버튼으로 교인을 등록하세요',
  confirmDelete: '정말 삭제하시겠습니까?',
  editMember: '교인 수정',
  addMember: '새 교인 등록',
  photoUploadHint: '사진을 클릭하여 업로드',
  labelLastName: '성 *',
  labelFirstName: '이름 *',
  labelBirthDate: '생년월일',
  labelPhone: '전화번호',
  labelRole: '직분',
  labelGrade: '학년/나이',
  labelGroup: '부서',
  placeholderLastName: '홍',
  placeholderFirstName: '길동',
  placeholderPhone: '010-1234-5678',
  placeholderGrade: '예: 중1',
  placeholderGroup: '예: 청년부',
  selectPlaceholder: '선택',
  btnSave: '수정 완료',
  btnAdd: '등록하기',
  roles: ['목사', '장로', '집사', '권사', '청년', '학생', '새신자', '평신도'],
  nameTagTitle: '명찰 만들기',
  deselectAll: '선택 해제',
  selectAll: '전체 선택',
  print: '인쇄',
  registerFirst: '교인을 먼저 등록해 주세요',
  churchName: '우리 교회',
  scanTitle: '출석 스캔',
  todayAttendance: (n) => `오늘 출석: ${n}명`,
  alreadyChecked: '이미 출석 처리되었습니다',
  attendanceDone: '출석 완료!',
  invalidQr: '유효하지 않은 QR코드입니다',
  stopScan: '스캔 중지',
  startScan: '스캔 시작',
  attendanceTitle: '출석 기록',
  downloadExcel: '엑셀 다운로드',
  attendanceCount: (n) => `${n}명 출석`,
  noAttendance: '이 날짜에 출석 기록이 없습니다',
  colName: '이름',
  colTime: '시간',
  colRole: '직분',
  colPhone: '전화번호',
  settingsTitle: '설정',
  qrFieldConfig: 'QR코드에 포함할 정보',
  qrFieldHint: '명찰의 QR코드에 저장할 항목을 선택하세요.',
  fieldName: '이름',
  fieldBirthDate: '생년월일',
  fieldPhone: '전화번호',
  fieldRole: '직분',
  fieldGrade: '학년/나이',
  fieldGroup: '부서',
  saveSettings: '설정 저장',
  saved: '저장되었습니다!',
  dangerZone: '위험 영역',
  dangerHint: '모든 교인 및 출석 데이터를 삭제합니다.',
  deleteAll: '전체 데이터 삭제',
  confirmDeleteAll: '모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
  deletedAll: '모든 데이터가 삭제되었습니다.',
  excelName: '이름',
  excelDate: '날짜',
  excelTime: '시간',
  excelSheet: '출석기록',
  excelFile: (date) => `출석기록_${date}.xlsx`,
  exportMembers: '엑셀 내보내기',
  excelMemberSheet: '교인명단',
  excelMemberFile: '교인명단.xlsx',
  excelLastName: '성',
  excelFirstName: '이름',
  excelBirthDate: '생년월일',
  excelPhone: '전화번호',
  excelRole: '직분',
  excelGrade: '학년/나이',
  excelGroup: '부서',
  memberNotFound: "등록되지 않은 교인입니다",
  scanProcessingError: "처리 중 오류가 발생했습니다",
  scannerInstruction: "전문 스캐너로 QR을 찍으면 자동으로 입력됩니다",
  scanPlaceholder: "스캐너로 QR을 찍어주세요",
  processing: "처리 중...",
  manualCheck: "수동 확인",
  colBirthDate: "생년월일",
  colMemberId: "회원 ID",
  excelMemberId: "회원 ID",
  churchNameLabel: "교회 이름",
  churchNameHint: "명찰 상단에 표시할 교회 이름을 입력하세요.",
  churchNamePlaceholder: "교회 이름을 입력하세요",
  saveChurchName: "교회 이름 저장",
  saveQrSettings: "QR 설정 저장",
  savedChurchName: "교회 이름이 저장되었습니다!",
  savedQrSettings: "QR 설정이 저장되었습니다!",
  languageLabel: "언어",
  languageHint: "처음에는 기기 언어를 따르고, 필요하면 여기서 바꿀 수 있습니다.",
  saveLanguage: "언어 저장",
  savedLanguage: "언어가 저장되었습니다!",
  // langKorean: "한국어",
  // langEnglish: "영어",
  dataBackupTitle: "데이터 백업",
  dataBackupHint: "현재 교인, 출석, QR 설정, 앱 설정을 파일로 내보내거나 가져올 수 있습니다.",
  exportData: "데이터 내보내기",
  importData: "데이터 가져오기",
  exportSuccess: "백업 파일이 저장되었습니다!",
  importSuccess: "데이터가 성공적으로 합쳐졌습니다.",
  importFailed: "데이터를 가져오는 중 오류가 발생했습니다.",
  invalidBackupFile: "올바른 백업 파일이 아닙니다.",
  confirmImportOverwrite: "데이터를 가져오면 기존 데이터와 합쳐집니다. 최신 정보가 우선 적용됩니다. 계속하시겠습니까?",
  downloadFullYearExcel: "전체 연간 엑셀",
  excelSummarySheet: "연간집계",
  excelAttendanceCount: "출석 횟수",
  excelFullYearFile: "연간출석전체.xlsx",
  back: '돌아가기',
  scanHubDescription: '출석 스캔 방식을 선택하세요',
  professionalScanner: '전문 스캐너',
  professionalScannerDescription: '바코드/QR 스캐너가 키보드처럼 값을 입력하는 방식입니다.',
  cameraScan: '카메라 스캔',
  cameraScanDescription: '태블릿이나 휴대폰 카메라로 QR을 비춰 출석 처리합니다.',
  invalidQrCode: '잘못된 QR 코드입니다',
  scanProcessFailed: '출석 처리 실패',
  cameraStartFailed: '카메라 실행 실패 (권한 허용 또는 HTTPS 확인)',
  labelGender: "성별",
  optionMale: "남",
  optionFemale: "여",
  labelNotes: "기타",
  placeholderNotes: "가족 관계, 특이사항 등",
  groups: "그룹",
  addGroup: "그룹 추가",
  groupName: "그룹 이름",
  selectGroup: "그룹 선택",
  noGroupsConfigured: "등록된 그룹이 없습니다",
  delete: "삭제",
  noGroupsMessage: "먼저 설정에서 그룹을 추가해주세요",
  memberIdPrefix: "고유 ID 앞자리",
  prefixPlaceholder: "예: MyChurch",
  prefixDescription: "고유 ID 앞에 붙는 이름을 정하세요 (예: MyChurch0001)",
  none: "없음",
  placeholderRole: "직분 선택",
  savePrefix: "확인",
  invalidPrefix: "Prefix를 입력해 주세요.",
  prefixSaved: "Prefix가 저장되었습니다.",

};

const en: Translations = {
  appName: 'Church Tags',
  navMembers: 'Members',
  navNametags: 'Name Tags',
  navScan: 'Scan',
  navAttendance: 'Attendance',
  navSettings: 'Settings',
  memberCount: (n) => `(${n})`,
  newMember: 'New registration',
  searchPlaceholder: 'Search name, phone, role, group...',
  noMembers: 'No members registered',
  noMembersHint: 'Click "New Member" to add one',
  confirmDelete: 'Are you sure you want to delete?',
  editMember: 'Edit Member',
  addMember: 'New Member',
  photoUploadHint: 'Click to upload photo',
  labelLastName: 'Last Name *',
  labelFirstName: 'First Name *',
  labelBirthDate: 'Birth Date',
  labelPhone: 'Phone',
  labelRole: 'Role',
  labelGrade: 'Grade/Age',
  labelGroup: 'Group',
  placeholderLastName: 'Enter Last Name',
  placeholderFirstName: 'Enter First Name',
  placeholderPhone: '010-1234-5678',
  placeholderGrade: 'e.g. Grade 7',
  placeholderGroup: 'e.g. Youth',
  selectPlaceholder: 'Select',
  btnSave: 'Save',
  btnAdd: 'Register',
  roles: ['Pastor', 'Elder', 'Deacon', 'Deaconess', 'Youth', 'Student', 'Newcomer', 'Layperson'],
  nameTagTitle: 'Name Tags',
  deselectAll: 'Deselect All',
  selectAll: 'Select All',
  print: 'Print',
  registerFirst: 'Please register members first',
  churchName: 'Our Church',
  scanTitle: 'Attendance Scan',
  todayAttendance: (n) => `Today: ${n}`,
  alreadyChecked: 'Already checked in',
  attendanceDone: 'Checked in!',
  invalidQr: 'Invalid QR code',
  stopScan: 'Stop Scan',
  startScan: 'Start Scan',
  attendanceTitle: 'Attendance',
  downloadExcel: 'Download Excel',
  attendanceCount: (n) => `${n} attended`,
  noAttendance: 'No attendance records for this date',
  colName: 'Name',
  colTime: 'Time',
  colRole: 'Role',
  colPhone: 'Phone',
  settingsTitle: 'Settings',
  qrFieldConfig: 'QR Code Fields',
  qrFieldHint: 'Select which fields to include in the QR code.',
  fieldName: 'Name',
  fieldBirthDate: 'Birth Date',
  fieldPhone: 'Phone',
  fieldRole: 'Role',
  fieldGrade: 'Grade/Age',
  fieldGroup: 'Group',
  saveSettings: 'Save Settings',
  saved: 'Saved!',
  dangerZone: 'Danger Zone',
  dangerHint: 'Delete all members and attendance data.',
  deleteAll: 'Delete All Data',
  confirmDeleteAll: 'Delete all data? This cannot be undone.',
  deletedAll: 'All data has been deleted.',
  excelName: 'Name',
  excelDate: 'Date',
  excelTime: 'Time',
  excelSheet: 'Attendance',
  excelFile: (date) => `attendance_${date}.xlsx`,
  exportMembers: 'Export Excel',
  excelMemberSheet: 'Members',
  excelMemberFile: 'members.xlsx',
  excelLastName: 'Last Name',
  excelFirstName: 'First Name',
  excelBirthDate: 'Birth Date',
  excelPhone: 'Phone',
  excelRole: 'Role',
  excelGrade: 'Grade/Age',
  excelGroup: 'Group',
  memberNotFound: "Member not found",
  scanProcessingError: "An error occurred while processing",
  scannerInstruction: "Scan the QR code with the barcode scanner",
  scanPlaceholder: "Scan the QR code here",
  processing: "Processing...",
  manualCheck: "Manual check",
  colBirthDate: "Birth Date",
  colMemberId: "Member ID",
  excelMemberId: "Member ID",
  churchNameLabel: "Church Name",
  churchNameHint: "Enter the church name to display at the top of the name tag.",
  churchNamePlaceholder: "Enter church name",
  saveChurchName: "Save Church Name",
  saveQrSettings: "Save QR Settings",
  savedChurchName: "Church name saved!",
  savedQrSettings: "QR settings saved!",
  languageLabel: "Language",
  languageHint: "The app follows the device language at first, but you can change it here anytime.",
  saveLanguage: "Save Language",
  savedLanguage: "Language saved!",
  // langKorean: "Korean",
  // langEnglish: "English",
  dataBackupTitle: "Data Backup",
  dataBackupHint: "Export or import members, attendance, QR settings, and app settings as a file.",
  exportData: "Export Data",
  importData: "Import Data",
  exportSuccess: "Backup file saved!",
  importSuccess: "Data was merged successfully.",
  importFailed: "An error occurred while importing data.",
  invalidBackupFile: "This is not a valid backup file.",
  confirmImportOverwrite: "Import will merge with existing data. Newer information will take priority. Do you want to continue?",
  downloadFullYearExcel: "Full Year Excel",
  excelSummarySheet: "Year Summary",
  excelAttendanceCount: "Attendance Count",
  excelFullYearFile: "full-year-attendance.xlsx",
  back: 'Back',
  scanHubDescription: 'Choose an attendance scanning method',
  professionalScanner: 'Professional Scanner',
  professionalScannerDescription: 'Use a barcode/QR scanner that inputs values like a keyboard.',
  cameraScan: 'Camera Scan',
  cameraScanDescription: 'Use a tablet or phone camera to scan the QR code for attendance.',
  invalidQrCode: 'Invalid QR code',
  scanProcessFailed: 'Failed to process attendance',
  cameraStartFailed: 'Failed to start camera (check permission or HTTPS)',
  labelGender: "Gender",
  optionMale: "Male",
  optionFemale: "Female",
  labelNotes: "Notes",
  placeholderNotes: "Family, special notes, etc.",
  groups: "Groups",
  addGroup: "Add Group",
  groupName: "Group Name",
  selectGroup: "Select group",
  noGroupsConfigured: "No groups configured",
  delete: "Delete",
  noGroupsMessage: "Please add a group in settings first",
  memberIdPrefix: "ID Prefix",
  prefixPlaceholder: "e.g. MyChurch",
  prefixDescription: "Set the name that comes before the ID (e.g. MyChurch0001)",
  none: "None",
  placeholderRole: "Select role",
  savePrefix: "Save",
  invalidPrefix: "Please enter a prefix.",
  prefixSaved: "Prefix has been saved.",

};

const translations: Record<Lang, Translations> = { ko, en };

type Lang = 'ko' | 'en';

const LANG_STORAGE_KEY = 'church-app-language';

function detectLanguage(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'ko' || saved === 'en') return saved;
  } catch {}

  const lang = navigator.language || (navigator as any).userLanguage || 'en';
  return lang.startsWith('ko') ? 'ko' : 'en';
}

let currentLang: Lang = detectLanguage();

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {}
}

export function t(): Translations {
  return translations[currentLang];
}

export type { Lang };
