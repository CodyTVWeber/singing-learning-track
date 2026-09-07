export function isNavigationRequest(request: Pick<Request, 'mode' | 'destination'>): boolean {
  return request.mode === 'navigate' || request.destination === 'document';
}
