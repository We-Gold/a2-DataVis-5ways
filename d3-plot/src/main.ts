import "./style.css"
import * as d3 from "d3"

/* AI Usage Note: Can you mimic the ggplot2 theme_grey? It should have a white grid with a gray background. */

const CSV_PATH = "/penglings.csv"

const SPECIES_COLORS: Record<string, string> = {
	Adelie: "orange",
	Chinstrap: "purple",
	Gentoo: "darkcyan",
}

const DEFAULT_SPECIES_COLOR = "#888888"

/* AI Usage Note: Can you make the scales have a bit of padding (lower min, higher max) so that the points aren't on the axes? */
function padDomain(
	domain: [number, number],
	padFraction: number = 0.05,
): [number, number] {
	const [min, max] = domain
	const span = max - min
	const pad = span === 0 ? 1 : span * padFraction
	return [min - pad, max + pad]
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>d3-plot</h1>
    <div id="chart"></div>
  </div>
`

d3.csv(CSV_PATH).then((data) => {
	const parsed = data
		.map((d) => {
			const species = (d.species ?? "").trim() || "Unknown"
			const bill_length_mm = Number(d.bill_length_mm)
			const flipper_length_mm = Number(d.flipper_length_mm)
			const body_mass_g = Number(d.body_mass_g)
			if (
				Number.isNaN(bill_length_mm) ||
				Number.isNaN(flipper_length_mm) ||
				Number.isNaN(body_mass_g)
			)
				return null
			return { species, bill_length_mm, flipper_length_mm, body_mass_g }
		})
		.filter(
			(
				d,
			): d is {
				species: string
				bill_length_mm: number
				flipper_length_mm: number
				body_mass_g: number
			} => d !== null,
		)

	const width = 800
	const height = 600
	const margin = { top: 20, right: 30, bottom: 55, left: 60 }
	const innerWidth = width - margin.left - margin.right
	const innerHeight = height - margin.top - margin.bottom

	const svg = d3
		.select("#chart")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.style(
			"font-family",
			"system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
		)
		.style("font-size", "12px")

	if (parsed.length === 0) {
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height / 2)
			.attr("text-anchor", "middle")
			.attr("fill", "currentColor")
			.text("No valid rows (NaN values skipped)")
		return
	}

	const xExtent = d3.extent(parsed, (d) => d.flipper_length_mm) as [
		number,
		number,
	]
	const yExtent = d3.extent(parsed, (d) => d.body_mass_g) as [number, number]

	const x = d3
		.scaleLinear()
		.domain(padDomain(xExtent, 0.03))
		.range([margin.left, width - margin.right])
		.nice()

	const y = d3
		.scaleLinear()
		.domain(padDomain(yExtent, 0.03))
		.range([height - margin.bottom, margin.top])
		.nice()

	const r = d3
		.scaleSqrt()
		.domain(d3.extent(parsed, (d) => d.bill_length_mm) as [number, number])
		.range([5, 13])

	// ggplot2 theme_grey-like styling
	const panelBg = "#EBEBEB"
	const gridColor = "#FFFFFF"
	const axisText = "#4D4D4D"
	const titleText = "#333333"

	// Panel background
	svg.append("rect")
		.attr("x", margin.left)
		.attr("y", margin.top)
		.attr("width", innerWidth)
		.attr("height", innerHeight)
		.attr("fill", panelBg)

	// Major gridlines (white)
	const xGrid = d3
		.axisBottom(x)
		.tickSize(-innerHeight)
		.tickFormat(() => "")

	const yGrid = d3
		.axisLeft(y)
		.tickSize(-innerWidth)
		.tickFormat(() => "")

	svg.append("g")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(xGrid)
		.call((g) => g.select(".domain").remove())
		.call((g) =>
			g
				.selectAll<SVGLineElement, unknown>("line")
				.attr("stroke", gridColor)
				.attr("stroke-width", 1),
		)

	svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.call(yGrid)
		.call((g) => g.select(".domain").remove())
		.call((g) =>
			g
				.selectAll<SVGLineElement, unknown>("line")
				.attr("stroke", gridColor)
				.attr("stroke-width", 1),
		)

	const xAxis = d3.axisBottom(x).tickSizeOuter(0)
	const yAxis = d3.axisLeft(y).tickSizeOuter(0)

	svg.append("g")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(xAxis)
		.call((g) => g.select(".domain").remove())
		.call((g) => g.selectAll("line").remove())
		.call((g) => g.selectAll("text").attr("fill", axisText))

	svg.append("text")
		.attr("x", (margin.left + (width - margin.right)) / 2)
		.attr("y", height - 10)
		.attr("text-anchor", "middle")
		.attr("fill", titleText)
		.text("Flipper Length (mm)")

	svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.call(yAxis)
		.call((g) => g.select(".domain").remove())
		.call((g) => g.selectAll("line").remove())
		.call((g) => g.selectAll("text").attr("fill", axisText))

	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -(margin.top + (height - margin.bottom)) / 2)
		.attr("y", 18)
		.attr("text-anchor", "middle")
		.attr("fill", titleText)
		.text("Body Mass (g)")

	svg.append("g")
		.selectAll("circle")
		.data(parsed)
		.enter()
		.append("circle")
		.attr("cx", (d) => x(d.flipper_length_mm))
		.attr("cy", (d) => y(d.body_mass_g))
		.attr("r", (d) => r(d.bill_length_mm))
		.attr("fill", (d) => SPECIES_COLORS[d.species] ?? DEFAULT_SPECIES_COLOR)
		.attr("fill-opacity", 0.8)
		.attr(
			"stroke",
			(d) => SPECIES_COLORS[d.species] ?? DEFAULT_SPECIES_COLOR,
		)
		.attr("stroke-width", 0.5)
})

