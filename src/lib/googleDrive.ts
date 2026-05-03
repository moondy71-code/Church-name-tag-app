const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPE = 'https://www.googleapis.com/auth/drive.file';

declare global {
  interface Window {
    google?: any;
  }
}

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existing) {
      existing.onload = () => resolve();
      existing.onerror = () => reject(new Error('Google script load failed'));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google script load failed'));
    document.body.appendChild(script);
  });
}

export async function getGoogleAccessToken(): Promise<string> {
  await loadGoogleScript();

  if (!CLIENT_ID) {
    throw new Error('Missing VITE_GOOGLE_CLIENT_ID');
  }

  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (response: any) => {
        if (response.error) {
          reject(response);
          return;
        }
        resolve(response.access_token);
      },
    });

    tokenClient.requestAccessToken();
  });
}

export async function uploadJsonToDrive(fileName: string, data: unknown) {
  const accessToken = await getGoogleAccessToken();

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
  };

  const boundary = 'Scan Attendance Backup';
  const body =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    `\r\n--${boundary}\r\n` +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(data, null, 2) +
    `\r\n--${boundary}--`;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
async function getOrCreateFolder(accessToken: string) {
  const query = encodeURIComponent(
    "name='Scan Attendance Backup' and mimeType='application/vnd.google-apps.folder' and trashed=false"
  );

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const data = await res.json();

  if (data.files.length > 0) {
    return data.files[0].id;
  }

  // 없으면 생성
  const createRes = await fetch(
    'https://www.googleapis.com/drive/v3/files',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Scan Attendance Backup',
        mimeType: 'application/vnd.google-apps.folder',
      }),
    }
  );

  const folder = await createRes.json();
  return folder.id;
}

async function findFile(accessToken: string, folderId: string, name: string) {
  const query = encodeURIComponent(
    `'${folderId}' in parents and name='${name}' and trashed=false`
  );

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const data = await res.json();
  return data.files?.[0];
}

async function downloadJsonFile(accessToken: string, fileId: string) {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

async function copyFile(accessToken: string, fileId: string, newName: string) {
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/copy`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newName,
      }),
    }
  );
}
async function uploadOrUpdateFile(
  accessToken: string,
  folderId: string,
  fileName: string,
  data: unknown
) {
  const existing = await findFile(accessToken, folderId, fileName);

  const metadata = existing
    ? { name: fileName }
    : { name: fileName, parents: [folderId] };

  const boundary = 'boundary123';
  const body =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    `\r\n--${boundary}\r\n` +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(data, null, 2) +
    `\r\n--${boundary}--`;

  const url = existing
    ? `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

  const method = existing ? 'PATCH' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function backupToDrive(data: unknown) {
  const accessToken = await getGoogleAccessToken();

  const folderId = await getOrCreateFolder(accessToken);

  const mainFileName = 'scan-attendance-backup.json';
  const safetyFileName = 'scan-attendance-backup-safety.json';

  const existing = await findFile(accessToken, folderId, mainFileName);

  // 기존 최신 파일이 있으면 그 내용을 safety 파일로 저장
  if (existing) {
    const previousData = await downloadJsonFile(accessToken, existing.id);
    await uploadOrUpdateFile(accessToken, folderId, safetyFileName, previousData);
  }

  // 최신 파일 업데이트
  return uploadOrUpdateFile(accessToken, folderId, mainFileName, data);
}
export async function loadBackupFromDrive() {
  const accessToken = await getGoogleAccessToken();

  const folderId = await getOrCreateFolder(accessToken);
  const mainFileName = 'scan-attendance-backup.json';

  const file = await findFile(accessToken, folderId, mainFileName);

  if (!file) {
    throw new Error('백업 파일이 없습니다.');
  }

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}