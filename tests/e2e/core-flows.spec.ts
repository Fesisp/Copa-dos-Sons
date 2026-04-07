import { expect, test } from '@playwright/test';

const expectAlbumScreenVisible = async (page: import('@playwright/test').Page) => {
  await expect(page.getByRole('heading', { name: /Álbum da Copa/i })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/Inventário de Fonemas/i)).toBeVisible({ timeout: 30_000 });
};

test.describe('Copa dos Sons - Core Offline/Agent/VAR flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.evaluate(async () => {
      const dbPath = '/src/services/databaseService.ts';
      const storePath = '/src/store/gameStore.ts';
      const dbMod = await import(/* @vite-ignore */ dbPath);
      const storeMod = await import(/* @vite-ignore */ storePath);
      const player = await dbMod.playerService.upsertPlayer('Craque da Turma');
      storeMod.useGameStore.getState().setCurrentPlayer(player);
    });

    await expect(page.getByRole('button', { name: /Ir para o Treino/i })).toBeVisible({ timeout: 45_000 });
  });

  test('offline-first smoke after route warmup', async ({ page, context }) => {
    await page.getByRole('button', { name: /Abrir Meu Álbum/i }).click();
    await expectAlbumScreenVisible(page);

    await page.getByRole('button', { name: /Vestiário/i }).click();
    await expect(page.getByRole('button', { name: /Ir para o Treino/i })).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /Abrir Meu Álbum/i }).click();
    await expectAlbumScreenVisible(page);

    await page.getByRole('button', { name: /Vestiário/i }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('button', { name: /Ir para o Treino/i })).toBeVisible({ timeout: 20_000 });

    await context.setOffline(true);
    await page.getByRole('button', { name: /Abrir Meu Álbum/i }).click();
    await expectAlbumScreenVisible(page);

    await context.setOffline(false);
  });

  test('agent controls and autonomous turn feedback in match', async ({ page }) => {
    await page.getByRole('button', { name: /Ir para o Treino/i }).click();
    await expect(page.getByRole('heading', { name: /Partidas Oficiais/i })).toBeVisible();

    await page.getByRole('button', { name: /Entrar em Campo|Jogar Novamente/i }).first().click();
    await expect(page.getByText(/Modo Missão/i)).toBeVisible();

    await page.getByRole('button', { name: /Agente ON|Agente OFF/i }).click();
    await expect(page.getByRole('button', { name: /Agente OFF/i })).toBeVisible();

    await page.getByRole('button', { name: /Agente OFF/i }).click();
    await expect(page.getByRole('button', { name: /Agente ON/i })).toBeVisible();

    await page.getByRole('button', { name: 'HARD' }).click();

    await page.evaluate(async () => {
      const storePath = '/src/store/gameStore.ts';
      const mod = await import(/* @vite-ignore */ storePath);
      mod.useGameStore.getState().passTurn();
    });

    await expect(page.getByText(/está pensando/i)).toBeVisible();
    await expect(page.getByText(/Klayton/i).first()).toBeVisible();
  });

  test('official match full loop reaches victory and returns to official board', async ({ page }) => {
    await page.getByRole('button', { name: /Ir para o Treino/i }).click();
    await expect(page.getByRole('heading', { name: /Partidas Oficiais/i })).toBeVisible();

    await page.getByRole('button', { name: /Entrar em Campo|Jogar Novamente/i }).first().click();
    await expect(page.getByText(/Modo Missão/i)).toBeVisible();

    await page.evaluate(async () => {
      const storePath = '/src/store/gameStore.ts';
      const mod = await import(/* @vite-ignore */ storePath);
      const storeApi = mod.useGameStore;
      const { targetWord } = storeApi.getState();

      targetWord.forEach((token: string, index: number) => {
        storeApi.getState().handleDrop(token, index);
      });
    });

    await expect(page.getByText(/GOLAÇO!/i)).toBeVisible();
    await page.getByRole('button', { name: /Continuar a Jogar/i }).click();
    await expect(page.getByRole('heading', { name: /Partidas Oficiais/i })).toBeVisible();
  });

  test('community match triggers VAR voting modal', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.evaluate(async () => {
      const dbPath = '/src/services/databaseService.ts';
      const dbMod = await import(/* @vite-ignore */ dbPath);
      await dbMod.customWordService.saveCustomWord(['a', 'e'], 'Craque da Turma');
    });

    await page.getByRole('button', { name: /Abrir Campeonato/i }).click();
    await expect(page.getByRole('heading', { name: /Campeonato da Turma/i })).toBeVisible();

    await page.getByRole('button', { name: /Jogar/i }).first().click();

    await page.evaluate(async () => {
      const storePath = '/src/store/gameStore.ts';
      const storeMod = await import(/* @vite-ignore */ storePath);
      storeMod.useGameStore.setState({ matchStatus: 'victory', crowdDelta: 100 });
    });

    await expect(page.getByText(/VAR - Árbitro de Vídeo/i)).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /Golaço/i }).first().click();
    await expect(page.getByText(/Campeonato da Turma/i)).toBeVisible();
  });
});
