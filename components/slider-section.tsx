import { User } from "@/types/User";
import SkillSlider from "./skill-slider";

type SliderChangeHandler = (role: string) => (value: number[]) => void;

function SkillsSection({ formData, handleSliderChange }: { formData: User, handleSliderChange: SliderChangeHandler }) {
    
    return (
      <div>
        <SkillSlider
          id="productManagement"
          label="Product Management"
          description="Leading teams, coordinating tasks, and ensuring project success"
          value={formData.role_experience?.product_management}
          onValueChange={handleSliderChange("product_management")}
        />
        <SkillSlider
          id="software"
          label="Software Development"
          description="Programming, app development, and software architecture"
          value={formData.role_experience?.software}
          onValueChange={handleSliderChange("software")}
        />
        <SkillSlider
          id="hardware"
          label="Hardware Development"
          description="Electronics, prototyping, and physical computing"
          value={formData.role_experience?.hardware}
          onValueChange={handleSliderChange("hardware")}
        />
        <SkillSlider
          id="uiDesign"
          label="UI/UX Design"
          description="User interface design, user experience, wireframing, and prototyping"
          value={formData.role_experience?.design}
          onValueChange={handleSliderChange("design")}
        />
      </div>
    );
  }
  
  export default SkillsSection;
  