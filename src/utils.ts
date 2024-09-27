import CalendarProPlugin from "./main";
import { App, normalizePath, Notice, TFile } from "obsidian";
import { CalendarProSettings } from "./settings";
import moment from "moment";

export enum NoteType {
	DAILY = "daily",
	WEEKLY = "weekly",
	MONTHLY = "monthly",
	QUATERLY = "quaterly",
	YEARLY = "yearly",
}

export function getFilePath(
	date: Date,
	type: NoteType,
	settings: CalendarProSettings
) {
	switch (type) {
		case NoteType.DAILY:
			return normalizePath(`${settings.rootFolder}/${settings.diaryFolder}/${moment(date).format(settings.diaryFileName)}.md`);
		case NoteType.WEEKLY:
			return normalizePath(`${settings.rootFolder}/${settings.weeklyFolder}/${moment(date).format(settings.weeklyFileName)}.md`);
		case NoteType.MONTHLY:
			return normalizePath(`${settings.rootFolder}/${settings.monthlyFolder}/${moment(date).format(settings.monthlyFileName)}.md`);
		case NoteType.QUATERLY:
			return normalizePath(`${settings.rootFolder}/${settings.quarterlyFolder}/${moment(date).format(settings.quarterlyFileName)}.md`);
		case NoteType.YEARLY:
			return normalizePath(`${settings.rootFolder}/${settings.yearlyFolder}/${moment(date).format(settings.yearlyFileName)}.md`);
		default:
			return "";
	}
}

export async function createOrOpenExistFile(
	app: App,
	folderPath: string,
	fileName: string,
	template?: string
) {
	const folderExists = await app.vault.adapter.exists(folderPath);
	if (!folderExists) {
		await app.vault.createFolder(folderPath);
	}
	const filePath = normalizePath(`${folderPath}/${fileName}.md`);
	const file = app.vault.getAbstractFileByPath(filePath);
	if (file) {
		await app.workspace.openLinkText(filePath, "");
	} else {
		let content = ``;
		if (template) {
			const templateFile = app.vault.getAbstractFileByPath(template);
			if (templateFile && templateFile instanceof TFile) {
				content = await app.vault.read(templateFile);
			} else {
				new Notice(`Template: ${template} not found`);
			}
		}
		await app.vault.create(filePath, content);
		await app.workspace.openLinkText(filePath, "");
	}
}

export async function clickToOpenFile(
	app: App,
	plugin: CalendarProPlugin,
	type: NoteType,
	fileTitle: string
) {
	switch (type) {
		case NoteType.DAILY:
			await createOrOpenExistFile(
				app,
				normalizePath(
					`${plugin.settings.rootFolder}/${plugin.settings.diaryFolder}`
				),
				fileTitle,
				plugin.settings.diaryFileTemplate
			);
			break;
		case NoteType.WEEKLY:
			await createOrOpenExistFile(
				app,
				normalizePath(
					`${plugin.settings.rootFolder}/${plugin.settings.weeklyFolder}`
				),
				fileTitle,
				plugin.settings.weeklyFileTemplate
			);
			break;
		case NoteType.MONTHLY:
			await createOrOpenExistFile(
				app,
				normalizePath(
					`${plugin.settings.rootFolder}/${plugin.settings.monthlyFolder}`
				),
				fileTitle,
				plugin.settings.monthlyFileTemplate
			);
			break;
		case NoteType.QUATERLY:
			await createOrOpenExistFile(
				app,
				normalizePath(
					`${plugin.settings.rootFolder}/${plugin.settings.quarterlyFolder}`
				),
				fileTitle,
				plugin.settings.quarterlyFileTemplate
			);
			break;
		case NoteType.YEARLY:
			await createOrOpenExistFile(
				app,
				normalizePath(
					`${plugin.settings.rootFolder}/${plugin.settings.yearlyFolder}`
				),
				fileTitle,
				plugin.settings.yearlyFileTemplate
			);
			break;
	}
}
