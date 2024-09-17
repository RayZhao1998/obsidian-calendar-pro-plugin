import React, { useState } from "react";
import { App } from "obsidian";

export const MonthView = ({ app }: { app: App }) => {
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const today = new Date();

	const changeYear = (delta: number) => {
		setCurrentYear(currentYear + delta);
	};

	const handleClick = async (type: "month" | "quarter", value: number) => {
		let fileName: string;
		let content: string;

		if (type === "month") {
			fileName = `${currentYear}-${value.toString().padStart(2, "0")}.md`;
			content = `# ${currentYear}年${value}月\n\n`;
		} else {
			fileName = `${currentYear}-Q${value}.md`;
			content = `# ${currentYear}年第${value}季度\n\n`;
		}

		const file = app.vault.getAbstractFileByPath(fileName);

		if (file) {
			await app.workspace.openLinkText(fileName, "");
		} else {
			await app.vault.create(fileName, content);
			await app.workspace.openLinkText(fileName, "");
		}
	};

	const handleThisMonthClick = () => {
		setCurrentYear(new Date().getFullYear());
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
				<h2 style={{ color: "var(--color-green)", margin: 0 }}>
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
						onClick={() => handleClick("quarter", index + 1)}
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
							onClick={() => handleClick("month", month)}
						>
							{month}月
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
