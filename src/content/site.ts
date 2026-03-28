export const site = {
  name: "Gaby Salón y Spa",
  tagline: "Más de 17 años transformando tu belleza.",
  description:
    "Salón y spa profesional en Alajuela, Costa Rica. Servicios de cabello, uñas, depilación, maquillaje y más. Más de 17 años de experiencia.",
  url: "https://gabysalonyspa.com",
  accents: {
    accent: "201 168 76",  // gold
    accent2: "180 140 50", // dark gold
  },
  socials: {
    instagram: "https://www.instagram.com/gabysalon_spa",
    facebook: "https://www.facebook.com/share/1ACVB27UFD/",
    whatsapp: "50683468361", // digits only
  },
  contact: {
    address: "75 metros norte de Pollos del Este, La Agonía, Alajuela, Costa Rica",
    email: "gabysalon@gmail.com",
    phone: "+506 8346-8361",
    hours: [
      { day: "Lunes a Viernes", time: "8:00 a.m. – 6:00 p.m." },
      { day: "Sábado", time: "8:00 a.m. – 4:00 p.m." },
      { day: "Domingo", time: "Cerrado" },
    ],
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6691.536856207775!2d-84.21201302313156!3d10.018858090087546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fa2a56c2e2b7%3A0xfe00dcd8327ee770!2sGaby%20Sal%C3%B3n%20y%20Spa!5e1!3m2!1ses-419!2scr!4v1774046279919!5m2!1ses-419!2scrr",
  },
  highlights: [
    { title: "+17 años de experiencia", desc: "Profesionales con trayectoria y pasión por la belleza." },
    { title: "Atención personalizada", desc: "Cada clienta recibe asesoría adaptada a su estilo." },
    { title: "Productos de calidad", desc: "Usamos marcas reconocidas para cuidar tu cabello y piel." },
  ],
  services: [
    {
      category: "Cabello",
      items: [
        { name: "Corte & Peinado", desc: "Estilos modernos y clásicos con asesoría personalizada." },
        { name: "Color & Mechas", desc: "Tonos naturales, fantasía, balayage y correcciones de color." },
        { name: "Tratamientos", desc: "Hidratación profunda, keratina, reparación y brillo." },
        { name: "Alisado & Permanente", desc: "Resultados duraderos con técnica profesional." },
      ],
    },
    {
      category: "Uñas",
      items: [
        { name: "Manicure", desc: "Limpieza, forma, esmaltado y diseños creativos." },
        { name: "Pedicure", desc: "Cuidado completo de pies con masaje relajante." },
        { name: "Uñas Acrílicas / Gel", desc: "Extensiones de larga duración con acabado premium." },
      ],
    },
    {
      category: "Spa & Estética",
      items: [
        { name: "Depilación", desc: "Facial y corporal con técnica precisa y suave." },
        { name: "Maquillaje", desc: "Para ocasiones especiales, eventos y uso diario." },
        { name: "Tratamientos Faciales", desc: "Limpieza, hidratación y luminosidad para tu piel." },
      ],
    },
  ],
  gallery: [
    { src: "/images/gallery-1.png", alt: "Trabajo de uñas" },
    { src: "/images/gallery-2.png", alt: "Peinado profesional" },
    { src: "/images/gallery-3.png", alt: "Color y mechas" },
    { src: "/images/gallery-4.png", alt: "Uñas acrílicas" },
    { src: "/images/gallery-5.png", alt: "Tratamiento de cabello" },
    { src: "/images/gallery-6.png", alt: "Depilación" },
    { src: "/images/gallery-7.png", alt: "Diseño de uñas" },
    { src: "/images/gallery-8.png", alt: "Peinado de novia" },
    { src: "/images/gallery-9.png", alt: "Maquillaje artístico" },
  ],
  testimonials: [
    {
      name: "María F.",
      text: "Llevo años viniendo a Gaby Salón y siempre quedo encantada. El trato es increíble y los resultados hablan solos.",
    },
    {
      name: "Karla R.",
      text: "Las uñas me duraron más de tres semanas y el diseño quedó perfecto. Sin duda el mejor salón de Alajuela.",
    },
    {
      name: "Sofía V.",
      text: "Me hicieron el color y tratamiento de keratina y mi cabello quedó hermoso. Muy profesionales y puntuales.",
    },
    {
      name: "Andrea M.",
      text: "El ambiente es súper relajante y la atención de Gaby es de primera. Recomendadísimo para cualquier servicio.",
    },
  ],
};
