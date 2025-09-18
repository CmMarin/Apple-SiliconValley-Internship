import { app, BrowserWindow, Menu, shell, nativeImage } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { spawn } from 'child_process';

const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
const FRONTEND_DEV_URL = 'http://localhost:3000';

function waitForUrl(targetUrl: string, timeoutMs = 30000, intervalMs = 500): Promise<void> {
	return new Promise((resolve, reject) => {
		const start = Date.now();
		const tryFetch = async () => {
			try {
				const res = await fetch(targetUrl, { method: 'GET' });
				if (res.ok) return resolve();
			} catch {}
			if (Date.now() - start > timeoutMs) return reject(new Error(`Timeout waiting for ${targetUrl}`));
			setTimeout(tryFetch, intervalMs);
		};
		tryFetch();
	});
}

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
	// Optionally set an app icon if present in assets/icon.png
	let icon: Electron.NativeImage | undefined;
	try {
		const iconPath = path.join(__dirname, '..', 'assets', 'icon.png');
		icon = nativeImage.createFromPath(iconPath);
	} catch {}
		mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		show: false,
		backgroundColor: '#f8fafc',
			icon,
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	mainWindow.once('ready-to-show', () => mainWindow?.show());
	mainWindow.on('closed', () => (mainWindow = null));

		// Custom minimal menu
		const template: Electron.MenuItemConstructorOptions[] = [
			{
				label: 'File',
				submenu: [
					{ role: process.platform === 'darwin' ? 'close' : 'quit' },
				],
			},
			{
				label: 'View',
				submenu: [
					{ role: 'reload' },
					{ role: 'toggleDevTools' },
					{ type: 'separator' },
					{ role: 'resetZoom' },
					{ role: 'zoomIn' },
					{ role: 'zoomOut' },
					{ type: 'separator' },
					{ role: 'togglefullscreen' },
				],
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'Learn More',
						click: () => shell.openExternal('https://github.com'),
					},
				],
			},
		];
		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);

	if (isDev) {
		// Try to open the dev server; if not up yet, wait briefly
		try {
			await waitForUrl(FRONTEND_DEV_URL, 30000, 500);
			await mainWindow.loadURL(FRONTEND_DEV_URL);
		} catch (e) {
			// If port 3000 is busy and Next picks another port, open 3001 as a fallback
			const alt = 'http://localhost:3001';
			try {
				await waitForUrl(alt, 10000, 500);
				await mainWindow.loadURL(alt);
			} catch {
				// Last resort: open an error page
				await mainWindow.loadURL('data:text/html,Failed to reach frontend dev server. Start Next.js and try again.');
			}
		}
	} else {
		// Load the built Next.js app from dist (assuming it’s served as static files via file://)
		const indexPath = path.join(__dirname, '..', '..', 'frontend', 'out', 'index.html');
		await mainWindow.loadURL(url.pathToFileURL(indexPath).toString());
	}

	// Open external links in default browser
	mainWindow.webContents.setWindowOpenHandler(({ url: target }) => {
		shell.openExternal(target);
		return { action: 'deny' };
	});
}

app.whenReady().then(async () => {
	await createWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

