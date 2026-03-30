import type { AppScreen } from '../../types';

export const loadVestiarioScreen = () => import('./VestiarioScreen');
export const loadAlbumScreen = () => import('./AlbumScreen');
export const loadPranchetaScreen = () => import('./PranchetaScreen');
export const loadCampoScreen = () => import('./CampoScreen');
export const loadMatchScreen = () => import('./MatchScreen');
export const loadCampeonatoScreen = () => import('./CampeonatoScreen');
export const loadBoletimTecnicoScreen = () => import('./BoletimTecnicoScreen');

const screenLoaders: Record<AppScreen, () => Promise<unknown>> = {
  vestiario: loadVestiarioScreen,
  album: loadAlbumScreen,
  prancheta: loadPranchetaScreen,
  campo: loadCampoScreen,
  match: loadMatchScreen,
  campeonato: loadCampeonatoScreen,
  boletim: loadBoletimTecnicoScreen,
};

const prefetchedScreens = new Set<AppScreen>();

export const prefetchScreen = (screen: AppScreen): void => {
  if (prefetchedScreens.has(screen)) return;
  prefetchedScreens.add(screen);
  void screenLoaders[screen]();
};

export const prefetchScreens = (screens: AppScreen[]): void => {
  screens.forEach(prefetchScreen);
};
