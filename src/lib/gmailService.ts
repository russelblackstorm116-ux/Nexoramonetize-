export interface GmailMessage {
  id: string;
  threadId: string;
  sender: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
  type: 'sponsor' | 'general' | 'adsense';
}

// Simple base64 decode for Gmail MIME parts safely
function decodeGmailBody(raw: string): string {
  if (!raw) return '';
  const cleaned = raw.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return decodeURIComponent(
      atob(cleaned)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    try {
      return atob(cleaned);
    } catch (err) {
      return 'Could not decode email body content.';
    }
  }
}

// Find header value by name
function getHeader(headers: { name: string; value: string }[], name: string): string {
  const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
}

export async function fetchGmailMessages(accessToken: string): Promise<GmailMessage[]> {
  // Query messages with query filters to specifically target sponsorships, brands or ad networks
  const q = encodeURIComponent("subject:(sponsor OR partnership OR collaboration OR advertising OR brand OR monetization) OR \"sponsorship\" OR \"partnership\" OR \"brand deal\"");
  const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15&q=${q}`;

  const response = await fetch(listUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Gmail API failure: ${response.statusText}`);
  }

  const listData = await response.json();
  if (!listData.messages || !Array.isArray(listData.messages)) {
    return [];
  }

  const detailedMessages: GmailMessage[] = [];

  // Fetch details for each message in parallel safely
  const detailPromises = listData.messages.map(async (msg: { id: string }) => {
    try {
      const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`;
      const detailRes = await fetch(detailUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!detailRes.ok) return null;
      const detail = await detailRes.json();

      const headers = detail.payload.headers || [];
      const subject = getHeader(headers, 'subject') || '(No Subject)';
      const sender = getHeader(headers, 'from') || 'Unknown Sender';
      const dateVal = getHeader(headers, 'date') || '';

      // Extract body
      let bodyText = '';
      if (detail.payload.parts) {
        // Look for plain text body first
        const textPart = detail.payload.parts.find((part: any) => part.mimeType === 'text/plain');
        if (textPart && textPart.body && textPart.body.data) {
          bodyText = decodeGmailBody(textPart.body.data);
        } else {
          // Fallback to HTML body
          const htmlPart = detail.payload.parts.find((part: any) => part.mimeType === 'text/html');
          if (htmlPart && htmlPart.body && htmlPart.body.data) {
            bodyText = decodeGmailBody(htmlPart.body.data).replace(/<[^>]*>/g, ' '); // simple stripping
          }
        }
      } else if (detail.payload.body && detail.payload.body.data) {
        bodyText = decodeGmailBody(detail.payload.body.data);
      }

      // Determine categorization
      let type: 'sponsor' | 'general' | 'adsense' = 'general';
      const lowercaseSub = subject.toLowerCase() + bodyText.toLowerCase();
      if (lowercaseSub.includes('adsense') || lowercaseSub.includes('payment from google')) {
        type = 'adsense';
      } else if (lowercaseSub.includes('sponsor') || lowercaseSub.includes('partnership') || lowercaseSub.includes('brand deal') || lowercaseSub.includes('collaboration')) {
        type = 'sponsor';
      }

      return {
        id: detail.id,
        threadId: detail.threadId,
        sender,
        subject,
        snippet: detail.snippet || '',
        date: dateVal,
        body: bodyText,
        type
      };
    } catch (e) {
      console.warn(`Failed parsing message ID ${msg.id}`, e);
      return null;
    }
  });

  const resolved = await Promise.all(detailPromises);
  resolved.forEach((m) => {
    if (m) detailedMessages.push(m);
  });

  return detailedMessages;
}

// Send email using raw MIME layout
export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  const mimeMessage = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    body
  ].join('\r\n');

  // Convert raw message string to base64url format safely
  const encodedEmail = btoa(unescape(encodeURIComponent(mimeMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: encodedEmail
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail Send failure: ${errText}`);
  }

  return true;
}
