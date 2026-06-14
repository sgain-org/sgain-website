// Shared data for the PartnerNetwork diagram, used on the home and network
// pages so both render the same diagram (partner logos that link out).

export const networkPartners = [
  {
    label: "Bath Social & Development Research Ltd",
    imageSrc: "/network/bath_sdr.jpeg",
    href: "https://bathsdr.org/",
  },
  {
    label: "Universitas Gadjah Mada",
    imageSrc: "/network/universitas_gadjah_mada.jpg",
    href: "https://ugm.ac.id/en/",
  },
  {
    label: "Sustainable Development Policy Institute",
    imageSrc: "/network/sdpi.jpeg",
    href: "https://sdpi.org/",
  },
  {
    label: "University of Dhaka",
    imageSrc: "/network/dhaka_university_logo.png",
    href: "https://www.du.ac.bd/",
  },
  {
    label: "National University of Singapore",
    imageSrc: "/network/nus_logo.jpg",
    href: "https://www.nus.edu.sg/",
  },
  {
    label: "Fudan University",
    imageSrc: "/network/fudan_university_logo.png",
    href: "https://www.fudan.edu.cn/en/",
  },
] as const;

export const networkCentre = {
  label: "University of Bath",
  imageSrc: "/network/university_of_bath_logo.jpg",
  alt: "University of Bath",
} as const;
