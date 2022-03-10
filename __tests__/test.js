import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { promises as fs } from 'fs';
import path from 'path';
import init from '../src/init.js';

beforeEach(async () => {
  const pathToHtml = path.join(__dirname, '__fixtures__/index.html');
  const html = await fs.readFile(pathToHtml, 'utf-8');
  document.body.innerHTML = html;
  await init();
});

test('form init', () => {
  expect(screen.getByTestId('form_test')).toBeInTheDocument();
});

test('input init', () => {
  expect(screen.getByRole('textbox', { name: 'url' })).toBeInTheDocument();
});

test('adding', async () => {
  const rssUrl = 'https://ru.hexlet.io/lessons.rss';

  await userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  await userEvent.click(screen.getByRole('button', { name: 'add' }));

  expect(await screen.findByText(/RSS успешно загружен/i)).toBeInTheDocument();
});

test('validation (unique)', async () => {
  const rssUrl = 'https://ru.hexlet.io/lessons.rss';
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  userEvent.click(screen.getByRole('button', { name: 'add' }));

  expect(await screen.findByText(/RSS успешно загружен/i)).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  userEvent.click(screen.getByRole('button', { name: 'add' }));

  expect(await screen.findByText(/RSS уже существует/i)).toBeInTheDocument();
});

test('validation (valid url)', async () => {
  await userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'wrong');
  await userEvent.click(screen.getByRole('button', { name: 'add' }));
  expect(await screen.findByText(/Ссылка должна быть валидным URL/i)).toBeInTheDocument();
});

test('modal', async () => {
  const rssUrl = 'https://ru.hexlet.io/lessons.rss';

  await userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  await userEvent.click(screen.getByRole('button', { name: 'add' }));

  const previewBtns = await screen.findAllByRole('button', { name: /Просмотр/i });
  expect(screen.getByRole('link', { name: /Агрегация \/ Python: Деревья/i })).toHaveClass('fw-bold');
  await userEvent.click(previewBtns[0]);
  const modalBody = await screen.findByText('Цель: Научиться извлекать из дерева необходимые данные');
  await waitFor(() => {
    expect(modalBody).toBeVisible();
  });
  expect(screen.getByRole('link', { name: /Агрегация \/ Python: Деревья/i })).not.toHaveClass('fw-bold');
});
