import React from "react";
import { Plugin, ItemView, WorkspaceLeaf, IconName } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { SideBarReactView } from "./SideBarReactView";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		this.registerView(SideBarViewType, (leaf) => new SideBarView(leaf));

		this.addRibbonIcon("dice", "Activate view", () => {
			this.activateView();
		});
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

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
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
		this.root.render(<SideBarReactView app={this.app} />);
	}
}
