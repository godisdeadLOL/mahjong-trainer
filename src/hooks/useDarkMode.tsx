import { useEffect, useState } from "preact/hooks"

export const useDarkMode = () => {
	const checkDarkMode = () => localStorage.getItem("mode") === "dark"

	const [isDarkMode, setIsDarkMode] = useState<boolean>(checkDarkMode())

	useEffect(() => {
		changeIsDarkMode(checkDarkMode())

		const handleStrorageChange = () => {
			setIsDarkMode(localStorage.getItem("mode") === "dark")
		}

		window.addEventListener("modeChange", handleStrorageChange)
		return () => window.removeEventListener("modeChange", handleStrorageChange)
	}, [])

	const changeIsDarkMode = (value: boolean) => {
		setIsDarkMode(value)

		localStorage.setItem("mode", value ? "dark" : "bright")
		window.dispatchEvent(new Event("modeChange"))

		document.body.className = value ? "dark" : ""
	}

	return { isDarkMode, setIsDarkMode: changeIsDarkMode }
}
