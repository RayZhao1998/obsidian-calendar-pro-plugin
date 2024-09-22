import React from "react";
import { Plugin, ItemView, WorkspaceLeaf, IconName } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { SideBarReactView } from "./SideBarReactView";
import {
	CalendarProSettings,
	CalendarProSettingTab,
	DEFAULT_SETTINGS,
} from "./settings";

// Remember to rename these classes and interfaces!

export default class CalendarProPlugin extends Plugin {
	settings: CalendarProSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			SideBarViewType,
			(leaf) => new SideBarView(leaf, this)
		);

		this.addCommand({
			id: "activate-calendar-pro-view",
			name: "Activate Calendar Pro View",
			callback: () => {
				this.activateView();
			},
		});

		this.addSettingTab(new CalendarProSettingTab(this.app, this));

		if (this.app.workspace.layoutReady) {
			await this.activateView();
		}
	}

	async activateView() {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(SideBarViewType);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: SideBarViewType, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf!);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

const SideBarViewType = "sidebar-view";

export class SideBarView extends ItemView {
	root: Root | null = null;
	plugin: CalendarProPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: CalendarProPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return SideBarViewType;
	}

	getDisplayText(): string {
		return "Calendar Pro";
	}

	getIcon(): IconName {
		return "calendar";
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<SideBarReactView app={this.app} plugin={this.plugin} />
		);
	}
}
