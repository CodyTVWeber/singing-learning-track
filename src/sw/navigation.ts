export function isNavigationRequest(request: Pick<Request, 'mode' | 'destination'>): boolean {
  return request.mode === 'navigate' || request.destination === 'document';
}

export function shouldUseNetworkNavigationResponse(
  response: Pick<Response, 'ok' | 'redirected' | 'url'>,
  requestUrl: string
): boolean {
  if (!response.ok) {
    return false;
  }

  if (response.redirected) {
    return false;
  }

  try {
    const requestPath = new URL(requestUrl).pathname;
    const responsePath = new URL(response.url).pathname;
    return requestPath === responsePath;
  } catch {
    return false;
  }
}

export function createAppShellResponse(body: string | null | undefined): Response | null {
  if (body == null || body === '') {
    return null;
  }

  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
