import CalendarProPlugin from "main";
import { App, moment } from "obsidian";
import React, { useState } from "react";

export const CalendarView = (props: {
	app: App;
	plugin: CalendarProPlugin;
}) => {
	const { app, plugin } = props;
	const [currentDate, setCurrentDate] = useState(new Date());
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const today = new Date();
	const weeks = getWeeksInMonth(
		year,
		month,
		Number(plugin.settings.startDayOfWeek) ?? 0
	);

	const changeMonth = (delta: number) => {
		setCurrentDate(new Date(year, month + delta, 1));
	};

	const handleTodayClick = () => {
		setCurrentDate(today);
	};

	const handleDateClick = async (date: Date) => {
		const { rootFolder, diaryFolder, diaryFileName } = plugin.settings;

		// Format the date using moment.js
		const formattedDate = moment(date).format(diaryFileName);

		// Construct the full path
		const folderPath = `${rootFolder}/${diaryFolder}`.replace(
			/^\/+|\/+$/g,
			""
		); // Remove leading/trailing slashes
		const filePath = `${folderPath}/${formattedDate}.md`;

		// Check if the folder exists, if not, create it
		const folderExists = await app.vault.adapter.exists(folderPath);
		if (!folderExists) {
			await app.vault.createFolder(folderPath);
		}

		const file = app.vault.getAbstractFileByPath(filePath);

		if (file) {
			// File exists, open it
			await app.workspace.openLinkText(filePath, "");
		} else {
			const content = ``;
			await app.vault.create(filePath, content);
			await app.workspace.openLinkText(filePath, "");
		}
	};

	const handleWeekClick = async (
		year: number,
		month: number,
		weekIndex: number
	) => {
		const { rootFolder, weeklyFolder, weeklyFileName } = plugin.settings;
		// Calculate the date of the first day of the selected week
		const weekStartDate = new Date(year, month, weekIndex * 7);

		// Format the date using moment.js
		const formattedDate = moment(weekStartDate).format(weeklyFileName);
		const folderPath = `${rootFolder}/${weeklyFolder}`.replace(
			/^\/+|\/+$/g,
			""
		);
		const filePath = `${folderPath}/${formattedDate}.md`;
		const folderExists = await app.vault.adapter.exists(folderPath);
		if (!folderExists) {
			await app.vault.createFolder(folderPath);
		}
		const file = app.vault.getAbstractFileByPath(filePath);
		if (file) {
			await app.workspace.openLinkText(filePath, "");
		} else {
			const content = ``;
			await app.vault.create(filePath, content);
			await app.workspace.openLinkText(filePath, "");
		}
	};

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
				<h2 style={{ color: "var(--color-green)", margin: 0 }}>
					{year}年{month + 1}月
				</h2>
				<div>
					<button onClick={() => changeMonth(-1)} style={buttonStyle}>
						←
					</button>
					<button
						onClick={() => handleTodayClick()}
						style={buttonStyle}
					>
						Today
					</button>
					<button onClick={() => changeMonth(1)} style={buttonStyle}>
						→
					</button>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					marginBottom: "5px",
					justifyContent: "space-between",
				}}
			>
				<div
					style={{
						color: "var(--color-orange)",
						width: "40px",
						textAlign: "center",
					}}
				>
					CW
				</div>
				{[...Array(7)].map((_, index) => {
					const dayIndex =
						(index + Number(plugin.settings.startDayOfWeek)) % 7;
					const days = [
						"Sun",
						"Mon",
						"Tue",
						"Wed",
						"Thu",
						"Fri",
						"Sat",
					];
					return (
						<div
							key={days[dayIndex]}
							style={{ width: "40px", textAlign: "center" }}
						>
							{days[dayIndex]}
						</div>
					);
				})}
			</div>
			{weeks.map((week, weekIndex) => {
				const isCurrentWeek = week.some(
					(day) =>
						day &&
						day.getDate() === today.getDate() &&
						day.getMonth() === today.getMonth() &&
						day.getFullYear() === today.getFullYear()
				);
				return (
					<div
						key={weekIndex}
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: "5px",
							height: "30px",
						}}
					>
						<div
							style={{
								width: "40px",
								color: "var(--color-base-100)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: isCurrentWeek
									? "var(--color-base-05)"
									: "transparent",
							}}
							onClick={() =>
								handleWeekClick(year, month, weekIndex)
							}
						>
							{getWeekNumber(year, month, weekIndex)}
						</div>
						{week.map((day, dayIndex) => {
							const isToday =
								day &&
								day.getDate() === today.getDate() &&
								day.getMonth() === today.getMonth() &&
								day.getFullYear() === today.getFullYear();
							const isCurrentMonth =
								day && day.getMonth() === month;
							return (
								<div
									key={dayIndex}
									style={{
										width: "40px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: isCurrentMonth
											? dayIndex === 0 || dayIndex === 6
												? "var(--color-base-70)"
												: "var(--color-base-100)"
											: "#555",
										backgroundColor: isToday
											? "hsl(var(--accent-h), var(--accent-s), var(--accent-l))"
											: isCurrentWeek
											? "var(--color-base-05)"
											: "transparent",
									}}
									onClick={() => handleDateClick(day)}
								>
									{day ? day.getDate() : ""}
								</div>
							);
						})}
					</div>
				);
			})}
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

const getWeeksInMonth = (
	year: number,
	month: number,
	startDayOfWeek: number
) => {
	const weeks = [];
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

	// Adjust the first day of the week
	let start = firstDay.getDay() - startDayOfWeek;
	if (start < 0) start += 7;

	// Get the last few days of the previous month
	const prevMonthDays = [];
	for (let i = 0; i < start; i++) {
		const day = new Date(year, month, -i + 1 - start);
		prevMonthDays.unshift(day);
	}

	let currentWeek = [...prevMonthDays];

	for (let day = 1; day <= lastDay.getDate(); day++) {
		currentWeek.push(new Date(year, month, day));
		if (currentWeek.length === 7) {
			weeks.push(currentWeek);
			currentWeek = [];
		}
	}

	// Fill in the first few days of the next month
	if (currentWeek.length > 0) {
		const nextMonthDays = 7 - currentWeek.length;
		for (let i = 1; i <= nextMonthDays; i++) {
			currentWeek.push(new Date(year, month + 1, i));
		}
		weeks.push(currentWeek);
	}

	return weeks;
};

const getWeekNumber = (year: number, month: number, weekIndex: number) => {
	const date = new Date(year, month, 1 + weekIndex * 7);
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
	const week1 = new Date(date.getFullYear(), 0, 4);
	return (
		1 +
		Math.round(
			((date.getTime() - week1.getTime()) / 86400000 -
				3 +
				((week1.getDay() + 6) % 7)) /
				7
		)
	);
};
