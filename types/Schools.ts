import Stanford from "@/public/assets/stanford-logo.png";
//import CSUF from "@/public/assets/csuf-logo.png";
import UTD from "@/public/assets/utd-logo.png";

export type School = {
  image: any;
  name: string;
  title: string;
}

export const schools: School[] = [
  {
    image: Stanford,
    name: "Stanford University",
    title: "Top university in the US"
  },
  // TODO: Add CSUF
  // {
  //   image: CSUF,
  //   name: "California State University, Fullerton",
  //   title: "Top public university in California"
  // },
  {
    image: UTD,
    name: "University of Texas, Dallas",
    title: "Top public university in Texas"
  }
]

export const degreeOptions = [
  "Bachelor of Science",
  "Bachelor of Arts",
  "Master of Science",
  "Master of Arts",
  "Doctor of Philosophy"
]
