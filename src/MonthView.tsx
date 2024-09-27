import React, { useState } from "react";
import { App, moment } from "obsidian";
import CalendarProPlugin from "./main";
import { clickToOpenFile, getFilePath, NoteType } from "./utils";

export const MonthView = ({
	app,
	plugin,
}: {
	app: App;
	plugin: CalendarProPlugin;
}) => {
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const today = new Date();

	const changeYear = (delta: number) => {
		setCurrentYear(currentYear + delta);
	};

	const handleMonthClick = async (month: number) => {
		const { monthlyFileName } = plugin.settings;
		const date = moment()
			.year(currentYear)
			.month(month - 1);
		const formattedDate = date.format(monthlyFileName);
		await clickToOpenFile(app, plugin, NoteType.MONTHLY, formattedDate);
	};

	const handleQuarterClick = async (quarter: number) => {
		const { quarterlyFileName } = plugin.settings;
		const date = moment().year(currentYear).quarter(quarter);
		const formattedDate = date.format(quarterlyFileName);
		await clickToOpenFile(app, plugin, NoteType.QUATERLY, formattedDate);
	};

	const handleYearClick = async (year: number) => {
		const { yearlyFileName } = plugin.settings;
		const date = moment().year(year);
		const formattedDate = date.format(yearlyFileName);
		await clickToOpenFile(app, plugin, NoteType.YEARLY, formattedDate);
	};

	const handleThisMonthClick = () => {
		setCurrentYear(new Date().getFullYear());
	};

	const handleMonthHover = (
		year: number,
		month: number,
		event: React.MouseEvent
	) => {
		const targetEl = event.currentTarget;

		const monthDate = new Date(year, month - 1, 1);

		app.workspace.trigger(
			"link-hover",
			{
				event,
				source: "calendar",
				targetEl,
				linktext: getFilePath(
					monthDate,
					NoteType.MONTHLY,
					plugin.settings
				),
			},
			targetEl,
			getFilePath(monthDate, NoteType.MONTHLY, plugin.settings),
			getFilePath(monthDate, NoteType.MONTHLY, plugin.settings)
		);
	};

	const handleQuarterHover = (year: number, quarter: number, event: React.MouseEvent) => {
		const targetEl = event.currentTarget;

		const quarterDate = new Date(year, (quarter - 1) * 3, 1);

		app.workspace.trigger(
			"link-hover",
			{
				event,
				source: "calendar",
				targetEl,
				linktext: getFilePath(quarterDate, NoteType.QUATERLY, plugin.settings),
			},
			targetEl,
			getFilePath(quarterDate, NoteType.QUATERLY, plugin.settings),
			getFilePath(quarterDate, NoteType.QUATERLY, plugin.settings)
		);
	};

	const handleYearHover = (year: number, event: React.MouseEvent) => {
		const targetEl = event.currentTarget;

		const yearDate = new Date(year, 0, 1);

		app.workspace.trigger(
			"link-hover",
			{
				event,
				source: "calendar",
				targetEl,
				linktext: getFilePath(yearDate, NoteType.YEARLY, plugin.settings),
			},
			targetEl,
			getFilePath(yearDate, NoteType.YEARLY, plugin.settings),
			getFilePath(yearDate, NoteType.YEARLY, plugin.settings)
		);
	};


	const quarters = [
		{ q: "Q1", months: [1, 2, 3] },
		{ q: "Q2", months: [4, 5, 6] },
		{ q: "Q3", months: [7, 8, 9] },
		{ q: "Q4", months: [10, 11, 12] },
	];

	return (
		<div
			style={{
				fontFamily: "Arial, sans-serif",
				backgroundColor: "var(--color-base-20)",
				display: "flex",
				padding: "10px",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "10px",
				}}
			>
				<h2
					style={{ color: "var(--color-green)", margin: 0 }}
					onClick={() => handleYearClick(currentYear)}
					onMouseEnter={(event) => handleYearHover(currentYear, event)}
				>
					{currentYear}
				</h2>
				<div>
					<button onClick={() => changeYear(-1)} style={buttonStyle}>
						←
					</button>
					<button
						onClick={() => handleThisMonthClick()}
						style={buttonStyle}
					>
						This month
					</button>
					<button onClick={() => changeYear(1)} style={buttonStyle}>
						→
					</button>
				</div>
			</div>
			{quarters.map((quarter, index) => (
				<div
					key={quarter.q}
					style={{
						display: "flex",
						marginBottom: "10px",
						justifyContent: "space-between",
					}}
				>
					<div
						style={{
							width: "40px",
							backgroundColor:
								today.getFullYear() === currentYear &&
								Math.floor(today.getMonth() / 3) === index
									? "var(--color-base-20)"
									: "transparent",
							color: "var(--color-orange)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
						}}
						onClick={() => handleQuarterClick(index + 1)}
						onMouseEnter={(event) => handleQuarterHover(currentYear, index + 1, event)}
					>
						{quarter.q}
					</div>
					{quarter.months.map((month) => (
						<div
							key={month}
							style={{
								width: "80px",
								backgroundColor:
									today.getFullYear() === currentYear &&
									today.getMonth() + 1 === month
										? "hsl(var(--accent-h), var(--accent-s), var(--accent-l))"
										: "transparent",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
							}}
							onClick={() => handleMonthClick(month)}
							onMouseEnter={(event) => handleMonthHover(currentYear, month, event)}
						>
							{moment()
								.month(month - 1)
								.format("MMM")}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

const buttonStyle = {
	backgroundColor: "var(--color-base-20)",
	border: "none",
	color: "var(--color-base-100)",
	padding: "5px 10px",
	fontSize: "16px",
	cursor: "pointer",
	margin: "0 5px",
};
