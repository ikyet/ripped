// Single source of truth for every garment — the moment sections, the
// gallery strip, the product modal, and the cart all read from this list
// instead of duplicating names/prices/copy in markup and JS separately.

export const SIZES = ["S", "M", "L", "XL"];

export const PRODUCTS = [
  {
    id: "bomber",
    index: "01",
    name: "Slashed Bomber",
    price: 780,
    material: "Waxed cotton",
    detail: "Hand-cut vents at the seam",
    description:
      "An oversized bomber cut from waxed cotton, with structural vents sliced by hand at the seam line rather than printed or laser-cut — each one falls slightly differently.",
    image: "/images/bomber.jpg",
    fit: "top",
    measurements: {
      unit: "cm",
      rows: ["Chest", "Length", "Sleeve"],
      S: [128, 68, 62],
      M: [134, 70, 64],
      L: [140, 72, 66],
      XL: [146, 74, 68],
    },
  },
  {
    id: "hoodie",
    index: "02",
    name: "Raw-Edge Hoodie",
    price: 340,
    material: "Double-layer fleece",
    detail: "Unfinished hem",
    description:
      "Double-layer fleece hoodie left unhemmed at the cuffs and body — the raw edge is the finish, not a defect. Runs oversized by design.",
    image: "/images/hoodie.jpg",
    fit: "top",
    measurements: {
      unit: "cm",
      rows: ["Chest", "Length", "Sleeve"],
      S: [130, 70, 60],
      M: [136, 72, 62],
      L: [142, 74, 64],
      XL: [148, 76, 66],
    },
  },
  {
    id: "denim",
    index: "03",
    name: "WRAPP Denim",
    price: 420,
    material: "Rigid selvedge",
    detail: "Structural fray at the knee",
    description:
      "Rigid selvedge denim in a wide, uncuffed leg, with a controlled structural fray worked into the knee during construction — it opens further with wear.",
    image: "/images/denim.jpg",
    fit: "bottom",
    measurements: {
      unit: "cm",
      rows: ["Waist", "Hip", "Inseam", "Leg opening"],
      S: [74, 108, 76, 26],
      M: [78, 112, 77, 27],
      L: [82, 116, 78, 28],
      XL: [88, 122, 79, 29],
    },
  },
  {
    id: "trench",
    index: "04",
    name: "Frayed Trench",
    price: 1240,
    material: "Brushed cotton",
    detail: "Unraveled cuffs",
    description:
      "A long-sleeve layering piece in brushed cotton, part of the outerwear line — the cuffs are unraveled by hand so the hem thread hangs loose rather than being locked off.",
    image: "/images/trench.png",
    fit: "top",
    measurements: {
      unit: "cm",
      rows: ["Chest", "Length", "Sleeve"],
      S: [118, 66, 60],
      M: [122, 68, 61],
      L: [126, 70, 62],
      XL: [130, 72, 63],
    },
  },
  {
    id: "cargo",
    index: "05",
    name: "Distressed Cargo",
    price: 460,
    material: "Six-pocket utility twill",
    detail: "Abraded panels",
    description:
      "Six-pocket utility trouser in heavyweight twill, hand-abraded at the panels that take the most wear first — the distressing follows where the fabric would actually break down.",
    image: "/images/cargo.jpg",
    fit: "bottom",
    measurements: {
      unit: "cm",
      rows: ["Waist", "Hip", "Inseam", "Leg opening"],
      S: [76, 104, 74, 22],
      M: [80, 108, 75, 23],
      L: [84, 112, 76, 24],
      XL: [90, 118, 77, 25],
    },
  },
  {
    id: "tee",
    index: "06",
    name: "Torn Layer Tee",
    price: 180,
    material: "Double-layer jersey",
    detail: "Exposed underlayer",
    description:
      "Double-layer jersey tee with slashes placed to expose the underlayer beneath — worn as a single piece or under the bomber for the full layered silhouette.",
    image: "/images/tee.jpg",
    fit: "top",
    measurements: {
      unit: "cm",
      rows: ["Chest", "Length", "Sleeve"],
      S: [116, 68, 22],
      M: [120, 70, 23],
      L: [124, 72, 24],
      XL: [128, 74, 25],
    },
  },
];

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}
