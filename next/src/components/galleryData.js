export const CLOUD_NAME = "deodbdaxc";

export const getCloudinaryUrl = (publicId, width = 1200) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${publicId}`;

export const photoSections = [
  {
    slug: "washington-dc",
    title: "Washington D.C.",
    photos: [
      "IMG_0078_e7ossg",
      "IMG_0101_nzxq3r",
      "IMG_0102_noykcf",
      "IMG_0104_psmqqp",
      "IMG_0108_b9eoi4",
      "IMG_0109_cmfh3m",
      "IMG_0364_ydrfby",
      "IMG_0439_dq2tzj",
      "IMG_0440_zpxkjf",
      "IMG_0543_iitiuc",
      "IMG_0547_bvcr6g",
      "IMG_0765_pu9nb1",
      "IMG_0779_qh1nrc",
      "IMG_0894_cec1lu",
      "IMG_0901_ubkfyj",
      "IMG_0905_ly5aqw",
      "IMG_0908_ixrt0l",
      "IMG_1015_gueu52",
      "IMG_1107_reijzd",
    ],
  },
  {
    slug: "virginia",
    title: "Virginia",
    photos: [
      "IMG_0469_wrhfaf",
      "IMG_0471_v6y6in",
      "IMG_1142_lxeaj2",
      "IMG_1391_e34lou",
      "IMG_1396_rzum4p",
      "IMG_1398_xryzkz",
      "IMG_1401_ibxtcp",
      "IMG_1402_qj6hkx",
      "IMG_1403_oa6ghq",
      "IMG_1498_b4pzgw",
      "IMG_1511_hazeln",
      "IMG_1507_jgoyis",
      "IMG_1494_f1rdit",
      "samples/people/boy-snow-hoodie",
    ],
  },
  {
    slug: "baltimore",
    title: "Baltimore",
    photos: [
      "FullSizeR_lamwpt",
      "FullSizeR_kawt6z",
      "IMG_0608_sr0ixr",
      "FullSizeR_yeb66c",
      "FullSizeR_wwzqrj",
      "FullSizeR_fnx6qd",
    ],
  },
];

export const folders = photoSections.map((section) => ({
  slug: section.slug,
  title: section.title,
  count: `${section.photos.length} items`,
  images: section.photos
    .slice(0, 4)
    .map((publicId) => getCloudinaryUrl(publicId, 1200)),
}));

export const getSectionBySlug = (slug) =>
  photoSections.find((section) => section.slug === slug) ?? null;
