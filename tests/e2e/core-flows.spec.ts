import { expect, test } from '@playwright/test';

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
    await expect(page.getByText('Álbum da Copa')).toBeVisible();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Vestiário do Craque Fônico')).toBeVisible();

    await context.setOffline(true);
    await page.getByRole('button', { name: /Abrir Meu Álbum/i }).click();
    await expect(page.getByText('Álbum da Copa')).toBeVisible();

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
