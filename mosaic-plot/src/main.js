import { coordinator, DuckDBWASMConnector } from '@uwdata/mosaic-core';
import { loadCSV } from '@uwdata/mosaic-sql';
import * as vg from '@uwdata/vgplot';

const FILE_NAME = 'penglings.csv';

const wasm = new DuckDBWASMConnector({ log: false });
coordinator().databaseConnector(wasm);

const $x = vg.Param.value("flipper_length_mm");
const $y = vg.Param.value("body_mass_g");

/* AI Usage Note: Can you make sure that the x and y fields are parsed into numbers? */
await vg.coordinator().exec([
  loadCSV("penglings", `${window.location}${FILE_NAME}`, {
    where: `sex <> 'NA'`,
    // Ensure numeric types even if CSV inference yields strings.
    select: [
      `* REPLACE (
        try_cast(flipper_length_mm AS DOUBLE) AS flipper_length_mm,
        try_cast(body_mass_g AS DOUBLE) AS body_mass_g
      )`
    ]
  }),
]);

document.getElementById("plot").replaceChildren(
  vg.hconcat(
    vg.plot(
      vg.rDomain([30, 60]),
      vg.rRange([5, 10]),
      vg.colorRange(['orange', '#A550EF', 'darkcyan']),
      vg.dot(
        vg.from("penglings"),
        {x: vg.column($x), y: vg.column($y), fill: "species", stroke: "species", r: "bill_length_mm", fillOpacity: 0.8}
      ),
      vg.name("pplot"),
      vg.width(600),
      vg.height(400),
      vg.grid(true),
      vg.xLabel("Flipper Length (mm) →"),
      vg.yLabel("↑ Body mass (g)"),
    ),
    vg.colorLegend({for: "pplot", columns: 1}),
  )
)
