export const CLOUD_NAME = "deodbdaxc";

export const getCloudinaryUrl = (publicId, width = 1200) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${publicId}`;

// A photo entry can be either a plain public-id string, or an object
// { id, position } where `position` is a CSS object-position value used to
// control how the image is cropped inside the fixed-size polaroid frame.
export const getPhotoId = (photo) =>
  typeof photo === "string" ? photo : photo.id;

export const getPhotoPosition = (photo) =>
  typeof photo === "string" ? "center" : photo.position ?? "center";

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
  {
    slug: "seattle",
    title: "Seattle",
    photos: [
      "IMG_2743_cesazy",
      "IMG_2752_xgckrw",
      "IMG_2738_fjs95p",
      "IMG_2737_yneinm",
      "IMG_2593_cegsge",
      "IMG_2670_egohiu",
      "IMG_2582_zcf1lh",
      "IMG_2591_ithkqf",
      "IMG_2589_nhogym",
      "IMG_2425_dojw1e",
      "IMG_2580_ksyjm5",
      "IMG_2439_khosai",
      "IMG_2423_yl4xnw",
      "IMG_2406_wb7lzn",
      "IMG_2422_up19z2",
      "IMG_2409_id3xjd",
      "IMG_2416_q2ki12",
      "IMG_2418_slxdjy",
      "IMG_2376_ckmmkb",
      "IMG_2403_zwiyyj",
      "IMG_2344_ahjmik",
      "IMG_2327_diciwl",
      "IMG_2324_upco7s",
      "IMG_2341_sqcof1",
      "IMG_2281_sr9vbo",
      "IMG_2295_zdut4x",
      "IMG_2265_vgygoq",
      "IMG_2235_vywfwu",
      "IMG_2259_msktoi",
      "IMG_2225_sfomuz",
      "IMG_2233_yrwoin",
      "IMG_2222_yyomzj",
      "IMG_2219_o6e6rc",
      "IMG_2218_dpgjhn",
      "IMG_2199_hq39dm",
      "IMG_2187_dymfer",
      "IMG_2181_ikufjf",
      "IMG_2176_mwhcej",
      "IMG_2164_bld1pb",
      "IMG_2154_ntosbm",
      "IMG_2159_qffbzt",
      "IMG_2152_wvabvo",
      { id: "IMG_2155_vrsyyi", position: "center 30%" },
    ],
  },
];

export const folders = photoSections.map((section) => ({
  slug: section.slug,
  title: section.title,
  count: `${section.photos.length} items`,
  images: section.photos
    .slice(0, 4)
    .map((photo) => getCloudinaryUrl(getPhotoId(photo), 1200)),
}));

export const getSectionBySlug = (slug) =>
  photoSections.find((section) => section.slug === slug) ?? null;
