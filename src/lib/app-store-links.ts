export const APP_STORE_URL =
  'https://apps.apple.com/in/app/tallycashpro/id6752299114';

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.tallycashpro.app';

export function getStoreUrl(userAgent: string): string {
  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    return APP_STORE_URL;
  }
  if (/Android/i.test(userAgent)) {
    return PLAY_STORE_URL;
  }
  return PLAY_STORE_URL;
}
