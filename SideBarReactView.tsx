import React from "react";
import "@radix-ui/themes/styles.css";
import { CalendarView } from "./CalendarView";
import { MonthView } from "./MonthView";
import { App } from "obsidian";
import * as Tabs from '@radix-ui/react-tabs';

export const SideBarReactView = (props: { app: App }) => {
	const { app } = props;

	return (
		<Tabs.Root
			className="TabsRoot"
			defaultValue="tab1"
			style={{ width: "100%" }}
		>
			<Tabs.List
				className="TabsList"
				aria-label="Select Mode"
			>
				<Tabs.Trigger className="TabsTrigger" value="tab1">
					Daily
				</Tabs.Trigger>
				<Tabs.Trigger className="TabsTrigger" value="tab2">
					Monthly
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content className="TabsContent" value="tab1">
				<CalendarView app={app} />
			</Tabs.Content>
			<Tabs.Content className="TabsContent" value="tab2">
				<MonthView app={app} />
			</Tabs.Content>
		</Tabs.Root>
	);
};
