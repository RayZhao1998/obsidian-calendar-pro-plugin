import { App, PluginSettingTab, Setting } from "obsidian";
import CalendarProPlugin from "./main";

export interface CalendarProSettings {
	// general settings
	startDayOfWeek: string;
	showConfirmBeforeCreate: boolean;
	rootFolder: string;
	// diary settings
	diaryFolder: string;
	diaryFileName: string;
	diaryFileTemplate: string;
	// weekly settings
	weeklyFolder: string;
	weeklyFileName: string;
	weeklyFileTemplate: string;
	// monthly settings
	monthlyFolder: string;
	monthlyFileName: string;
	monthlyFileTemplate: string;
	// quarterly settings
	quarterlyFolder: string;
	quarterlyFileName: string;
	quarterlyFileTemplate: string;
	// yearly settings
	yearlyFolder: string;
	yearlyFileName: string;
	yearlyFileTemplate: string;
}

export const DEFAULT_SETTINGS: CalendarProSettings = {
	startDayOfWeek: "0",
	showConfirmBeforeCreate: true,
	rootFolder: "Calendar Pro",
	diaryFolder: "Diary",
	diaryFileName: "YYYY-MM-DD",
	diaryFileTemplate: "Daily Template",
	weeklyFolder: "Weekly",
	weeklyFileName: "gggg-[W]ww",
	weeklyFileTemplate: "Weekly Template",
	monthlyFolder: "Monthly",
	monthlyFileName: "YYYY-MM",
	monthlyFileTemplate: "Monthly Template",
	quarterlyFolder: "Quarterly",
	quarterlyFileName: "YYYY-[Q]Q",
	quarterlyFileTemplate: "Quarterly Template",
	yearlyFolder: "Yearly",
	yearlyFileName: "YYYY",
	yearlyFileTemplate: "Yearly Template",
};

export class CalendarProSettingTab extends PluginSettingTab {
	plugin: CalendarProPlugin;

	constructor(app: App, plugin: CalendarProPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h3", { text: "General Settings" });

		new Setting(containerEl)
			.setName("Start day of week")
			.setDesc("The day of the week that the calendar should start on.")
			.addDropdown((dropdown) => {
				dropdown.addOption("0", "Sunday");
				dropdown.addOption("1", "Monday");
				dropdown.addOption("2", "Tuesday");
				dropdown.addOption("3", "Wednesday");
				dropdown.addOption("4", "Thursday");
				dropdown.addOption("5", "Friday");
				dropdown.addOption("6", "Saturday");
				dropdown.setValue(this.plugin.settings.startDayOfWeek);
				dropdown.onChange((value) => {
					this.plugin.settings.startDayOfWeek = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Root Folder")
			.setDesc("The root folder of the calendar.")
			.addText((text) => {
				text.setValue(this.plugin.settings.rootFolder);
				text.onChange((value) => {
					this.plugin.settings.rootFolder = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Show confirm before create")
			.setDesc(
				"Whether to show a confirm dialog before creating a new note."
			)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.showConfirmBeforeCreate);
				toggle.onChange((value) => {
					this.plugin.settings.showConfirmBeforeCreate = value;
					this.plugin.saveSettings();
				});
			});

		containerEl.createEl("h3", { text: "Daily Note Settings" });
		new Setting(containerEl)
			.setName("Daily Note File Name")
			.setDesc("The name of the daily note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.diaryFileName);
				text.onChange((value) => {
					this.plugin.settings.diaryFileName = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Daily Note File Template")
			.setDesc("The template of the daily note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.diaryFileTemplate);
				text.onChange((value) => {
					this.plugin.settings.diaryFileTemplate = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Daily Note Folder")
			.setDesc("The folder of the daily note.")
			.addText((text) => {
				text.setValue(this.plugin.settings.diaryFolder);
				text.onChange((value) => {
					this.plugin.settings.diaryFolder = value;
					this.plugin.saveSettings();
				});
			});

		containerEl.createEl("h3", { text: "Weekly Note Settings" });
		new Setting(containerEl)
			.setName("Weekly Note File Name")
			.setDesc("The name of the weekly note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.weeklyFileName);
				text.onChange((value) => {
					this.plugin.settings.weeklyFileName = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Weekly Note File Template")
			.setDesc("The template of the weekly note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.weeklyFileTemplate);
				text.onChange((value) => {
					this.plugin.settings.weeklyFileTemplate = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Weekly Note Folder")
			.setDesc("The folder of the weekly note.")
			.addText((text) => {
				text.setValue(this.plugin.settings.weeklyFolder);
				text.onChange((value) => {
					this.plugin.settings.weeklyFolder = value;
					this.plugin.saveSettings();
				});
			});

		containerEl.createEl("h3", { text: "Monthly Note Settings" });
		new Setting(containerEl)
			.setName("Monthly Note File Name")
			.setDesc("The name of the monthly note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.monthlyFileName);
				text.onChange((value) => {
					this.plugin.settings.monthlyFileName = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Monthly Note File Template")
			.setDesc("The template of the monthly note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.monthlyFileTemplate);
				text.onChange((value) => {
					this.plugin.settings.monthlyFileTemplate = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Monthly Note Folder")
			.setDesc("The folder of the monthly note.")
			.addText((text) => {
				text.setValue(this.plugin.settings.monthlyFolder);
				text.onChange((value) => {
					this.plugin.settings.monthlyFolder = value;
					this.plugin.saveSettings();
				});
			});

		containerEl.createEl("h3", { text: "Quarterly Note Settings" });
		new Setting(containerEl)
			.setName("Quarterly Note File Name")
			.setDesc("The name of the quarterly note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.quarterlyFileName);
				text.onChange((value) => {
					this.plugin.settings.quarterlyFileName = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Quarterly Note File Template")
			.setDesc("The template of the quarterly note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.quarterlyFileTemplate);
				text.onChange((value) => {
					this.plugin.settings.quarterlyFileTemplate = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Quarterly Note Folder")
			.setDesc("The folder of the quarterly note.")
			.addText((text) => {
				text.setValue(this.plugin.settings.quarterlyFolder);
				text.onChange((value) => {
					this.plugin.settings.quarterlyFolder = value;
					this.plugin.saveSettings();
				});
			});

		containerEl.createEl("h3", { text: "Yearly Note Settings" });
		new Setting(containerEl)
			.setName("Yearly Note File Name")
			.setDesc("The name of the yearly note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.yearlyFileName);
				text.onChange((value) => {
					this.plugin.settings.yearlyFileName = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Yearly Note File Template")
			.setDesc("The template of the yearly note file.")
			.addText((text) => {
				text.setValue(this.plugin.settings.yearlyFileTemplate);
				text.onChange((value) => {
					this.plugin.settings.yearlyFileTemplate = value;
					this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Yearly Note Folder")
			.setDesc("The folder of the yearly note.")
			.addText((text) => {
				text.setValue(this.plugin.settings.yearlyFolder);
				text.onChange((value) => {
					this.plugin.settings.yearlyFolder = value;
					this.plugin.saveSettings();
				});
			});
	}
}
