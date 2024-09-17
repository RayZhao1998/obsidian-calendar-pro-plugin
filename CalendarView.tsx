import { App } from "obsidian";
import React, { useState } from "react";

export const CalendarView = (props: { app: App }) => {
	const { app } = props;
	const [currentDate, setCurrentDate] = useState(new Date());
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const today = new Date();
	const weeks = getWeeksInMonth(year, month);

	const changeMonth = (delta: number) => {
		setCurrentDate(new Date(year, month + delta, 1));
	};

	const handleTodayClick = () => {
		setCurrentDate(today);
	};

	const handleDateClick = async (date: Date) => {
		const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
			.toString()
			.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
		const fileName = `${formattedDate}.md`;
		const file = app.vault.getAbstractFileByPath(fileName);

		if (file) {
			// File exists, open it
			await app.workspace.openLinkText(fileName, "");
		} else {
			// File doesn't exist, create it
			const _ = await app.vault.create(
				fileName,
				`# ${formattedDate}\n\n`
			);
			await app.workspace.openLinkText(fileName, "");
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
				{["日", "一", "二", "三", "四", "五", "六"].map((day) => (
					<div
						key={day}
						style={{ width: "40px", textAlign: "center" }}
					>
						{day}
					</div>
				))}
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

const getWeeksInMonth = (year: number, month: number) => {
	const weeks = [];
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

	// 获取上个月的最后几天
	const prevMonthDays = [];
	for (let i = 0; i < firstDay.getDay(); i++) {
		const day = new Date(year, month, -i);
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

	// 填充下个月的前几天
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
